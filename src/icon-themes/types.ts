/*
  文件图标主题的数据形状，照 VS Code 的 File Icon Theme 贡献点裁剪而来
  （iconDefinitions / fileNames / fileExtensions / languageIds / folderNames / folderNamesExpanded）。

  规则里的「图标引用」是个字符串，含义由主题的 render 决定：
  - 'class'：iconify 的 Tailwind 工具类（`icon-[lucide--folder]`），单色、走 currentColor。
    这些字符串必须逐字写在源码里，Tailwind 才扫得到（见 style/index.css 顶部的说明）。
  - 'svg'：sets/<id>.json 里的图标名，彩色 SVG，按主题懒加载。
*/

export type IconThemeId = 'minimal' | 'material' | 'vscode-icons'

export interface IconRules {
  /** 兜底：普通文件 / 收起的目录 / 展开的目录 */
  file: string
  folder: string
  folderExpanded: string
  /** 根目录行；缺省时用 folder / folderExpanded */
  rootFolder?: string
  rootFolderExpanded?: string
  /** 键全部小写。fileNames 是完整文件名；fileExtensions 支持多段后缀（`test.ts`、`d.ts`），长的优先 */
  fileNames?: Record<string, string>
  fileExtensions?: Record<string, string>
  /** Monaco 语言 id → 图标，文件名认不出时按语言兜底 */
  languageIds?: Record<string, string>
  folderNames?: Record<string, string>
  folderNamesExpanded?: Record<string, string>
}

export interface IconThemeMeta {
  id: IconThemeId
  /** 主题本名，不翻译（minimal 例外，它在设置里显示为翻译后的「简约」） */
  label: string
  render: 'class' | 'svg'
  rules: IconRules
}

/** sets/<id>.json 里的一条：iconify 的 body + 折算好的 viewBox（含 left/top 偏移） */
export interface SvgIcon {
  body: string
  viewBox: string
}

export type IconSet = Record<string, SvgIcon>

export interface IconTarget {
  name: string
  kind: 'file' | 'directory'
  expanded?: boolean
  /** 目录树的根目录行（VSCode Icons 有专门的根目录图标） */
  root?: boolean
  /** Monaco 语言 id；文件名认不出后缀时用它兜底 */
  language?: string | null
}
