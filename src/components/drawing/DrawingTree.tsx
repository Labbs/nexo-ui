<<<<<<< HEAD
import { type CSSProperties } from 'react'
=======
import { type CSSProperties, memo } from 'react'
>>>>>>> d4609d4 (feat: add hooks for managing spaces, users, versions, and webhooks)
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Pencil } from 'lucide-react'
import { useDraggable } from '@dnd-kit/core'
import { cn, parseStoredIcon } from '@/lib/utils'
import { DocumentIcon } from '@/components/ui/icon-picker'
import { useDrawings } from '@/hooks/use-drawings'

export interface DrawingTreeProps {
  spaceId: string
  canEdit?: boolean
}

export function DrawingTree({ spaceId, canEdit }: DrawingTreeProps) {
  const { t } = useTranslation('drawing')
  const { data: drawings = [], isLoading } = useDrawings(spaceId)
  const location = useLocation()

  // Only show drawings that are NOT attached to a document (root level drawings)
  const rootDrawings = drawings.filter((d) => !d.document_id)

  if (isLoading) {
    return (
      <div className="space-y-0.5">
        <div className="h-6 rounded bg-muted animate-pulse" />
        <div className="h-6 rounded bg-muted animate-pulse" />
      </div>
    )
  }

  if (!rootDrawings || rootDrawings.length === 0) return null

  return (
    <div className="space-y-0.5">
      {rootDrawings.map((drawing) => {
        const isActive = location.pathname === `/space/${spaceId}/drawing/${drawing.id}`
        return (
          <DraggableDrawingItem
            key={drawing.id}
            id={drawing.id}
            name={drawing.name || t('untitledDrawing')}
            icon={drawing.icon}
            isActive={isActive}
            spaceId={spaceId}
            canEdit={canEdit}
          />
        )
      })}
    </div>
  )
}

interface DraggableDrawingItemProps {
  id: string
  name: string
  icon?: string
  isActive: boolean
  spaceId: string
  canEdit?: boolean
}

<<<<<<< HEAD
function DraggableDrawingItem({ id, name, icon, isActive, spaceId, canEdit }: DraggableDrawingItemProps) {
=======
const ROOT_PADDING: CSSProperties = { paddingLeft: 8, paddingRight: 8 }

const DraggableDrawingItem = memo(function DraggableDrawingItem({ id, name, icon, isActive, spaceId, canEdit }: DraggableDrawingItemProps) {
>>>>>>> d4609d4 (feat: add hooks for managing spaces, users, versions, and webhooks)
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `drawing-${id}`,
    data: { type: 'drawing', drawingId: id, name },
    disabled: !canEdit,
  })

  const style: CSSProperties = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.5 : undefined,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        'flex items-center gap-1 py-1 rounded text-[14px] transition-colors duration-100',
        'hover:bg-accent',
        isActive && 'bg-accent font-medium',
        !isActive && 'text-foreground/80'
      )}
    >
<<<<<<< HEAD
      <div style={{ paddingLeft: 8, paddingRight: 8 }} className="flex items-center gap-1 w-full">
=======
      <div style={ROOT_PADDING} className="flex items-center gap-1 w-full">
>>>>>>> d4609d4 (feat: add hooks for managing spaces, users, versions, and webhooks)
        {icon ? (
          <DocumentIcon value={parseStoredIcon(icon)} size="sm" />
        ) : (
          <Pencil className="h-[18px] w-[18px] shrink-0 text-muted-foreground" />
        )}
        <Link to={`/space/${spaceId}/drawing/${id}`} className="flex-1 truncate pl-1">
          {name}
        </Link>
      </div>
    </div>
  )
<<<<<<< HEAD
}
=======
})
>>>>>>> d4609d4 (feat: add hooks for managing spaces, users, versions, and webhooks)
