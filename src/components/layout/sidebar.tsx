import {
  FileText,
  Plus,
  Settings,
  Moon,
  Sun,
  X,
  PanelLeftClose,
  ChevronRight,
  ChevronsUpDown,
  Check,
  FolderPlus,
  Database,
  Table2,
  Pencil,
  ShieldCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EditSpaceModal } from '@/components/spaces/edit-space-modal'
import { DocumentTree } from '@/components/document/DocumentTree'
import { DatabaseTree } from '@/components/database/DatabaseTree'
import { DrawingTree } from '@/components/drawing/DrawingTree'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Import the hook that contains all logic
import { useSidebar, type Space, type Favorite } from '@/hooks/ui/useSidebar'

// Sidebar item component
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
  const sb = useSidebar()

  return (
    <aside
      className="border-r border-border/40 flex flex-col h-full relative"
      style={{
        width: sb.isDesktop ? `${sb.width}px` : '16rem',
        backgroundColor: 'hsl(var(--sidebar))',
      }}
    >
      {/* Desktop header with space selector */}
      {sb.isDesktop && (
        <DesktopHeader sb={sb} onCreateSpace={onCreateSpace} />
      )}

      {/* Mobile header */}
      {!sb.isDesktop && onClose && (
        <MobileHeader onClose={onClose} />
      )}

      {/* Main content */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
        {/* Favorites Section */}
        <FavoritesSection sb={sb} />

        {/* Private Section */}
        <PrivateSection sb={sb} />
      </div>

      {/* Desktop footer with user menu */}
      {sb.isDesktop && (
        <DesktopUserMenu sb={sb} />
      )}

      {/* Mobile footer with user menu */}
      {!sb.isDesktop && (
        <MobileUserMenu sb={sb} />
      )}

      {/* Resize handle - desktop only */}
      {sb.isDesktop && (
        <div
          className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary/20 active:bg-primary/30 transition-colors"
          onMouseDown={sb.handleMouseDown}
          style={{ cursor: sb.isResizing ? 'col-resize' : undefined }}
        />
      )}

      {/* Modals */}
      <EditSpaceModal open={sb.isEditSpaceOpen} onOpenChange={sb.setIsEditSpaceOpen} />
    </aside>
  )
}

// Desktop Header Component
function DesktopHeader({
  sb,
  onCreateSpace,
}: {
  sb: ReturnType<typeof useSidebar>
  onCreateSpace?: () => void
}) {
  return (
    <div className="p-2">
      <div className="flex items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex-1 justify-start gap-2 px-2 h-8 min-w-0">
              {sb.currentSpace ? (
                <>
                  <SpaceIcon space={sb.currentSpace} />
                  <span className="font-medium truncate">{sb.currentSpace.name}</span>
                </>
              ) : (
                <span className="text-muted-foreground">Select a space</span>
              )}
              <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 opacity-50 ml-auto" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {sb.spaces.map((space) => (
              <DropdownMenuItem
                key={space.id}
                onClick={() => sb.handleSpaceChange(space)}
                className="flex items-center gap-2"
              >
                <SpaceIcon space={space} />
                <span className="truncate flex-1">{space.name}</span>
                {sb.currentSpace?.id === space.id && (
                  <Check className="h-4 w-4 shrink-0" />
                )}
              </DropdownMenuItem>
            ))}
            {sb.currentSpace && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => sb.setIsEditSpaceOpen(true)}>
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
          onClick={sb.toggleSidebars}
          title="Hide sidebars"
        >
          <PanelLeftClose className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// Mobile Header Component
function MobileHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="p-3 border-b flex items-center justify-between">
      <span className="font-semibold">Menu</span>
      <Button variant="ghost" size="icon" onClick={onClose}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}

// Space Icon Component
function SpaceIcon({ space }: { space: Space }) {
  return (
    <div
      className="h-5 w-5 rounded flex items-center justify-center text-xs font-medium shrink-0"
      style={{
        backgroundColor: space.icon_color || '#6366f1',
        color: 'white',
      }}
    >
      {space.icon || space.name?.[0]?.toUpperCase()}
    </div>
  )
}

// Favorites Section Component
function FavoritesSection({ sb }: { sb: ReturnType<typeof useSidebar> }) {
  if (!sb.isLoadingFavs && sb.favorites.length === 0) return null

  return (
    <div className="mb-3">
      <button
        onClick={() => sb.setFavoritesExpanded(!sb.favoritesExpanded)}
        className="w-full flex items-center gap-1.5 px-2 py-1 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronRight
          className={cn(
            'h-3 w-3 transition-transform duration-150',
            sb.favoritesExpanded && 'rotate-90'
          )}
        />
        <span className="uppercase tracking-wider">Favorites</span>
      </button>
      {sb.favoritesExpanded && (
        <div className="mt-1 space-y-0.5">
          {sb.isLoadingFavs ? (
            <>
              <div className="h-7 rounded bg-muted/50 animate-pulse mx-1" />
              <div className="h-7 rounded bg-muted/50 animate-pulse mx-1" />
            </>
          ) : (
            sb.favorites.map((favorite) => (
              <FavoriteItem key={favorite.id} favorite={favorite} sb={sb} />
            ))
          )}
        </div>
      )}
    </div>
  )
}

// Favorite Item Component
function FavoriteItem({
  favorite,
  sb,
}: {
  favorite: Favorite
  sb: ReturnType<typeof useSidebar>
}) {
  const doc = favorite.document
  const docIcon = doc?.config?.icon

  return (
    <SidebarItem
      isActive={sb.isFavoriteActive(favorite)}
      onClick={() => sb.handleFavoriteClick(favorite)}
    >
      {docIcon ? (
        <span className="text-base shrink-0">{docIcon}</span>
      ) : (
        <FileText className="h-4 w-4 shrink-0 opacity-60" />
      )}
      <span className="truncate">{doc?.name || 'Untitled'}</span>
    </SidebarItem>
  )
}

// Private Section Component
function PrivateSection({ sb }: { sb: ReturnType<typeof useSidebar> }) {
  if (!sb.currentSpace) return null

  return (
    <div>
      <div className="flex items-center justify-between px-2 py-1 group">
        <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
          Private
        </span>
        {sb.canEdit && (
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
              <DropdownMenuItem onClick={sb.handleCreateDocument}>
                <FileText className="h-4 w-4 mr-2" />
                New document
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => sb.handleCreateDatabaseOrSpreadsheet('document')}>
                <Database className="h-4 w-4 mr-2" />
                New database
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => sb.handleCreateDatabaseOrSpreadsheet('spreadsheet')}>
                <Table2 className="h-4 w-4 mr-2" />
                New spreadsheet
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => sb.handleCreateDrawing()}>
                <Pencil className="h-4 w-4 mr-2" />
                New drawing
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <div className="mt-1 space-y-0.5">
        {sb.isLoadingDocs ? (
          <>
            <div className="h-7 rounded bg-muted/50 animate-pulse mx-1" />
            <div className="h-7 rounded bg-muted/50 animate-pulse mx-1" />
            <div className="h-7 rounded bg-muted/50 animate-pulse mx-1" />
          </>
        ) : sb.rootDocuments.length === 0 ? (
          <>
            <DatabaseTree spaceId={sb.currentSpace.id!} canEdit={sb.canEdit} />
            <DrawingTree spaceId={sb.currentSpace.id!} canEdit={sb.canEdit} />
            <div className="px-2 py-6 text-xs text-muted-foreground text-center">
              <p>No pages yet</p>
              {sb.canEdit && (
                <button
                  onClick={sb.handleCreateDocument}
                  className="mt-2 text-primary hover:underline"
                >
                  Create your first page
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            <DocumentTree spaceId={sb.currentSpace.id!} canEdit={sb.canEdit} />
            <DatabaseTree spaceId={sb.currentSpace.id!} canEdit={sb.canEdit} />
            <DrawingTree spaceId={sb.currentSpace.id!} canEdit={sb.canEdit} />
          </>
        )}
      </div>
    </div>
  )
}

// Desktop User Menu Component
function DesktopUserMenu({ sb }: { sb: ReturnType<typeof useSidebar> }) {
  return (
    <div className="p-2 border-t">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-full justify-start">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                {sb.user?.username?.[0]?.toUpperCase()}
              </div>
              <span className="text-sm truncate">{sb.user?.username}</span>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={sb.toggleTheme}>
            {sb.isDarkMode ? (
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
          <DropdownMenuItem onClick={sb.navigateToSettings}>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </DropdownMenuItem>
          {sb.isAdmin && (
            <DropdownMenuItem onClick={sb.navigateToAdmin}>
              <ShieldCheck className="h-4 w-4 mr-2" />
              Administration
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={sb.logout}>
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

// Mobile User Menu Component
function MobileUserMenu({ sb }: { sb: ReturnType<typeof useSidebar> }) {
  return (
    <div className="p-2 border-t space-y-1">
      <Button variant="ghost" className="w-full justify-start" onClick={sb.toggleTheme}>
        {sb.isDarkMode ? (
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
      <Button variant="ghost" className="w-full justify-start" onClick={sb.navigateToSettings}>
        <Settings className="h-4 w-4 mr-2" />
        Settings
      </Button>
      {sb.isAdmin && (
        <Button variant="ghost" className="w-full justify-start" onClick={sb.navigateToAdmin}>
          <ShieldCheck className="h-4 w-4 mr-2" />
          Administration
        </Button>
      )}
      <Button variant="ghost" className="w-full justify-start text-destructive" onClick={sb.logout}>
        Log out
      </Button>
    </div>
  )
}
