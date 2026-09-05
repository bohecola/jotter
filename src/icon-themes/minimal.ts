import type { IconThemeMeta } from './types'

/*
  单色线条图标（lucide），走 Tailwind 工具类。
  类名必须逐字出现在源码里 —— 这张表就是那份「源码」，别改成拼字符串。
*/
const code = 'icon-[lucide--file-code-2]'
const text = 'icon-[lucide--file-text]'
const braces = 'icon-[lucide--braces]'
const image = 'icon-[lucide--image]'

export const minimal: IconThemeMeta = {
  id: 'minimal',
  label: 'Minimal',
  render: 'class',
  rules: {
    file: 'icon-[lucide--file]',
    folder: 'icon-[lucide--folder]',
    folderExpanded: 'icon-[lucide--folder-open]',
    fileExtensions: {
      png: image, jpg: image, jpeg: image, gif: image, webp: image, ico: image, svg: image,
    },
    languageIds: {
      javascript: code, typescript: code, html: code, css: code, scss: code, less: code,
      xml: code, shell: code, sql: code,
      json: braces,
      markdown: text, yaml: text, plaintext: text,
    },
  },
}
