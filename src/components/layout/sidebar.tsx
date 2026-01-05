import { FileText, Plus, Settings, Moon, Sun, X, PanelLeftClose, ChevronRight, ChevronsUpDown, Check, FolderPlus, Database, Pencil, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { EditSpaceModal } from '@/components/spaces/edit-space-modal'
import { useCurrentSpace } from '@/contexts/space-context'
import { useDocuments, useCreateDocument } from '@/hooks/use-documents'
import { DocumentTree } from '@/components/document/DocumentTree'
import { DatabaseTree } from '@/components/database/DatabaseTree'
import { CreateDatabaseModal } from '@/components/database/common/create-database-modal'
import { useFavorites } from '@/hooks/use-favorites'
import { useSpaces } from '@/hooks/use-spaces'
import { useToast } from '@/components/ui/toaster'
import { useAuth } from '@/contexts/auth-context'
import { useMediaQuery } from '@/hooks/use-media-query'
import { useResizable } from '@/hooks/use-resizable'
import { useSidebarVisibility } from '@/contexts/sidebar-visibility-context'
import { useUIState } from '@/contexts/ui-state-context'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Sidebar item component with Notion-like hover
function SidebarItem({
  children,
  onClick,
  isActive,
  className,
}: {
  children: React.ReactNode
  onClick?: () => void
  isActive?: boolean
  className?: string
}) {
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
}

interface SidebarProps {
  onClose?: () => void
  onCreateSpace?: () => void
}

export function Sidebar({ onClose, onCreateSpace }: SidebarProps) {
  const navigate = useNavigate()
  const { slug } = useParams<{ slug?: string }>()
  const { currentSpace, setCurrentSpace, canEdit } = useCurrentSpace()
  const { data: spaces = [] } = useSpaces()
  const { data: documents = [], isLoading: isLoadingDocs } = useDocuments(currentSpace?.id)
  const { mutateAsync: createDocument } = useCreateDocument()
  const { data: favorites = [], isLoading: isLoadingFavs } = useFavorites()
  const { show } = useToast()
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const { toggleSidebars } = useSidebarVisibility()
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const { width, isResizing, handleMouseDown } = useResizable({
    minWidth: 200,
    maxWidthVw: 33,
    defaultWidth: 256,
  })

  const rootDocuments = documents.filter((doc) => !(doc as any).parent_id)
  const [isEditSpaceOpen, setIsEditSpaceOpen] = useState(false)
  const [isCreateDatabaseOpen, setIsCreateDatabaseOpen] = useState(false)
  const { favoritesExpanded, setFavoritesExpanded } = useUIState()

  return (
    <aside
      className="border-r border-border/40 flex flex-col h-full relative"
      style={{
        width: isDesktop ? `${width}px` : '16rem',
        backgroundColor: 'hsl(var(--sidebar))',
      }}
    >
      {/* Header with space selector - only show on desktop */}
      {isDesktop && (
        <div className="p-2">
          <div className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex-1 justify-start gap-2 px-2 h-8 min-w-0"
                >
                  {currentSpace ? (
                    <>
                      <div
                        className="h-5 w-5 rounded flex items-center justify-center text-xs font-medium shrink-0"
                        style={{
                          backgroundColor: (currentSpace as any).icon_color || '#6366f1',
                          color: 'white',
                        }}
                      >
                        {currentSpace.icon || currentSpace.name?.[0]?.toUpperCase()}
                      </div>
                      <span className="font-medium truncate">{currentSpace.name}</span>
                    </>
                  ) : (
                    <span className="text-muted-foreground">Select a space</span>
                  )}
                  <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 opacity-50 ml-auto" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {spaces.map((space) => (
                  <DropdownMenuItem
                    key={space.id}
                    onClick={() => {
                      setCurrentSpace(space)
                      navigate(`/space/${space.id}`)
                    }}
                    className="flex items-center gap-2"
                  >
                    <div
                      className="h-5 w-5 rounded flex items-center justify-center text-xs font-medium shrink-0"
                      style={{
                        backgroundColor: (space as any).icon_color || '#6366f1',
                        color: 'white',
                      }}
                    >
                      {space.icon || space.name?.[0]?.toUpperCase()}
                    </div>
                    <span className="truncate flex-1">{space.name}</span>
                    {currentSpace?.id === space.id && (
                      <Check className="h-4 w-4 shrink-0" />
                    )}
                  </DropdownMenuItem>
                ))}
                {currentSpace && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setIsEditSpaceOpen(true)}>
                      <Settings className="h-4 w-4 mr-2" />
                      Space settings
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onCreateSpace}>
                  <FolderPlus className="h-4 w-4 mr-2" />
                  Create new space
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={toggleSidebars}
              title="Hide sidebars"
            >
              <PanelLeftClose className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Mobile close button */}
      {!isDesktop && onClose && (
        <div className="p-3 border-b flex items-center justify-between">
          <span className="font-semibold">Menu</span>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
        {/* Favorites Section */}
        {(isLoadingFavs || favorites.length > 0) && (
          <div className="mb-3">
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
              <span className="uppercase tracking-wider">Favorites</span>
            </button>
            {favoritesExpanded && (
              <div className="mt-1 space-y-0.5">
                {isLoadingFavs && (
                  <>
                    <div className="h-7 rounded bg-muted/50 animate-pulse mx-1" />
                    <div className="h-7 rounded bg-muted/50 animate-pulse mx-1" />
                  </>
                )}
                {!isLoadingFavs && favorites.map((favorite) => {
                  const doc = (favorite as any).document
                  const docSlug = doc?.slug
                  const docIcon = doc?.config?.icon
                  const isActive = docSlug && slug === docSlug
                  return (
                    <SidebarItem
                      key={favorite.id}
                      isActive={isActive}
                      onClick={() => {
                        if (currentSpace?.id && docSlug) {
                          navigate(`/space/${currentSpace.id}/${docSlug}`)
                        }
                      }}
                    >
                      {docIcon ? (
                        <span className="text-base shrink-0">{docIcon}</span>
                      ) : (
                        <FileText className="h-4 w-4 shrink-0 opacity-60" />
                      )}
                      <span className="truncate">{doc?.name || 'Untitled'}</span>
                    </SidebarItem>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Private Section */}
        {currentSpace && (
          <div>
            <div className="flex items-center justify-between px-2 py-1 group">
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                Private
              </span>
              {canEdit && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Add new..."
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    <DropdownMenuItem
                      onClick={async () => {
                        if (!currentSpace?.id) return
                        try {
                          const doc = await createDocument({ spaceId: currentSpace.id })
                          const docSlug = (doc as any).slug
                          if (docSlug) navigate(`/space/${currentSpace.id}/${docSlug}`)
                        } catch (e) {
                          show({ title: 'Failed to create page', variant: 'destructive' })
                        }
                      }}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      New page
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setIsCreateDatabaseOpen(true)}
                    >
                      <Database className="h-4 w-4 mr-2" />
                      New database
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      disabled
                      className="text-muted-foreground"
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Excalidraw
                      <span className="ml-auto text-xs">Soon</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            <div className="mt-1 space-y-0.5">
              {isLoadingDocs ? (
                <>
                  <div className="h-7 rounded bg-muted/50 animate-pulse mx-1" />
                  <div className="h-7 rounded bg-muted/50 animate-pulse mx-1" />
                  <div className="h-7 rounded bg-muted/50 animate-pulse mx-1" />
                </>
              ) : rootDocuments.length === 0 ? (
                <>
                  {/* Show databases even if no documents */}
                  <DatabaseTree spaceId={currentSpace.id!} canEdit={canEdit} />
                  <div className="px-2 py-6 text-xs text-muted-foreground text-center">
                    <p>No pages yet</p>
                    {canEdit && (
                      <button
                        onClick={async () => {
                          if (!currentSpace?.id) return
                          try {
                            const doc = await createDocument({ spaceId: currentSpace.id })
                            const docSlug = (doc as any).slug
                            if (docSlug) navigate(`/space/${currentSpace.id}/${docSlug}`)
                          } catch (e) {
                            show({ title: 'Failed to create page', variant: 'destructive' })
                          }
                        }}
                        className="mt-2 text-primary hover:underline"
                      >
                        Create your first page
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <DocumentTree spaceId={currentSpace.id!} canEdit={canEdit} />
                  <DatabaseTree spaceId={currentSpace.id!} canEdit={canEdit} />
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer with user menu - only on desktop */}
      {isDesktop && (
        <div className="p-2 border-t">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                    {user?.username?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm truncate">{user?.username}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                {theme === 'dark' ? (
                  <>
                    <Sun className="h-4 w-4 mr-2" />
                    Light mode
                  </>
                ) : (
                  <>
                    <Moon className="h-4 w-4 mr-2" />
                    Dark mode
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>
              {user?.role === 'admin' && (
                <DropdownMenuItem onClick={() => navigate('/admin')}>
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Administration
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Mobile user menu */}
      {!isDesktop && (
        <div className="p-2 border-t space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="h-4 w-4 mr-2" />
                Light mode
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 mr-2" />
                Dark mode
              </>
            )}
          </Button>
          <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/settings')}>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          {user?.role === 'admin' && (
            <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/admin')}>
              <ShieldCheck className="h-4 w-4 mr-2" />
              Administration
            </Button>
          )}
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive"
            onClick={logout}
          >
            Log out
          </Button>
        </div>
      )}

      {/* Resize handle - desktop only */}
      {isDesktop && (
        <div
          className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary/20 active:bg-primary/30 transition-colors"
          onMouseDown={handleMouseDown}
          style={{ cursor: isResizing ? 'col-resize' : undefined }}
        />
      )}

      {/* Edit Space Modal */}
      <EditSpaceModal open={isEditSpaceOpen} onOpenChange={setIsEditSpaceOpen} />

      {/* Create Database Modal */}
      {currentSpace?.id && (
        <CreateDatabaseModal
          open={isCreateDatabaseOpen}
          onOpenChange={setIsCreateDatabaseOpen}
          spaceId={currentSpace.id}
          onSuccess={(databaseId) => {
            navigate(`/space/${currentSpace.id}/database/${databaseId}`)
          }}
        />
      )}
    </aside>
  )
}
