import {
  Settings,
  Moon,
  Sun,
  ShieldCheck,
  ChevronUp,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface UserMenuProps {
  user: { username?: string; role?: string } | null
  isDarkMode: boolean
  toggleTheme: () => void
  navigateToSettings: () => void
  navigateToAdmin: () => void
  isAdmin: boolean
  logout: () => void
  isMobile?: boolean
}

export function UserMenu({
  user,
  isDarkMode,
  toggleTheme,
  navigateToSettings,
  navigateToAdmin,
  isAdmin,
  logout,
  isMobile = false,
}: UserMenuProps) {
  const { t } = useTranslation('navigation')

  if (isMobile) {
    return <MobileUserMenu {...{ user, isDarkMode, toggleTheme, navigateToSettings, navigateToAdmin, isAdmin, logout }} />
  }

  return (
    <div className="p-2 border-t">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-full justify-between h-9">
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium shrink-0">
                {user?.username?.[0]?.toUpperCase()}
              </div>
              <span className="text-sm truncate">{user?.username}</span>
            </div>
            <ChevronUp className="h-3.5 w-3.5 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={toggleTheme}>
            {isDarkMode ? (
              <>
                <Sun className="h-4 w-4 mr-2" />
                {t('common:theme.light')}
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 mr-2" />
                {t('common:theme.dark')}
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={navigateToSettings}>
            <Settings className="h-4 w-4 mr-2" />
            {t('sidebar.settings')}
          </DropdownMenuItem>
          {isAdmin && (
            <DropdownMenuItem onClick={navigateToAdmin}>
              <ShieldCheck className="h-4 w-4 mr-2" />
              {t('sidebar.administration')}
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout}>
            {t('sidebar.logOut')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

function MobileUserMenu({
  isDarkMode,
  toggleTheme,
  navigateToSettings,
  navigateToAdmin,
  isAdmin,
  logout,
}: Omit<UserMenuProps, 'isMobile'>) {
  const { t } = useTranslation('navigation')

  return (
    <div className="p-2 border-t space-y-1">
      <Button variant="ghost" className="w-full justify-start" onClick={toggleTheme}>
        {isDarkMode ? (
          <>
            <Sun className="h-4 w-4 mr-2" />
            {t('common:theme.light')}
          </>
        ) : (
          <>
            <Moon className="h-4 w-4 mr-2" />
            {t('common:theme.dark')}
          </>
        )}
      </Button>
      <Button variant="ghost" className="w-full justify-start" onClick={navigateToSettings}>
        <Settings className="h-4 w-4 mr-2" />
        {t('sidebar.settings')}
      </Button>
      {isAdmin && (
        <Button variant="ghost" className="w-full justify-start" onClick={navigateToAdmin}>
          <ShieldCheck className="h-4 w-4 mr-2" />
          {t('sidebar.administration')}
        </Button>
      )}
      <Button variant="ghost" className="w-full justify-start text-destructive" onClick={logout}>
        {t('sidebar.logOut')}
      </Button>
    </div>
  )
}
