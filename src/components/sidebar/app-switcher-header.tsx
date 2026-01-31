import { useState, useRef, useEffect } from 'react'
import { PanelLeftClose, LayoutGrid } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useActiveApp } from '@/contexts/active-app-context'
import { useSidebarVisibility } from '@/contexts/sidebar-visibility-context'
import { getAppDefinition } from '@/types/apps'
import { Button } from '@/components/ui/button'
import { AppSwitcherMenu } from './app-switcher-menu'
import { cn } from '@/lib/utils'

export function AppSwitcherHeader() {
  const { t } = useTranslation('navigation')
  const { activeApp } = useActiveApp()
  const { toggleSidebars } = useSidebarVisibility()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const appDef = getAppDefinition(activeApp)
  const AppIcon = appDef.icon

  // Close menu on click outside
  useEffect(() => {
    if (!isMenuOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMenuOpen])

  // Close menu on Escape
  useEffect(() => {
    if (!isMenuOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isMenuOpen])

  return (
    <div className="relative" ref={menuRef}>
      <div
        className="p-2"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center gap-1">
          {/* 9-dots button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={t('apps.switchApp')}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>

          {/* App icon + name */}
          <div className="flex items-center gap-2 flex-1 min-w-0 px-1">
            <div className={cn('h-5 w-5 rounded flex items-center justify-center shrink-0', appDef.color)}>
              <AppIcon className="h-3 w-3 text-white" />
            </div>
            <span className="font-medium text-sm truncate">
              {t(appDef.label)}
            </span>
          </div>

          {/* Collapse button (visible on hover) */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'h-7 w-7 shrink-0 transition-opacity',
              isHovered ? 'opacity-100' : 'opacity-0'
            )}
            onClick={toggleSidebars}
            title={t('sidebar.hideSidebars')}
          >
            <PanelLeftClose className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* App Switcher Dropdown */}
      {isMenuOpen && (
        <div className="absolute top-full left-2 right-2 z-50 mt-1 bg-popover border border-border rounded-xl shadow-lg">
          <AppSwitcherMenu onClose={() => setIsMenuOpen(false)} />
        </div>
      )}
    </div>
  )
}
