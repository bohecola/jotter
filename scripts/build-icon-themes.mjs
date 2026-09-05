/*
  从 iconify 的图标包里抽出各文件图标主题用到的图标，生成 src/icon-themes/sets/<id>.json。

  整包（material 约 900 KB、vscode-icons 约 3.7 MB）不能直接打进产物，所以按主题规则表
  只取用到的几十个，运行时按主题懒加载。规则表就是 src/icon-themes/<id>.ts 里的 rules，
  这里 import 它（Node ≥ 22.6 带 --experimental-strip-types 可直接跑 .ts）。
  规则里写错的图标名在这里报错，而不是等到界面上出现空白。

  用法：pnpm icons:build。改了规则表要重新跑，生成的 JSON 进仓库。
*/
import { createRequire } from 'node:module'
import { mkdirSync, writeFileSync } from 'node:fs'
import { getIconData, iconToSVG } from '@iconify/utils'

const require = createRequire(import.meta.url)
const OUT = new URL('../src/icon-themes/sets/', import.meta.url)

const THEMES = [
  { id: 'material', pkg: '@iconify-json/material-icon-theme', mod: '../src/icon-themes/material.ts', name: 'material' },
  { id: 'vscode-icons', pkg: '@iconify-json/vscode-icons', mod: '../src/icon-themes/vscode-icons.ts', name: 'vscodeIcons' },
]

function iconNames(rules) {
  const names = new Set()
  const add = (v) => v && names.add(v)
  add(rules.file); add(rules.folder); add(rules.folderExpanded); add(rules.rootFolder); add(rules.rootFolderExpanded)
  for (const map of [rules.fileNames, rules.fileExtensions, rules.languageIds, rules.folderNames, rules.folderNamesExpanded]) {
    for (const v of Object.values(map ?? {})) add(v)
  }
  return [...names].sort()
}

mkdirSync(OUT, { recursive: true })
let failed = false
for (const theme of THEMES) {
  const { [theme.name]: meta } = await import(theme.mod)
  const set = require(`${theme.pkg}/icons.json`)
  const out = {}
  const missing = []
  for (const name of iconNames(meta.rules)) {
    const data = getIconData(set, name)
    if (!data) { missing.push(name); continue }
    // iconToSVG 会把 left/top/width/height 和 rotate/flip 都折算进 viewBox / body
    // （Material 里有些图标是 Material Symbols 的 0 -960 960 960 坐标系，光有 width/height 画不出来）
    const svg = iconToSVG(data)
    out[name] = { body: svg.body, viewBox: svg.attributes.viewBox }
  }
  if (missing.length) {
    failed = true
    console.error(`${theme.id}: ${missing.length} icon(s) not in ${theme.pkg}:\n  ${missing.join('\n  ')}`)
    continue
  }
  const json = JSON.stringify(out, null, 2) + '\n'
  writeFileSync(new URL(`${theme.id}.json`, OUT), json)
  console.log(`${theme.id}: ${Object.keys(out).length} icons, ${(json.length / 1024).toFixed(1)} KB (${set.info?.license?.title ?? 'license?'})`)
}
if (failed) process.exit(1)
