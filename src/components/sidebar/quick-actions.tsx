import { Home, Search, Inbox } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
<<<<<<< HEAD
import { useUIState } from '@/contexts/ui-state-context'
=======
import { useCommandPalette } from '@/contexts/command-palette-context'
>>>>>>> d4609d4 (feat: add hooks for managing spaces, users, versions, and webhooks)
import { Kbd } from '@/components/ui/kbd'

export function QuickActions() {
  const { t } = useTranslation('navigation')
  const navigate = useNavigate()
<<<<<<< HEAD
  const { setCommandPaletteOpen } = useUIState()
=======
  const { setCommandPaletteOpen } = useCommandPalette()
>>>>>>> d4609d4 (feat: add hooks for managing spaces, users, versions, and webhooks)

  return (
    <div className="px-2 py-1 space-y-0.5">
      <QuickActionItem
        icon={Home}
        label={t('quickActions.home')}
        onClick={() => navigate('/')}
      />
      <QuickActionItem
        icon={Search}
        label={t('quickActions.search')}
        extra={<Kbd>⌘K</Kbd>}
        onClick={() => setCommandPaletteOpen(true)}
      />
      <QuickActionItem
        icon={Inbox}
        label={t('quickActions.inbox')}
        onClick={() => {}}
      />
    </div>
  )
}

function QuickActionItem({
  icon: Icon,
  label,
  extra,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  extra?: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="flex-1 text-left">{label}</span>
      {extra && <span className="shrink-0">{extra}</span>}
    </button>
  )
}
