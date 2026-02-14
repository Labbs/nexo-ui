import { memo } from 'react'
import { cn } from '@/lib/utils'

interface SidebarItemProps {
  children: React.ReactNode
  onClick?: () => void
  isActive?: boolean
  className?: string
}

export const SidebarItem = memo(function SidebarItem({ children, onClick, isActive, className }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-2 px-2 py-1 rounded text-[14px]',
        'transition-colors duration-100',
        'hover:bg-accent',
        isActive && 'bg-accent text-foreground font-medium',
        !isActive && 'text-foreground/80 hover:text-foreground',
        className
      )}
    >
      {children}
    </button>
  )
})
