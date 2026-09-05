/*
  文件图标主题：注册表 + 按主题懒加载的图标集 + 给 React 用的订阅。

  设置项存主题 id（settings/context.ts）。彩色主题的图标在 sets/<id>.json 里，
  第一次用到时 import()，加载完通知订阅者重渲染；加载前 FileIcon 先画 minimal 的单色图标，
  尺寸一样，不会跳布局。
*/
import { useSyncExternalStore } from 'react'

import { material } from './material'
import { minimal } from './minimal'
import { vscodeIcons } from './vscode-icons'
import type { IconSet, IconThemeId, IconThemeMeta } from './types'

export type { IconRules, IconSet, IconTarget, IconThemeId, IconThemeMeta, SvgIcon } from './types'
export { resolveIcon } from './resolve'

/** 设置下拉的顺序 */
export const ICON_THEMES: readonly IconThemeMeta[] = [minimal, material, vscodeIcons]

export const DEFAULT_ICON_THEME: IconThemeId = 'material'

export function isIconTheme(v: unknown): v is IconThemeId {
  return ICON_THEMES.some((t) => t.id === v)
}

export function iconThemeOf(id: IconThemeId): IconThemeMeta {
  return ICON_THEMES.find((t) => t.id === id) ?? minimal
}

const loaders: Partial<Record<IconThemeId, () => Promise<IconSet>>> = {
  material: () => import('./sets/material.json').then((m) => m.default as IconSet),
  'vscode-icons': () => import('./sets/vscode-icons.json').then((m) => m.default as IconSet),
}

const loaded = new Map<IconThemeId, IconSet>()
const pending = new Set<IconThemeId>()
const listeners = new Set<() => void>()

/** 已加载就返回图标集；没加载则发起加载并先返回 null，加载完通过 subscribe 通知 */
export function getIconSet(id: IconThemeId): IconSet | null {
  const hit = loaded.get(id)
  if (hit) return hit
  const load = loaders[id]
  if (load && !pending.has(id)) {
    pending.add(id)
    load()
      .then((set) => {
        loaded.set(id, set)
        for (const fn of listeners) fn()
      })
      .catch((err: unknown) => console.error('[icon-themes] failed to load', id, err))
      .finally(() => pending.delete(id))
  }
  return null
}

function subscribe(fn: () => void) {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}

/** React 侧：拿某个主题的图标集，未加载时返回 null 并在加载完成后重渲染 */
export function useIconSet(id: IconThemeId): IconSet | null {
  return useSyncExternalStore(subscribe, () => getIconSet(id))
}
