<<<<<<< HEAD
import { useState, type CSSProperties } from 'react'
=======
import { memo, useMemo, useState, type CSSProperties } from 'react'
>>>>>>> d4609d4 (feat: add hooks for managing spaces, users, versions, and webhooks)
import {
  ChevronRight,
  Plus,
  MoreHorizontal,
  FileText,
  Database,
  Pencil,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useCurrentSpace } from '@/contexts/space-context'
import { useActiveApp } from '@/contexts/active-app-context'
<<<<<<< HEAD
import { useUIState } from '@/contexts/ui-state-context'
=======
import { useSidebarUI } from '@/contexts/sidebar-ui-context'
>>>>>>> d4609d4 (feat: add hooks for managing spaces, users, versions, and webhooks)
import { useCreateContent } from '@/hooks/use-create-content'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SpaceContentDocs } from './space-content-docs'
import { SpaceContentProjects } from './space-content-projects'
import { EditSpaceModal } from '@/components/spaces/edit-space-modal'
import { cn, parseStoredIcon } from '@/lib/utils'
import { DocumentIcon, isEmoji } from '@/components/ui/icon-picker'

interface SpaceItemProps {
  space: {
    id?: string
    name?: string
    icon?: string
    icon_color?: string
    my_role?: string
    type?: string
  }
}

// Roles that can create/edit content
const EDIT_ROLES = ['owner', 'admin', 'editor']

<<<<<<< HEAD
export function SortableSpaceItem({ space }: SpaceItemProps) {
=======
export const SortableSpaceItem = memo(function SortableSpaceItem({ space }: SpaceItemProps) {
>>>>>>> d4609d4 (feat: add hooks for managing spaces, users, versions, and webhooks)
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: space.id ?? '' })

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <SpaceItem space={space} />
    </div>
  )
<<<<<<< HEAD
}

export function SpaceItem({ space }: SpaceItemProps) {
=======
})

export const SpaceItem = memo(function SpaceItem({ space }: SpaceItemProps) {
>>>>>>> d4609d4 (feat: add hooks for managing spaces, users, versions, and webhooks)
  const { t } = useTranslation('navigation')
  const navigate = useNavigate()
  const { currentSpace, setCurrentSpace } = useCurrentSpace()
  const { activeApp } = useActiveApp()
<<<<<<< HEAD
  const { isSpaceExpanded, toggleSpaceExpanded } = useUIState()
=======
  const { isSpaceExpanded, toggleSpaceExpanded } = useSidebarUI()
>>>>>>> d4609d4 (feat: add hooks for managing spaces, users, versions, and webhooks)
  const { handleCreateDocument, handleCreateDrawing, handleCreateDatabase } = useCreateContent(space.id)
  const [editModalOpen, setEditModalOpen] = useState(false)

  const spaceId = space.id || ''
  const expanded = isSpaceExpanded(spaceId)
  const isActive = currentSpace?.id === spaceId
  const canEdit = space.my_role ? EDIT_ROLES.includes(space.my_role) : false

  const handleClick = () => {
    setCurrentSpace(space)
    if (!expanded) {
      toggleSpaceExpanded(spaceId)
    }
    navigate(`/space/${spaceId}`)
  }

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleSpaceExpanded(spaceId)
  }

  const iconValue = parseStoredIcon(space.icon)
  const showBackground = isEmoji(iconValue) || !iconValue

<<<<<<< HEAD
=======
  const iconStyle = useMemo<CSSProperties>(() => ({
    backgroundColor: showBackground ? (space.icon_color || '#6366f1') : 'transparent',
    color: showBackground ? 'white' : undefined,
  }), [showBackground, space.icon_color])

>>>>>>> d4609d4 (feat: add hooks for managing spaces, users, versions, and webhooks)
  return (
    <div>
      {/* Space header row */}
      <div
        className={cn(
          'group flex items-center gap-1 px-2 py-1 rounded-md cursor-pointer transition-colors',
          'hover:bg-accent',
          isActive && 'bg-accent/50'
        )}
        onClick={handleClick}
      >
        {/* Chevron */}
        <button
          onClick={handleToggle}
          className="shrink-0 p-0.5 rounded hover:bg-accent"
        >
          <ChevronRight
            className={cn(
              'h-3 w-3 text-muted-foreground transition-transform duration-150',
              expanded && 'rotate-90'
            )}
          />
        </button>

        {/* Space icon */}
        <div
          className="h-5 w-5 rounded flex items-center justify-center text-xs font-medium shrink-0"
<<<<<<< HEAD
          style={{
            backgroundColor: showBackground ? (space.icon_color || '#6366f1') : 'transparent',
            color: showBackground ? 'white' : undefined,
          }}
=======
          style={iconStyle}
>>>>>>> d4609d4 (feat: add hooks for managing spaces, users, versions, and webhooks)
        >
          {iconValue ? (
            <DocumentIcon value={iconValue} size="sm" />
          ) : (
            space.name?.[0]?.toUpperCase()
          )}
        </div>

        {/* Space name */}
        <span className="flex-1 text-sm truncate min-w-0">
          {space.name}
        </span>

        {/* Hover actions */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {canEdit && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5"
                  onClick={(e) => e.stopPropagation()}
                  title={t('sidebar.addNew')}
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem onClick={() => handleCreateDocument()}>
                  <FileText className="h-4 w-4 mr-2" />
                  {t('sidebar.newDocument')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCreateDatabase('document')}>
                  <Database className="h-4 w-4 mr-2" />
                  {t('sidebar.newDatabase')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCreateDrawing()}>
                  <Pencil className="h-4 w-4 mr-2" />
                  {t('sidebar.newDrawing')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5"
            onClick={(e) => {
              e.stopPropagation()
              setEditModalOpen(true)
            }}
            title={t('sidebar.spaceSettings')}
          >
            <MoreHorizontal className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="mt-0.5">
          {activeApp === 'docs' && (
            <SpaceContentDocs spaceId={spaceId} canEdit={canEdit} />
          )}
          {activeApp === 'projects' && (
            <SpaceContentProjects spaceId={spaceId} canEdit={canEdit} />
          )}
        </div>
      )}

      {/* Edit space modal */}
      <EditSpaceModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        space={space}
      />
    </div>
  )
<<<<<<< HEAD
}
=======
})
>>>>>>> d4609d4 (feat: add hooks for managing spaces, users, versions, and webhooks)
