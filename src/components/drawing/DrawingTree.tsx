import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Pencil } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDrawings } from '@/hooks/use-drawings'

export interface DrawingTreeProps {
  spaceId: string
  canEdit?: boolean
}

export function DrawingTree({ spaceId }: DrawingTreeProps) {
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
          <div
            key={drawing.id}
            className={cn(
              'flex items-center gap-1 py-1 rounded text-[14px] transition-colors duration-100',
              'hover:bg-accent',
              isActive && 'bg-accent font-medium',
              !isActive && 'text-foreground/80'
            )}
            style={{ paddingLeft: 8, paddingRight: 8 }}
          >
            <Pencil className="h-[18px] w-[18px] shrink-0 text-muted-foreground" />
            <Link to={`/space/${spaceId}/drawing/${drawing.id}`} className="flex-1 truncate pl-1">
              {drawing.name || t('untitledDrawing')}
            </Link>
          </div>
        )
      })}
    </div>
  )
}
