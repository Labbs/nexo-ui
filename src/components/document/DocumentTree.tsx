import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ChevronRight, ChevronDown, FileText, Plus, Database, Table2, Pencil } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDocuments, useCreateDocument } from '@/hooks/use-documents'
import { useDatabases } from '@/hooks/use-databases'
import { useUIState } from '@/contexts/ui-state-context'
import { useCreateDatabase, type DatabaseType } from '@/hooks/use-database'
import { useDrawings, useCreateDrawing } from '@/hooks/use-drawings'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export interface DocumentTreeProps {
  spaceId: string
  parentId?: string
  level?: number
  canEdit?: boolean
}

export function DocumentTree({ spaceId, parentId, level = 0, canEdit = true }: DocumentTreeProps) {
  const { data: documents = [], isLoading } = useDocuments(spaceId, parentId)
  if (isLoading) {
    return (
      <div className="space-y-0.5">
        <div className="h-6 rounded bg-muted animate-pulse" />
        <div className="h-6 rounded bg-muted animate-pulse" />
        <div className="h-6 rounded bg-muted animate-pulse" />
      </div>
    )
  }
  if (!documents || documents.length === 0) return null
  return (
    <div className="space-y-0.5">
      {documents.map((doc: any) => {
        const id = (doc?.id as string) || (doc?.document as string)
        const slug = (doc?.slug as string) || ''
        const name = (doc?.name as string) || 'Untitled'
        const icon = doc?.config?.icon || null
        return (
          <TreeItem key={id || slug} spaceId={spaceId} docId={id} slug={slug} name={name} icon={icon} level={level} canEdit={canEdit} />
        )
      })}
    </div>
  )
}

function TreeItem({ spaceId, docId, slug, name, icon, level, canEdit = true }: { spaceId: string; docId: string; slug: string; name: string; icon: string | null; level: number; canEdit?: boolean }) {
  const { isDocumentExpanded, toggleDocumentExpanded } = useUIState()
  const expanded = isDocumentExpanded(spaceId, docId)
  const location = useLocation()
  const navigate = useNavigate()
  const isActive = location.pathname === `/space/${spaceId}/${slug}`
  const { mutateAsync: createDocument } = useCreateDocument()
  const { mutateAsync: createDrawing } = useCreateDrawing()
  const { mutateAsync: createDatabase } = useCreateDatabase()

  const handleCreateDatabaseOrSpreadsheet = async (type: DatabaseType) => {
    const isSpreadsheet = type === 'spreadsheet'
    const defaultSchema = isSpreadsheet
      ? [
          { id: 'title', name: 'Name', type: 'title' },
          { id: 'status', name: 'Status', type: 'select', options: { options: [
            { id: 'not_started', name: 'Not started', color: 'gray' },
            { id: 'in_progress', name: 'In progress', color: 'blue' },
            { id: 'done', name: 'Done', color: 'green' },
          ]}},
        ]
      : [{ id: 'title', name: 'Title', type: 'title' }]

    const result = await createDatabase({
      spaceId,
      documentId: docId,
      name: isSpreadsheet ? 'Untitled Spreadsheet' : 'Untitled Database',
      icon: isSpreadsheet ? '📊' : '📚',
      schema: defaultSchema,
      type,
    })
    if (result.id) navigate(`/space/${spaceId}/database/${result.id}`)
  }

  // Ne faire la requête que si docId est valide (UUID) et que l'élément est expandé
  // Vérifier si c'est un UUID valide (format: 8-4-4-4-12 hexadécimal)
  const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(docId)
  const { data: children = [], isLoading } = useDocuments(
    spaceId,
    expanded && isValidUUID && docId ? docId : undefined
  )

  // Fetch databases for this space to filter child databases
  const { data: allDatabases = [] } = useDatabases(spaceId)
  const childDatabases = allDatabases.filter((db) => db.document_id === docId)

  // Fetch drawings for this space to filter child drawings
  const { data: allDrawings = [] } = useDrawings(spaceId)
  const childDrawings = allDrawings.filter((d) => d.document_id === docId)

  return (
    <div className="group/item">
      <div
        className={cn(
          'flex items-center gap-1 py-1 rounded text-[14px] transition-colors duration-100',
          'hover:bg-accent',
          isActive && 'bg-accent font-medium',
          !isActive && 'text-foreground/80'
        )}
        style={{ paddingLeft: 8 + level * 16, paddingRight: 8 }}
      >
        <button
          className="h-5 w-5 flex items-center justify-center shrink-0 text-muted-foreground hover:text-foreground"
          onClick={() => toggleDocumentExpanded(spaceId, docId)}
          title={expanded ? 'Collapse' : 'Expand'}
        >
          {expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        </button>
        {icon ? (
          <span className="text-[16px] shrink-0">{icon}</span>
        ) : (
          <FileText className="h-[18px] w-[18px] shrink-0 text-muted-foreground" />
        )}
        <Link to={`/space/${spaceId}/${slug}`} className="flex-1 truncate pl-1">
          {name}
        </Link>
        {canEdit && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="h-5 w-5 flex items-center justify-center rounded opacity-0 group-hover/item:opacity-100 hover:bg-secondary text-muted-foreground hover:text-foreground transition-opacity"
                title="Add new..."
                onClick={(e) => e.stopPropagation()}
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem
                onClick={async (e) => {
                  e.stopPropagation()
                  const doc = await createDocument({ spaceId, parentId: docId })
                  const newSlug = (doc as any)?.slug
                  if (newSlug) navigate(`/space/${spaceId}/${newSlug}`)
                }}
              >
                <FileText className="h-4 w-4 mr-2" />
                New document
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  handleCreateDatabaseOrSpreadsheet('document')
                }}
              >
                <Database className="h-4 w-4 mr-2" />
                New database
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  handleCreateDatabaseOrSpreadsheet('spreadsheet')
                }}
              >
                <Table2 className="h-4 w-4 mr-2" />
                New spreadsheet
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async (e) => {
                  e.stopPropagation()
                  const result = await createDrawing({
                    spaceId,
                    documentId: docId,
                    name: 'Untitled Drawing',
                    elements: [],
                    appState: {},
                    files: {},
                  })
                  if (result.id) navigate(`/space/${spaceId}/drawing/${result.id}`)
                }}
              >
                <Pencil className="h-4 w-4 mr-2" />
                New drawing
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {expanded && (
        <div className="mt-0.5 ml-5 space-y-0.5">
          {!isValidUUID ? (
            <div className="text-xs text-muted-foreground px-2 py-1">Invalid document ID</div>
          ) : isLoading ? (
            <>
              <div className="h-5 rounded bg-muted animate-pulse" />
              <div className="h-5 rounded bg-muted animate-pulse" />
            </>
          ) : (
            (() => {
              const normalized = children.map((child: any) => ({
                id: (child?.id as string) || (child?.document as string) || '',
                slug: (child?.slug as string) || '',
                name: (child?.name as string) || 'Untitled',
                icon: child?.config?.icon || null,
              }))
              const validChildren = normalized.filter((c) => !!c.id && c.id !== docId)
              const hasContent = validChildren.length > 0 || childDatabases.length > 0 || childDrawings.length > 0
              if (!hasContent) {
                return <div className="text-xs text-muted-foreground px-2 py-1">No subpages</div>
              }
              return (
                <>
                  {validChildren.map((c) => (
                    <TreeItem key={c.id} spaceId={spaceId} docId={c.id} slug={c.slug} name={c.name} icon={c.icon} level={level + 1} canEdit={canEdit} />
                  ))}
                  {childDatabases.map((db) => {
                    const isDbActive = location.pathname === `/space/${spaceId}/database/${db.id}`
                    return (
                      <div
                        key={db.id}
                        className={cn(
                          'flex items-center gap-1 py-1 rounded text-[14px] transition-colors duration-100',
                          'hover:bg-accent',
                          isDbActive && 'bg-accent font-medium',
                          !isDbActive && 'text-foreground/80'
                        )}
                        style={{ paddingLeft: 8 + (level + 1) * 16, paddingRight: 8 }}
                      >
                        {db.icon ? (
                          <span className="text-[16px] shrink-0">{db.icon}</span>
                        ) : (
                          <Database className="h-[18px] w-[18px] shrink-0 text-muted-foreground" />
                        )}
                        <Link to={`/space/${spaceId}/database/${db.id}`} className="flex-1 truncate pl-1">
                          {db.name || 'Untitled Database'}
                        </Link>
                      </div>
                    )
                  })}
                  {childDrawings.map((drawing) => {
                    const isDrawingActive = location.pathname === `/space/${spaceId}/drawing/${drawing.id}`
                    return (
                      <div
                        key={drawing.id}
                        className={cn(
                          'flex items-center gap-1 py-1 rounded text-[14px] transition-colors duration-100',
                          'hover:bg-accent',
                          isDrawingActive && 'bg-accent font-medium',
                          !isDrawingActive && 'text-foreground/80'
                        )}
                        style={{ paddingLeft: 8 + (level + 1) * 16, paddingRight: 8 }}
                      >
                        <Pencil className="h-[18px] w-[18px] shrink-0 text-muted-foreground" />
                        <Link to={`/space/${spaceId}/drawing/${drawing.id}`} className="flex-1 truncate pl-1">
                          {drawing.name || 'Untitled Drawing'}
                        </Link>
                      </div>
                    )
                  })}
                </>
              )
            })()
          )}
        </div>
      )}

    </div>
  )
}


