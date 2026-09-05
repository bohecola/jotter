import { cn } from '@/lib/utils'
import { Icon } from '@/components/ui/icon'
import { useSettings } from '@/settings/context'
import { iconThemeOf, resolveIcon, useIconSet, type IconTarget, type IconThemeId } from '@/icon-themes'
import { minimal } from '@/icon-themes/minimal'

interface FileIconProps extends IconTarget {
  /** 不传就用设置里选的主题；设置面板的预览用它指定某个主题 */
  theme?: IconThemeId
  className?: string
}

/**
 * 目录树 / 标签栏里的文件、目录图标，按当前文件图标主题解析。
 * 尺寸和 ui/icon 一样由外面的容器决定（侧栏的 ICON_SLOT、标签栏各自定）。
 * 彩色主题的图标集还没加载完时先画 minimal 的单色图标占位，同尺寸，不跳布局。
 */
export function FileIcon({ theme, className, ...target }: FileIconProps) {
  const { settings } = useSettings()
  const meta = iconThemeOf(theme ?? settings.iconTheme)
  const set = useIconSet(meta.id)

  const svg = meta.render === 'svg' ? set?.[resolveIcon(meta.rules, target)] : undefined
  if (!svg) {
    const cls = resolveIcon(meta.render === 'class' ? meta.rules : minimal.rules, target)
    return <Icon className={cn(cls, className)} />
  }
  return (
    <span
      aria-hidden
      data-slot="icon"
      className={cn('pointer-events-none inline-block shrink-0', className)}
    >
      <svg
        viewBox={svg.viewBox}
        width="100%"
        height="100%"
        // iconify 的 body 就是 <svg> 的内部内容；来源是仓库里生成的 JSON，不是用户输入
        dangerouslySetInnerHTML={{ __html: svg.body }}
      />
    </span>
  )
}
