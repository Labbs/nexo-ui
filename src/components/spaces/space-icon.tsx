import { cn } from '@/lib/utils'
import type { components } from '@/api/types'

type Space = components['schemas']['Space']

interface SpaceIconProps {
  space: Space
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showTooltip?: boolean
  style?: React.CSSProperties
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
}

export function SpaceIcon({ space, size = 'md', className, style: customStyle }: SpaceIconProps) {
  const backgroundColor = (space as any).icon_color || '#6366f1'
  const iconText = space.icon || space.name?.[0]?.toUpperCase() || '?'

  return (
    <div
      className={cn(
        'rounded-lg flex items-center justify-center font-medium transition-transform hover:scale-105',
        sizeClasses[size],
        className
      )}
      style={{
        backgroundColor,
        color: 'white',
        lineHeight: '1',
        paddingTop: '2px',
        ...customStyle,
      }}
      title={space.name}
    >
      {iconText}
    </div>
  )
}
