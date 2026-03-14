import { type CSSProperties, createContext, memo, useContext, useMemo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ChevronRight, ChevronDown, FileText, Plus, Database, Pencil, CornerLeftUp } from 'lucide-react'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { useDroppable, useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import type { Document, DatabaseItem, DrawingItem } from '@/api/generated/model'
import { cn, parseStoredIcon } from '@/lib/utils'
import { DocumentIcon } from '@/components/ui/icon-picker'
import { useDocuments, useCreateDocument } from '@/hooks/use-documents'
import { useDatabases } from '@/hooks/use-database'
import { useDocumentExpansion } from '@/contexts/document-expansion-context'
import { useCreateDatabase } from '@/hooks/use-database'
import { useDrawings, useCreateDrawing } from '@/hooks/use-drawings'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Pre-computed lookup maps to avoid N*M filtering in each TreeItem
interface ChildContentMaps {
  databasesByDocId: Map<string, DatabaseItem[]>
  drawingsByDocId: Map<string, DrawingItem[]>
}

const ChildContentContext = createContext<ChildContentMaps>({
  databasesByDocId: new Map(),
  drawingsByDocId: new Map(),
})

export interface DocumentTreeProps {
  spaceId: string
  parentId?: string
  level?: number
  canEdit?: boolean
  dropTarget?: string | null
  activeId?: string
}

// Drop zone for moving documents to root level
export function RootDropZone({ isOver }: { isOver: boolean }) {
  const { t } = useTranslation('document')
  const { setNodeRef } = useDroppable({
    id: 'root-drop-zone',
    data: { isDropZone: true, target: 'root' },
  })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-colors mb-1',
        'border-2 border-dashed',
        isOver
          ? 'border-primary bg-primary/10 text-primary'
          : 'border-muted-foreground/30 text-muted-foreground'
      )}
    >
      <CornerLeftUp className="h-3.5 w-3.5" />
      <span>{t('tree.moveToRoot')}</span>
    </div>
  )
}

export function DocumentTree({ spaceId, parentId, level = 0, canEdit = true, dropTarget, activeId }: DocumentTreeProps) {
  const { t } = useTranslation('document')
  const { data: documents = [], isLoading } = useDocuments(spaceId, parentId)

  // Fetch databases and drawings ONCE at the tree root level, pre-group by document_id
  const { data: allDatabases = [] } = useDatabases(spaceId)
  const { data: allDrawings = [] } = useDrawings(spaceId)

  const childContentMaps = useMemo<ChildContentMaps>(() => {
    const databasesByDocId = new Map<string, DatabaseItem[]>()
    for (const db of allDatabases) {
      if (!db.document_id) continue
      const existing = databasesByDocId.get(db.document_id) || []
      existing.push(db)
      databasesByDocId.set(db.document_id, existing)
    }
    const drawingsByDocId = new Map<string, DrawingItem[]>()
    for (const d of allDrawings) {
      if (!d.document_id) continue
      const existing = drawingsByDocId.get(d.document_id) || []
      existing.push(d)
      drawingsByDocId.set(d.document_id, existing)
    }
    return { databasesByDocId, drawingsByDocId }
  }, [allDatabases, allDrawings])

  const itemIds = useMemo(
    () => documents.map((doc: Document) => doc?.id || '').filter(Boolean),
    [documents]
  )

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
    <ChildContentContext.Provider value={childContentMaps}>
    <SortableContext items={itemIds} strategy={verticalListSortingStrategy} id={parentId || 'root'}>
      <div className="space-y-0.5">
        {documents.map((doc: Document) => {
          const id = doc?.id || ''
          const slug = doc?.slug || ''
          const name = doc?.name || t('common:untitled')
          const icon = doc?.config?.icon || null
          const isDropTarget = dropTarget === id && activeId !== id
          return (
            <MemoSortableTreeItem
              key={id || slug}
              spaceId={spaceId}
              docId={id}
              slug={slug}
              name={name}
              icon={icon}
              level={level}
              canEdit={canEdit}
              parentId={parentId}
              isDropTarget={isDropTarget}
              dropTarget={dropTarget}
              activeId={activeId}
            />
          )
        })}
      </div>
    </SortableContext>
    </ChildContentContext.Provider>
  )
}

interface TreeItemProps {
  spaceId: string
  docId: string
  slug: string
  name: string
  icon: string | null
  level: number
  canEdit?: boolean
  parentId?: string
  isDropTarget?: boolean
  dropTarget?: string | null
  activeId?: string
}

const MemoSortableTreeItem = memo(function SortableTreeItem(props: TreeItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props.docId,
    data: { type: 'document', parentId: props.parentId, name: props.name, icon: props.icon },
  })

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <MemoTreeItem {...props} isDragging={isDragging} />
    </div>
  )
})

const MemoTreeItem = memo(function TreeItem({ spaceId, docId, slug, name, icon, level, canEdit = true, parentId: _parentId, isDropTarget, dropTarget, activeId, isDragging: _isDragging }: TreeItemProps & { isDragging?: boolean }) {
  const { t } = useTranslation('document')
  const { isDocumentExpanded, toggleDocumentExpanded } = useDocumentExpansion()
  const expanded = isDocumentExpanded(spaceId, docId)
  const location = useLocation()
  const navigate = useNavigate()
  const isActive = location.pathname === `/space/${spaceId}/${slug}`
  const { mutateAsync: createDocument } = useCreateDocument()
  const { mutateAsync: createDrawing } = useCreateDrawing()
  const { mutateAsync: createDatabase } = useCreateDatabase()

  const handleCreateDatabase = async () => {
    const result = await createDatabase({
      spaceId,
      documentId: docId,
      name: t('database:untitledDatabase'),
      icon: '📚',
      schema: [{ id: 'title', name: 'Title', type: 'title' }],
      type: 'document',
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

  // Use pre-computed maps from parent instead of fetching+filtering per TreeItem
  const { databasesByDocId, drawingsByDocId } = useContext(ChildContentContext)
  const childDatabases = databasesByDocId.get(docId) || []
  const childDrawings = drawingsByDocId.get(docId) || []

  const paddingStyle = useMemo<CSSProperties>(
    () => ({ paddingLeft: 8 + level * 16, paddingRight: 8 }),
    [level]
  )

  return (
    <div className="group/item">
      <div
        className={cn(
          'flex items-center gap-1 py-1 rounded text-[14px] transition-colors duration-100',
          'hover:bg-accent',
          isActive && 'bg-accent font-medium',
          !isActive && 'text-foreground/80',
          isDropTarget && 'ring-2 ring-primary ring-inset bg-primary/10'
        )}
        style={paddingStyle}
      >
        <button
          className="h-5 w-5 flex items-center justify-center shrink-0 text-muted-foreground hover:text-foreground"
          onClick={() => toggleDocumentExpanded(spaceId, docId)}
          title={expanded ? t('tree.collapse') : t('tree.expand')}
        >
          {expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        </button>
        {icon ? (
          <DocumentIcon value={parseStoredIcon(icon)} size="sm" />
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
                title={t('tree.addNew')}
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
                  const newSlug = doc?.slug
                  if (newSlug) navigate(`/space/${spaceId}/${newSlug}`)
                }}
              >
                <FileText className="h-4 w-4 mr-2" />
                {t('tree.newDocument')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  handleCreateDatabase()
                }}
              >
                <Database className="h-4 w-4 mr-2" />
                {t('tree.newDatabase')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async (e) => {
                  e.stopPropagation()
                  const result = await createDrawing({
                    spaceId,
                    documentId: docId,
                    name: t('drawing:untitledDrawing'),
                    elements: [],
                    appState: {},
                    files: {},
                  })
                  if (result.id) navigate(`/space/${spaceId}/drawing/${result.id}`)
                }}
              >
                <Pencil className="h-4 w-4 mr-2" />
                {t('tree.newDrawing')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {expanded && (
        <div className="mt-0.5 ml-5 space-y-0.5">
          {!isValidUUID ? (
            <div className="text-xs text-muted-foreground px-2 py-1">{t('tree.invalidDocId')}</div>
          ) : isLoading ? (
            <>
              <div className="h-5 rounded bg-muted animate-pulse" />
              <div className="h-5 rounded bg-muted animate-pulse" />
            </>
          ) : (
            (() => {
              const normalized = children.map((child: Document) => ({
                id: child?.id || '',
                slug: child?.slug || '',
                name: child?.name || t('common:untitled'),
                icon: child?.config?.icon || null,
              }))
              const validChildren = normalized.filter((c: { id: string; slug: string; name: string; icon: string | null }) => !!c.id && c.id !== docId)
              const childIds = validChildren.map((c: { id: string; slug: string; name: string; icon: string | null }) => c.id)
              const hasContent = validChildren.length > 0 || childDatabases.length > 0 || childDrawings.length > 0
              if (!hasContent) {
                return <div className="text-xs text-muted-foreground px-2 py-1">{t('tree.noSubpages')}</div>
              }
              return (
                <>
                  <SortableContext items={childIds} strategy={verticalListSortingStrategy} id={docId}>
                    {validChildren.map((c: { id: string; slug: string; name: string; icon: string | null }) => {
                      const isChildDropTarget = dropTarget === c.id && activeId !== c.id
                      return (
                        <MemoSortableTreeItem
                          key={c.id}
                          spaceId={spaceId}
                          docId={c.id}
                          slug={c.slug}
                          name={c.name}
                          icon={c.icon}
                          level={level + 1}
                          canEdit={canEdit}
                          parentId={docId}
                          isDropTarget={isChildDropTarget}
                          dropTarget={dropTarget}
                          activeId={activeId}
                        />
                      )
                    })}
                  </SortableContext>
                  {childDatabases.map((db) => (
                    <MemoDraggableChildDatabase
                      key={db.id}
                      db={db}
                      spaceId={spaceId}
                      level={level}
                      parentDocId={docId}
                      canEdit={canEdit}
                    />
                  ))}
                  {childDrawings.map((drawing) => (
                    <MemoDraggableChildDrawing
                      key={drawing.id}
                      drawing={drawing}
                      spaceId={spaceId}
                      level={level}
                      parentDocId={docId}
                      canEdit={canEdit}
                    />
                  ))}
                </>
              )
            })()
          )}
        </div>
      )}

    </div>
  )
})

const MemoDraggableChildDatabase = memo(function DraggableChildDatabase({ db, spaceId, level, parentDocId, canEdit }: {
  db: DatabaseItem
  spaceId: string
  level: number
  parentDocId: string
  canEdit?: boolean
}) {
  const { t } = useTranslation('database')
  const location = useLocation()
  const isDbActive = location.pathname === `/space/${spaceId}/database/${db.id}`

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `db-${db.id}`,
    data: { type: 'database', databaseId: db.id, name: db.name, icon: db.icon, parentDocId },
    disabled: !canEdit,
  })

  const style: CSSProperties = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.5 : undefined,
  }

  const paddingStyle = useMemo<CSSProperties>(
    () => ({ paddingLeft: 8 + (level + 1) * 16, paddingRight: 8 }),
    [level]
  )

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        'flex items-center gap-1 py-1 rounded text-[14px] transition-colors duration-100',
        'hover:bg-accent',
        isDbActive && 'bg-accent font-medium',
        !isDbActive && 'text-foreground/80'
      )}
    >
      <div style={paddingStyle} className="flex items-center gap-1 w-full">
        {db.icon ? (
          <DocumentIcon value={parseStoredIcon(db.icon)} size="sm" />
        ) : (
          <Database className="h-[18px] w-[18px] shrink-0 text-muted-foreground" />
        )}
        <Link to={`/space/${spaceId}/database/${db.id}`} className="flex-1 truncate pl-1">
          {db.name || t('untitledDatabase')}
        </Link>
      </div>
    </div>
  )
})

const MemoDraggableChildDrawing = memo(function DraggableChildDrawing({ drawing, spaceId, level, parentDocId, canEdit }: {
  drawing: DrawingItem
  spaceId: string
  level: number
  parentDocId: string
  canEdit?: boolean
}) {
  const { t } = useTranslation('drawing')
  const location = useLocation()
  const isDrawingActive = location.pathname === `/space/${spaceId}/drawing/${drawing.id}`

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `drawing-${drawing.id}`,
    data: { type: 'drawing', drawingId: drawing.id, name: drawing.name, parentDocId },
    disabled: !canEdit,
  })

  const style: CSSProperties = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.5 : undefined,
  }

  const paddingStyle = useMemo<CSSProperties>(
    () => ({ paddingLeft: 8 + (level + 1) * 16, paddingRight: 8 }),
    [level]
  )

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        'flex items-center gap-1 py-1 rounded text-[14px] transition-colors duration-100',
        'hover:bg-accent',
        isDrawingActive && 'bg-accent font-medium',
        !isDrawingActive && 'text-foreground/80'
      )}
    >
      <div style={paddingStyle} className="flex items-center gap-1 w-full">
        {drawing.icon ? (
          <DocumentIcon value={parseStoredIcon(drawing.icon)} size="sm" />
        ) : (
          <Pencil className="h-[18px] w-[18px] shrink-0 text-muted-foreground" />
        )}
        <Link to={`/space/${spaceId}/drawing/${drawing.id}`} className="flex-1 truncate pl-1">
          {drawing.name || t('untitledDrawing')}
        </Link>
      </div>
    </div>
  )
})
