import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SpaceSwitcher } from '@/components/spaces/space-switcher'
import { useAuth } from '@/contexts/auth-context'

interface MobileHeaderProps {
  onMenuClick: () => void
}

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  const { user } = useAuth()

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

      {/* Space switcher */}
      <div className="flex-1 min-w-0">
        <SpaceSwitcher />
      </div>

      {/* User avatar */}
      <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium shrink-0">
        {user?.username?.[0]?.toUpperCase()}
      </div>
    </header>
  )
}
