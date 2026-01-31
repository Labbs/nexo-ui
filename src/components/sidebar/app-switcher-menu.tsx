import { useTranslation } from 'react-i18next'
import { useActiveApp } from '@/contexts/active-app-context'
import { APP_REGISTRY, type AppId } from '@/types/apps'
import { cn } from '@/lib/utils'

interface AppSwitcherMenuProps {
  onClose: () => void
}

export function AppSwitcherMenu({ onClose }: AppSwitcherMenuProps) {
  const { t } = useTranslation('navigation')
  const { activeApp, setActiveApp } = useActiveApp()

  const handleSelect = (appId: AppId) => {
    setActiveApp(appId)
    onClose()
  }

  return (
    <div className="p-3">
      <div className="grid grid-cols-3 gap-2">
        {APP_REGISTRY.map((app) => {
          const isActive = activeApp === app.id
          const Icon = app.icon

          return (
            <button
              key={app.id}
              onClick={() => !app.comingSoon && handleSelect(app.id)}
              disabled={app.comingSoon}
              className={cn(
                'flex flex-col items-center gap-1.5 p-3 rounded-xl transition-colors',
                app.comingSoon
                  ? 'opacity-60 cursor-default'
                  : 'hover:bg-accent',
                isActive && !app.comingSoon && 'bg-accent ring-1 ring-border'
              )}
            >
              <div
                className={cn(
                  'h-10 w-10 rounded-xl flex items-center justify-center',
                  app.color
                )}
              >
                <Icon className="h-5 w-5 text-white" />
              </div>
              <span className="text-xs font-medium">
                {t(app.label)}
              </span>
              {app.comingSoon && (
                <span className="text-[10px] text-muted-foreground">
                  {t('apps.comingSoon')}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
