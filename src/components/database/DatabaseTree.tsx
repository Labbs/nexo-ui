import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Database } from 'lucide-react'
import { cn, parseStoredIcon } from '@/lib/utils'
import { DocumentIcon } from '@/components/ui/icon-picker'
import { useDatabases } from '@/hooks/use-database'

export interface DatabaseTreeProps {
  spaceId: string
  canEdit?: boolean
}

export function DatabaseTree({ spaceId }: DatabaseTreeProps) {
  const { t } = useTranslation('database')
  const { data: databases = [], isLoading } = useDatabases(spaceId)
  const location = useLocation()

  // Only show databases that are NOT attached to a document (root level databases)
  const rootDatabases = databases.filter((db) => !db.document_id)

  if (isLoading) {
    return (
      <div className="space-y-0.5">
        <div className="h-6 rounded bg-muted animate-pulse" />
        <div className="h-6 rounded bg-muted animate-pulse" />
      </div>
    )
  }

  if (!rootDatabases || rootDatabases.length === 0) return null

  return (
    <div className="space-y-0.5">
      {rootDatabases.map((db) => {
        const isActive = location.pathname === `/space/${spaceId}/database/${db.id}`
        return (
          <div
            key={db.id}
            className={cn(
              'flex items-center gap-1 py-1 rounded text-[14px] transition-colors duration-100',
              'hover:bg-accent',
              isActive && 'bg-accent font-medium',
              !isActive && 'text-foreground/80'
            )}
            style={{ paddingLeft: 8, paddingRight: 8 }}
          >
            {db.icon ? (
              <DocumentIcon value={parseStoredIcon(db.icon)} size="sm" />
            ) : (
              <Database className="h-[18px] w-[18px] shrink-0 text-muted-foreground" />
            )}
            <Link to={`/space/${spaceId}/database/${db.id}`} className="flex-1 truncate pl-1">
              {db.name || t('untitledDatabase')}
            </Link>
          </div>
        )
      })}
    </div>
  )
}
