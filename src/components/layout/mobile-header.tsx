import { Menu } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import { useActiveApp } from '@/contexts/active-app-context'
import { getAppDefinition } from '@/types/apps'
import { cn } from '@/lib/utils'

interface MobileHeaderProps {
  onMenuClick: () => void
}

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  const { t } = useTranslation('navigation')
  const { user } = useAuth()
  const { activeApp } = useActiveApp()
  const appDef = getAppDefinition(activeApp)
  const AppIcon = appDef.icon

  return (
    <header className="h-14 border-b bg-background flex items-center px-4 gap-3 lg:hidden">
      {/* Menu button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuClick}
        className="shrink-0"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Active app indicator */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className={cn('h-6 w-6 rounded flex items-center justify-center shrink-0', appDef.color)}>
          <AppIcon className="h-3.5 w-3.5 text-white" />
        </div>
        <span className="font-medium text-sm truncate">
          {t(appDef.label)}
        </span>
      </div>

      {/* User avatar */}
      <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium shrink-0">
        {user?.username?.[0]?.toUpperCase()}
      </div>
    </header>
  )
}
