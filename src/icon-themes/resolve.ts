import type { IconRules, IconTarget } from './types'

/**
 * 按 VS Code 的优先级找图标：
 *   文件：完整文件名 > 最长的多段后缀 > 单段后缀 > 语言 > 默认文件
 *   目录：目录名（区分展开 / 收起）> 默认目录（区分展开 / 收起）
 * 返回的是主题里的图标引用（类名或图标名），含义见 types.ts。
 */
export function resolveIcon(rules: IconRules, target: IconTarget): string {
  const lower = target.name.toLowerCase()

  if (target.kind === 'directory') {
    if (target.root) {
      const root = target.expanded ? rules.rootFolderExpanded : rules.rootFolder
      if (root) return root
    }
    const byName = target.expanded ? rules.folderNamesExpanded?.[lower] : rules.folderNames?.[lower]
    return byName ?? (target.expanded ? rules.folderExpanded : rules.folder)
  }

  const byName = rules.fileNames?.[lower]
  if (byName) return byName

  // foo.test.ts → 先试 test.ts 再试 ts；.gitignore → gitignore
  const parts = lower.split('.')
  for (let i = 1; i < parts.length; i++) {
    const hit = rules.fileExtensions?.[parts.slice(i).join('.')]
    if (hit) return hit
  }

  if (target.language) {
    const byLang = rules.languageIds?.[target.language]
    if (byLang) return byLang
  }
  return rules.file
}
