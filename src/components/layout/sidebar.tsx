import {
  FileText,
  ChevronRight,
  X,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { useCallback, useState } from 'react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { EditSpaceModal } from '@/components/spaces/edit-space-modal'
import { SidebarItem } from '@/components/sidebar/sidebar-item'
import { AppSwitcherHeader } from '@/components/sidebar/app-switcher-header'
import { QuickActions } from '@/components/sidebar/quick-actions'
import { SpacesList } from '@/components/sidebar/spaces-list'
import { UserMenu } from '@/components/sidebar/user-menu'
import { cn, parseStoredIcon } from '@/lib/utils'
import { DocumentIcon } from '@/components/ui/icon-picker'
import { useAuth } from '@/contexts/auth-context'
import { useCurrentSpace } from '@/contexts/space-context'
<<<<<<< HEAD
import { useUIState } from '@/contexts/ui-state-context'
=======
import { useSidebarUI } from '@/contexts/sidebar-ui-context'
>>>>>>> d4609d4 (feat: add hooks for managing spaces, users, versions, and webhooks)
import { useFavorites } from '@/hooks/use-favorites'
import { useMediaQuery } from '@/hooks/use-media-query'
import { useResizable } from '@/hooks/use-resizable'

// Types for favorite
interface Favorite {
  id: string
  document?: {
    id?: string
    name?: string
    slug?: string
    config?: { icon?: string }
  }
}

interface SidebarProps {
  onClose?: () => void
  onCreateSpace?: () => void
}

export function Sidebar({ onClose, onCreateSpace: _onCreateSpace }: SidebarProps) {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const { width, isResizing, handleMouseDown } = useResizable({
    minWidth: 200,
    maxWidthVw: 33,
    defaultWidth: 256,
  })
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const isDarkMode = theme === 'dark'
  const toggleTheme = useCallback(() => {
    setTheme(isDarkMode ? 'light' : 'dark')
  }, [isDarkMode, setTheme])
  const navigate = useNavigate()
  const isAdmin = user?.role === 'admin'

  const [isEditSpaceOpen, setIsEditSpaceOpen] = useState(false)
<<<<<<< HEAD
=======
  const navigateToSettings = useCallback(() => navigate('/user/settings'), [navigate])
  const navigateToAdmin = useCallback(() => navigate('/admin'), [navigate])
>>>>>>> d4609d4 (feat: add hooks for managing spaces, users, versions, and webhooks)

  return (
    <aside
      className="border-r border-border/40 flex flex-col h-full relative"
      style={{
        width: isDesktop ? `${width}px` : '16rem',
        backgroundColor: 'hsl(var(--sidebar))',
      }}
    >
      {/* Header */}
      {isDesktop ? (
        <AppSwitcherHeader />
      ) : (
        onClose && <MobileHeader onClose={onClose} />
      )}

      {/* Quick Actions */}
      <QuickActions />

      {/* Favorites Section */}
      <FavoritesSection />

      {/* Spaces List (scrollable) */}
      <SpacesList />

      {/* User Menu */}
      <UserMenu
        user={user}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
<<<<<<< HEAD
        navigateToSettings={() => navigate('/user/settings')}
        navigateToAdmin={() => navigate('/admin')}
=======
        navigateToSettings={navigateToSettings}
        navigateToAdmin={navigateToAdmin}
>>>>>>> d4609d4 (feat: add hooks for managing spaces, users, versions, and webhooks)
        isAdmin={isAdmin}
        logout={logout}
        isMobile={!isDesktop}
      />

      {/* Resize handle - desktop only */}
      {isDesktop && (
        <div
          className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary/20 active:bg-primary/30 transition-colors"
          onMouseDown={handleMouseDown}
          style={{ cursor: isResizing ? 'col-resize' : undefined }}
        />
      )}

      {/* Modals */}
      <EditSpaceModal open={isEditSpaceOpen} onOpenChange={setIsEditSpaceOpen} />
    </aside>
  )
}

// Mobile Header Component
function MobileHeader({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation('navigation')

  return (
    <div className="p-3 border-b flex items-center justify-between">
      <span className="font-semibold">{t('sidebar.menu')}</span>
      <Button variant="ghost" size="icon" onClick={onClose}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}

// Favorites Section Component
function FavoritesSection() {
  const { t } = useTranslation('navigation')
  const navigate = useNavigate()
  const { slug } = useParams<{ slug?: string }>()
  const { currentSpace } = useCurrentSpace()
  const { data: favorites = [], isLoading: isLoadingFavs } = useFavorites()
<<<<<<< HEAD
  const { favoritesExpanded, setFavoritesExpanded } = useUIState()

  if (!isLoadingFavs && favorites.length === 0) return null

  const handleFavoriteClick = (favorite: Favorite) => {
=======
  const { favoritesExpanded, setFavoritesExpanded } = useSidebarUI()

  if (!isLoadingFavs && favorites.length === 0) return null

  const handleFavoriteClick = useCallback((favorite: Favorite) => {
>>>>>>> d4609d4 (feat: add hooks for managing spaces, users, versions, and webhooks)
    const doc = favorite.document
    const docSlug = doc?.slug
    if (currentSpace?.id && docSlug) {
      navigate(`/space/${currentSpace.id}/${docSlug}`)
    }
<<<<<<< HEAD
  }

  const isFavoriteActive = (favorite: Favorite) => {
    const docSlug = favorite.document?.slug
    return !!(docSlug && slug === docSlug)
  }
=======
  }, [currentSpace?.id, navigate])

  const isFavoriteActive = useCallback((favorite: Favorite) => {
    const docSlug = favorite.document?.slug
    return !!(docSlug && slug === docSlug)
  }, [slug])
>>>>>>> d4609d4 (feat: add hooks for managing spaces, users, versions, and webhooks)

  return (
    <div className="px-2 mb-1">
      <button
        onClick={() => setFavoritesExpanded(!favoritesExpanded)}
        className="w-full flex items-center gap-1.5 px-2 py-1 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronRight
          className={cn(
            'h-3 w-3 transition-transform duration-150',
            favoritesExpanded && 'rotate-90'
          )}
        />
        <span className="uppercase tracking-wider">{t('sidebar.favorites')}</span>
      </button>
      {favoritesExpanded && (
        <div className="mt-1 space-y-0.5">
          {isLoadingFavs ? (
            <>
              <div className="h-7 rounded bg-muted/50 animate-pulse mx-1" />
              <div className="h-7 rounded bg-muted/50 animate-pulse mx-1" />
            </>
          ) : (
            (favorites as Favorite[]).map((favorite) => {
              const doc = favorite.document
              const docIcon = parseStoredIcon(doc?.config?.icon)

              return (
                <SidebarItem
                  key={favorite.id}
                  isActive={isFavoriteActive(favorite)}
                  onClick={() => handleFavoriteClick(favorite)}
                >
                  {docIcon ? (
                    <DocumentIcon value={docIcon} size="sm" />
                  ) : (
                    <FileText className="h-4 w-4 shrink-0 opacity-60" />
                  )}
                  <span className="truncate">{doc?.name || t('common:untitled')}</span>
                </SidebarItem>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
