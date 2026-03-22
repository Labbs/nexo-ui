/**
 * Database Block for OpenBlock Editor
 *
 * Custom block that renders an inline database view reusing the same
 * components as the full database page (ViewTabs, DocumentTableView, hooks).
 *
 * OpenBlock renders custom blocks in an isolated React root (createRoot)
 * without access to the app's context providers. We work around this by:
 * - Wrapping with QueryClientProvider (shared queryClient instance)
 * - useTranslation works without provider thanks to initReactI18next
 */

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import i18n from 'i18next'
import { useTranslation } from 'react-i18next'
import { QueryClientProvider } from '@tanstack/react-query'
import { createReactBlockSpec, useUpdateBlock } from '@labbs/openblock-react'
import {
  Plus,
  Database,
  Search,
  FileSpreadsheet,
  ExternalLink,
  Eye,
  EyeOff,
  Check,
} from 'lucide-react'
import { databaseList } from '@/api/generated/databases/databases'
import {
  useDatabase,
  useDatabaseRowsWithView,
  useUpdateDatabase,
  useCreateRow,
  useUpdateRow,
  useDeleteRow,
  useCreateView,
  useUpdateView,
  useDeleteView,
  type PropertySchema,
  type ViewConfig,
  type RowItem,
} from '@/hooks/use-database'
import type { ColumnOptions } from '@/lib/database'
import type { IconValue } from '@/components/ui/icon-picker'
import type { OpenBlockEditor } from '@labbs/openblock-core'
import { DocumentIcon } from '@/components/ui/icon-picker'
import { parseStoredIcon } from '@/lib/utils'
import { queryClient } from '@/lib/query-client'
import { DocumentTableView } from '@/components/database/document/document-table-view'
import { DocumentBoardView } from '@/components/database/document/document-board-view'
import { DocumentGalleryView } from '@/components/database/document/document-gallery-view'
import { DocumentListView } from '@/components/database/document/document-list-view'
import { ViewTabs } from '@/components/database/common/view-tabs'

const t = (key: string, options?: Record<string, unknown>) => i18n.t(key, { ns: 'database', ...options })

type TableSize = 'default' | 'wide' | 'full'

const tableSizeStyles: Record<TableSize, React.CSSProperties> = {
  default: { marginLeft: -125, marginRight: -125, width: 'calc(100% + 250px)' },
  wide: { marginLeft: -250, marginRight: -250, width: 'calc(100% + 500px)' },
  full: { marginLeft: -300, marginRight: -300, width: 'calc(100% + 600px)' },
}

// Extract spaceId from the current URL (e.g. /space/:spaceId/...)
function getSpaceIdFromUrl(): string | null {
  const match = window.location.pathname.match(/\/space\/([^/]+)/)
  return match ? match[1] : null
}


// ============================================================
// InlineDatabaseView — reuses the same hooks and components
// as the full database page (ViewTabs, DocumentTableView)
// ============================================================

export function InlineDatabaseView({
  databaseId,
  tableSize = 'default',
  showTitle = true,
  onTableSizeChange,
  onShowTitleChange,
}: {
  databaseId: string
  tableSize?: TableSize
  showTitle?: boolean
  onTableSizeChange?: (size: TableSize) => void
  onShowTitleChange?: (show: boolean) => void
}) {
  const { t: tr } = useTranslation('database')
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDocFullWidth, setIsDocFullWidth] = useState(false)

  // Detect if the document is in full-width mode
  useEffect(() => {
    if (!containerRef.current) return
    const wrapper = containerRef.current.closest('.openblock-editor-wrapper')
    setIsDocFullWidth(wrapper?.classList.contains('full-width') ?? false)

    // Observe class changes on the wrapper
    if (!wrapper) return
    const observer = new MutationObserver(() => {
      setIsDocFullWidth(wrapper.classList.contains('full-width'))
    })
    observer.observe(wrapper, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  // Use the same React Query hooks as the full database page
  const { data: database, isLoading: isLoadingDatabase } = useDatabase(databaseId)
  const updateDatabase = useUpdateDatabase()
  const createRow = useCreateRow()
  const updateRow = useUpdateRow()
  const deleteRow = useDeleteRow()
  const createView = useCreateView()
  const updateView = useUpdateView()
  const deleteViewMutation = useDeleteView()

  // View state
  const [activeViewId, setActiveViewId] = useState<string>(() => {
    return localStorage.getItem(`nexo-active-view-${databaseId}`) || ''
  })
  const [filterPanelOpen, setFilterPanelOpen] = useState(false)
  const [insertColumnPosition, setInsertColumnPosition] = useState<{ columnId: string; position: 'left' | 'right' } | null>(null)

  // Get views from database
  const views: ViewConfig[] = useMemo(() => {
    if (!database?.views) return []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (database.views as any[]).map(view => ({
      id: view.id as string,
      name: view.name as string,
      type: view.type as string,
      filter: view.filter as Record<string, unknown> | undefined,
      sort: view.sort as ViewConfig['sort'],
      columns: view.columns as string[] | undefined,
      hiddenColumns: (view.hidden_columns ?? view.hiddenColumns) as string[] | undefined,
      groupBy: (view.group_by ?? view.groupBy) as string | undefined,
    }))
  }, [database?.views])

  const activeView = useMemo(() => {
    return views.find(v => v.id === activeViewId) || views[0]
  }, [views, activeViewId])

  // Fetch rows with view
  const { data: rowsData, isLoading: isLoadingRows } = useDatabaseRowsWithView(databaseId, activeViewId || undefined)

  // Set initial active view
  useEffect(() => {
    if (views.length > 0) {
      const isCurrentViewValid = activeViewId && views.some(v => v.id === activeViewId)
      if (!isCurrentViewValid) {
        const defaultViewId = database?.default_view
        const isValidViewId = defaultViewId && views.some(v => v.id === defaultViewId)
        const viewIdToUse = isValidViewId ? defaultViewId : views[0]?.id
        if (viewIdToUse) setActiveViewId(viewIdToUse)
      }
    }
  }, [views, activeViewId, database?.default_view])

  // Save active view to localStorage
  useEffect(() => {
    if (databaseId && activeViewId) {
      localStorage.setItem(`nexo-active-view-${databaseId}`, activeViewId)
    }
  }, [databaseId, activeViewId])

  // Hidden columns from active view
  const hiddenColumnIds = useMemo(() => {
    return new Set(activeView?.hiddenColumns || [])
  }, [activeView?.hiddenColumns])

  const visibleSchema: PropertySchema[] = useMemo(() => {
    if (!database?.schema) return []
    return database.schema.filter((col: PropertySchema) => col.id && !hiddenColumnIds.has(col.id))
  }, [database?.schema, hiddenColumnIds])

  // Convert rows (same logic as full database page)
  const rows = useMemo(() => {
    if (!rowsData?.rows) return []
    const systemDateColumns = (database?.schema || []).filter((col: PropertySchema) =>
      ['created_time', 'updated_time', 'created_at', 'updated_at', 'last_edited_time'].includes(col.type || '')
    )
    const systemUserColumns = (database?.schema || []).filter((col: PropertySchema) =>
      ['created_by', 'last_edited_by'].includes(col.type || '')
    )
    return rowsData.rows.map((row: RowItem) => {
      const rowWithMeta = row as {
        id?: string
        properties?: Record<string, unknown>
        content?: { icon?: IconValue; blocks?: unknown }
        show_in_sidebar?: boolean
        created_at?: string
        updated_at?: string
        created_by?: string
        created_by_user?: { id?: string; username?: string; avatar_url?: string }
        updated_by_user?: { id?: string; username?: string; avatar_url?: string }
      }
      const properties: Record<string, unknown> = { ...rowWithMeta.properties }
      systemDateColumns.forEach((col: PropertySchema) => {
        if (!col.id) return
        const colType = col.type || ''
        if (colType === 'created_time' || colType === 'created_at') properties[col.id] = rowWithMeta.created_at
        else if (colType === 'updated_time' || colType === 'updated_at' || colType === 'last_edited_time') properties[col.id] = rowWithMeta.updated_at
      })
      systemUserColumns.forEach((col: PropertySchema) => {
        if (!col.id) return
        const colType = col.type || ''
        if (colType === 'created_by') properties[col.id] = rowWithMeta.created_by_user
        else if (colType === 'last_edited_by') properties[col.id] = rowWithMeta.updated_by_user || rowWithMeta.created_by_user
      })
      return { id: row.id || '', properties, content: rowWithMeta.content, showInSidebar: rowWithMeta.show_in_sidebar }
    })
  }, [rowsData?.rows, database?.schema])

  // Callbacks (same as full database page)
  const handleAddRow = useCallback(() => {
    if (!databaseId) return
    const newProperties: Record<string, unknown> = {}
    visibleSchema.forEach(col => {
      const colId = col.id || ''
      const colType = col.type || 'text'
      switch (colType) {
        case 'checkbox': newProperties[colId] = false; break
        case 'number': case 'currency': newProperties[colId] = null; break
        default: newProperties[colId] = ''
      }
    })
    createRow.mutate({ databaseId, properties: newProperties })
  }, [visibleSchema, databaseId, createRow])

  const handleUpdateRow = useCallback((rowId: string, properties: Record<string, unknown>) => {
    if (!databaseId) return
    updateRow.mutate({ databaseId, rowId, properties })
  }, [databaseId, updateRow])

  const handleDeleteRow = useCallback((rowId: string) => {
    if (!databaseId) return
    deleteRow.mutate({ databaseId, rowId })
  }, [databaseId, deleteRow])

  const handleAddProperty = useCallback(async (property: PropertySchema) => {
    if (!databaseId || !database?.schema) return
    let newSchema: PropertySchema[]
    if (insertColumnPosition) {
      const index = database.schema.findIndex((col: PropertySchema) => col.id === insertColumnPosition.columnId)
      if (index !== -1) {
        const insertIndex = insertColumnPosition.position === 'left' ? index : index + 1
        newSchema = [...database.schema.slice(0, insertIndex), property, ...database.schema.slice(insertIndex)]
      } else {
        newSchema = [...database.schema, property]
      }
      setInsertColumnPosition(null)
    } else {
      newSchema = [...database.schema, property]
    }
    await updateDatabase.mutateAsync({ databaseId, schema: newSchema })
  }, [databaseId, database?.schema, updateDatabase, insertColumnPosition])

  const handleOpenDocument = useCallback((rowId: string) => {
    const spaceId = database?.space_id
    if (spaceId && databaseId) {
      window.location.href = `/space/${spaceId}/database/${databaseId}/doc/${rowId}`
    }
  }, [database?.space_id, databaseId])

  // Column management callbacks
  const handleRenameColumn = useCallback((columnId: string, name: string) => {
    if (!databaseId || !database?.schema) return
    const newSchema = database.schema.map((col: PropertySchema) => col.id === columnId ? { ...col, name } : col)
    updateDatabase.mutate({ databaseId, schema: newSchema })
  }, [databaseId, database?.schema, updateDatabase])

  const handleDeleteColumn = useCallback((columnId: string) => {
    if (!databaseId || !database?.schema) return
    const newSchema = database.schema.filter((col: PropertySchema) => col.id !== columnId)
    updateDatabase.mutate({ databaseId, schema: newSchema })
  }, [databaseId, database?.schema, updateDatabase])

  const handleSortColumn = useCallback((columnId: string, direction: 'asc' | 'desc') => {
    if (!databaseId || !activeViewId) return
    updateView.mutate({ databaseId, viewId: activeViewId, sort: [{ property_id: columnId, direction }] })
  }, [databaseId, activeViewId, updateView])

  const handleUpdateColumnOptions = useCallback((columnId: string, options: { id: string; name: string; color: string }[]) => {
    if (!databaseId || !database?.schema) return
    const newSchema = database.schema.map((col: PropertySchema) =>
      col.id === columnId ? { ...col, options: { ...col.options, options } } : col
    )
    updateDatabase.mutate({ databaseId, schema: newSchema })
  }, [databaseId, database?.schema, updateDatabase])

  const handleToggleWrapText = useCallback((columnId: string, wrapText: boolean) => {
    if (!databaseId || !database?.schema) return
    const newSchema = database.schema.map((col: PropertySchema) =>
      col.id === columnId ? { ...col, options: { ...col.options, wrapText } } : col
    )
    updateDatabase.mutate({ databaseId, schema: newSchema })
  }, [databaseId, database?.schema, updateDatabase])

  const handleUpdateColumnFormat = useCallback((columnId: string, options: Partial<ColumnOptions>) => {
    if (!databaseId || !database?.schema) return
    const newSchema = database.schema.map((col: PropertySchema) =>
      col.id === columnId ? { ...col, options: { ...col.options, ...options } } : col
    )
    updateDatabase.mutate({ databaseId, schema: newSchema })
  }, [databaseId, database?.schema, updateDatabase])

  const handleDuplicateColumn = useCallback((columnId: string) => {
    if (!databaseId || !database?.schema) return
    const columnToDuplicate = database.schema.find((col: PropertySchema) => col.id === columnId)
    if (!columnToDuplicate) return
    const columnIndex = database.schema.findIndex((col: PropertySchema) => col.id === columnId)
    const newColumn: PropertySchema = {
      ...columnToDuplicate,
      id: `col-${Date.now()}`,
      name: tr('common:copyName', { name: columnToDuplicate.name || tr('common:untitled') }),
    }
    const newSchema = [...database.schema.slice(0, columnIndex + 1), newColumn, ...database.schema.slice(columnIndex + 1)]
    updateDatabase.mutate({ databaseId, schema: newSchema })
  }, [databaseId, database?.schema, updateDatabase, tr])

  const handleInsertColumn = useCallback((columnId: string, position: 'left' | 'right') => {
    setInsertColumnPosition({ columnId, position })
  }, [])

  const handleFilterColumn = useCallback(() => {
    setFilterPanelOpen(true)
  }, [])

  const showColumn = useCallback((columnId: string) => {
    if (!databaseId || !activeViewId) return
    const currentHidden = activeView?.hiddenColumns || []
    updateView.mutate({ databaseId, viewId: activeViewId, hiddenColumns: currentHidden.filter(id => id !== columnId) })
  }, [databaseId, activeViewId, activeView?.hiddenColumns, updateView])

  const hideColumn = useCallback((columnId: string) => {
    if (!databaseId || !activeViewId) return
    const currentHidden = activeView?.hiddenColumns || []
    updateView.mutate({ databaseId, viewId: activeViewId, hiddenColumns: [...currentHidden, columnId] })
  }, [databaseId, activeViewId, activeView?.hiddenColumns, updateView])

  const showAllColumns = useCallback(() => {
    if (!databaseId || !activeViewId) return
    updateView.mutate({ databaseId, viewId: activeViewId, hiddenColumns: [] })
  }, [databaseId, activeViewId, updateView])

  // Loading state
  if (isLoadingDatabase) {
    return (
      <div ref={containerRef} className="flex items-center justify-center py-8">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
      </div>
    )
  }

  if (!database) {
    return (
      <div className="py-4 text-destructive">
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4" />
          <span className="text-sm">{t('notFound')}</span>
        </div>
      </div>
    )
  }

  const sizes: { value: TableSize; label: string }[] = [
    { value: 'default', label: tr('block.sizeDefault') },
    { value: 'wide', label: tr('block.sizeWide') },
    { value: 'full', label: tr('block.sizeFull') },
  ]

  return (
    <div ref={containerRef} className="my-1" style={isDocFullWidth ? undefined : tableSizeStyles[tableSize]} tabIndex={-1}>
      {/* ── Database Title ── */}
      {showTitle && (
        <div className="flex items-center gap-2 px-0.5 py-1.5 mb-0.5">
          <DocumentIcon value={parseStoredIcon(database.icon)} size="md" />
          <span className="text-[22px] font-bold flex-1 text-foreground">
            {database.name}
          </span>
        </div>
      )}

      {/* ── View Tabs + Toolbar (same component as full database page) ── */}
      {views.length > 0 && (
        <ViewTabs
          compactMenuExtra={
            <>
              {/* Source info */}
              <div className="px-3 py-2.5 border-b">
                <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">{tr('block.source')}</div>
                <button
                  className="flex items-center gap-2 w-full rounded px-1.5 py-1 hover:bg-muted transition-colors text-left"
                  onClick={() => {
                    const spaceId = database.space_id
                    if (spaceId) window.location.href = `/space/${spaceId}/database/${databaseId}`
                  }}
                >
                  <DocumentIcon value={parseStoredIcon(database.icon)} size="sm" />
                  <span className="text-sm flex-1 truncate">{database.name}</span>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                </button>
              </div>
              {/* Display options */}
              <div className="py-1 border-b">
                <button
                  className="flex items-center gap-2 w-full px-3 py-1.5 hover:bg-muted transition-colors text-left text-sm"
                  onClick={() => onShowTitleChange?.(!showTitle)}
                >
                  {showTitle ? <Eye className="h-4 w-4 text-muted-foreground" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                  <span className="flex-1">{tr('block.showTitle')}</span>
                  {showTitle && <Check className="h-3.5 w-3.5 text-foreground" />}
                </button>
                {/* Size options */}
                {!isDocFullWidth && onTableSizeChange && sizes.map(({ value, label }) => (
                  <button
                    key={value}
                    className="flex items-center gap-2 w-full px-3 py-1.5 hover:bg-muted transition-colors text-left text-sm"
                    onClick={() => onTableSizeChange(value)}
                  >
                    <span className="flex-1">{label}</span>
                    {tableSize === value && <Check className="h-3.5 w-3.5 text-foreground" />}
                  </button>
                ))}
              </div>
            </>
          }
          views={views}
          activeViewId={activeViewId}
          activeView={activeView}
          columns={visibleSchema}
          allColumns={database?.schema || []}
          hiddenColumnIds={hiddenColumnIds}
          onViewChange={setActiveViewId}
          onCreateView={(name, type) => {
            createView.mutate({ databaseId, name, type: type || 'list' }, {
              onSuccess: (newView) => setActiveViewId(newView.id ?? '')
            })
          }}
          onRenameView={(viewId, name) => updateView.mutate({ databaseId, viewId, name })}
          onChangeViewType={(viewId, type) => updateView.mutate({ databaseId, viewId, type })}
          onDuplicateView={(viewId) => {
            const viewToDuplicate = views.find(v => v.id === viewId)
            if (!viewToDuplicate) return
            createView.mutate({
              databaseId, name: tr('common:copyName', { name: viewToDuplicate.name }),
              type: viewToDuplicate.type, filter: viewToDuplicate.filter,
              sort: viewToDuplicate.sort, columns: viewToDuplicate.columns,
            }, { onSuccess: (newView) => setActiveViewId(newView.id ?? '') })
          }}
          onDeleteView={(viewId) => {
            deleteViewMutation.mutate({ databaseId, viewId })
            if (viewId === activeViewId && views.length > 1) {
              const nextView = views.find(v => v.id !== viewId)
              if (nextView) setActiveViewId(nextView.id ?? '')
            }
          }}
          onFilterChange={(filter) => {
            if (!activeViewId) return
            if (filter === undefined) {
              updateView.mutate({ databaseId, viewId: activeViewId, clearFilter: true })
            } else {
              updateView.mutate({ databaseId, viewId: activeViewId, filter: filter as Record<string, unknown> })
            }
          }}
          onSortChange={(sort) => {
            if (!activeViewId) return
            if (sort.length === 0) {
              updateView.mutate({ databaseId, viewId: activeViewId, clearSort: true })
            } else {
              updateView.mutate({ databaseId, viewId: activeViewId, sort })
            }
          }}
          onGroupByChange={(columnId) => {
            if (!activeViewId) return
            updateView.mutate({ databaseId, viewId: activeViewId, groupBy: columnId })
          }}
          onShowColumn={showColumn}
          onHideColumn={hideColumn}
          onShowAllColumns={showAllColumns}
          canDeleteView={views.length > 1}
          externalFilterOpen={filterPanelOpen}
          onExternalFilterOpenChange={setFilterPanelOpen}
          onAddRow={handleAddRow}
          compact
        />
      )}

      {/* ── View content (same switch as full database page) ── */}
      {activeView?.type === 'board' ? (
        <DocumentBoardView
          schema={visibleSchema}
          rows={rows}
          groupByColumnId={activeView?.groupBy}
          onUpdateRow={handleUpdateRow}
          onDeleteRow={handleDeleteRow}
          onAddRow={handleAddRow}
          onOpenDocument={handleOpenDocument}
          isLoading={isLoadingRows}
        />
      ) : activeView?.type === 'gallery' ? (
        <DocumentGalleryView
          schema={visibleSchema}
          rows={rows}
          onUpdateRow={handleUpdateRow}
          onDeleteRow={handleDeleteRow}
          onAddRow={handleAddRow}
          onOpenDocument={handleOpenDocument}
          isLoading={isLoadingRows}
        />
      ) : activeView?.type === 'list' ? (
        <DocumentListView
          schema={visibleSchema}
          rows={rows}
          onUpdateRow={handleUpdateRow}
          onDeleteRow={handleDeleteRow}
          onAddRow={handleAddRow}
          onOpenDocument={handleOpenDocument}
          isLoading={isLoadingRows}
        />
      ) : (
        <DocumentTableView
          schema={visibleSchema}
          rows={rows}
          onUpdateRow={handleUpdateRow}
          onDeleteRow={handleDeleteRow}
          onAddRow={handleAddRow}
          onAddProperty={handleAddProperty}
          onOpenDocument={handleOpenDocument}
          onRenameColumn={handleRenameColumn}
          onDeleteColumn={handleDeleteColumn}
          onHideColumn={hideColumn}
          onSortColumn={handleSortColumn}
          onUpdateColumnOptions={handleUpdateColumnOptions}
          onInsertColumn={handleInsertColumn}
          insertColumnOpen={!!insertColumnPosition}
          onInsertColumnOpenChange={(open) => { if (!open) setInsertColumnPosition(null) }}
          onFilterColumn={handleFilterColumn}
          onToggleWrapText={handleToggleWrapText}
          onUpdateColumnFormat={handleUpdateColumnFormat}
          onDuplicateColumn={handleDuplicateColumn}
          isLoading={isLoadingRows}
          compact
        />
      )}
    </div>
  )
}

// ============================================================
// Database Selector
// ============================================================

function DatabaseSelector({
  onSelect,
  onCreate,
}: {
  onSelect: (databaseId: string) => void
  onCreate: () => void
}) {
  const { t: tr } = useTranslation('database')
  const [databases, setDatabases] = useState<{ id: string; name: string; icon: string | undefined }[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    let cancelled = false
    const spaceId = getSpaceIdFromUrl()
    databaseList(spaceId ? { space_id: spaceId } : undefined).then((data) => {
      if (!cancelled) {
        const dbs = (data.databases || [])
          .filter((db): db is typeof db & { id: string; name: string } => !!db.id && !!db.name)
          .map((db) => ({ id: db.id!, name: db.name!, icon: db.icon }))
        setDatabases(dbs)
      }
    }).catch((err) => {
      console.error('Failed to load databases:', err)
    }).finally(() => {
      if (!cancelled) setIsLoading(false)
    })
    return () => { cancelled = true }
  }, [])

  const filteredDatabases = useMemo(() => {
    if (!searchQuery.trim()) return databases
    const query = searchQuery.toLowerCase()
    return databases.filter((db) => db.name.toLowerCase().includes(query))
  }, [databases, searchQuery])

  const suggestedDatabases = filteredDatabases.slice(0, 3)

  return (
    <div className="border bg-popover shadow-lg" style={{ borderRadius: 8, margin: '8px 0', width: 320 }}>
      <div className="border-b" style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 14, fontWeight: 500 }}>{tr('block.linkDatabase')}</span>
      </div>

      <div style={{ padding: 8 }}>
        <div style={{ position: 'relative' }}>
          <Search className="text-muted-foreground" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16 }} />
          <input
            type="text"
            placeholder={tr('block.searchDatabases')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-muted/50 border focus:ring-1 focus:ring-ring"
            style={{ width: '100%', paddingLeft: 32, height: 36, fontSize: 14, borderRadius: 6, outline: 'none', boxSizing: 'border-box', padding: '0 12px 0 32px' }}
            autoFocus
          />
        </div>
      </div>

      <div style={{ padding: '0 8px 8px' }}>
        <button
          onClick={onCreate}
          className="hover:bg-muted"
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '8px 8px', borderRadius: 6, border: 'none', cursor: 'pointer', background: 'none', textAlign: 'left' }}
        >
          <div className="bg-muted" style={{ width: 24, height: 24, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </div>
          <span style={{ fontSize: 14 }}>{tr('block.newDatabase')}</span>
        </button>
      </div>

      {!isLoading && suggestedDatabases.length > 0 && (
        <div style={{ padding: '0 8px 8px' }}>
          <div className="text-muted-foreground" style={{ padding: '6px 8px', fontSize: 12 }}>{tr('block.databases')}</div>
          {suggestedDatabases.map((db) => (
            <button
              key={db.id}
              onClick={() => onSelect(db.id)}
              className="hover:bg-muted"
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '8px 8px', borderRadius: 6, border: 'none', cursor: 'pointer', background: 'none', textAlign: 'left' }}
            >
              <div className="bg-muted" style={{ width: 24, height: 24, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DocumentIcon value={parseStoredIcon(db.icon)} size="sm" />
              </div>
              <span style={{ fontSize: 14, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{db.name}</span>
            </button>
          ))}
        </div>
      )}

      {isLoading && (
        <div style={{ padding: '0 8px 8px' }}>
          <div className="bg-muted animate-pulse" style={{ height: 40, borderRadius: 6, marginBottom: 4 }} />
          <div className="bg-muted animate-pulse" style={{ height: 40, borderRadius: 6 }} />
        </div>
      )}

      {!isLoading && filteredDatabases.length > 3 && (
        <div className="border-t" style={{ padding: '8px 8px', maxHeight: 192, overflowY: 'auto' }}>
          <div className="text-muted-foreground" style={{ padding: '6px 8px', fontSize: 12 }}>{tr('block.more')}</div>
          {filteredDatabases.slice(3).map((db) => (
            <button
              key={db.id}
              onClick={() => onSelect(db.id)}
              className="hover:bg-muted"
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '8px 8px', borderRadius: 6, border: 'none', cursor: 'pointer', background: 'none', textAlign: 'left' }}
            >
              <div className="bg-muted" style={{ width: 24, height: 24, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DocumentIcon value={parseStoredIcon(db.icon)} size="sm" />
              </div>
              <span style={{ fontSize: 14, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{db.name}</span>
            </button>
          ))}
        </div>
      )}

      {searchQuery && filteredDatabases.length === 0 && !isLoading && (
        <div style={{ padding: '24px 16px', textAlign: 'center' }}>
          <p className="text-muted-foreground" style={{ fontSize: 14 }}>{tr('block.noDatabasesFound')}</p>
          <button
            className="bg-primary text-primary-foreground"
            style={{ marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', fontSize: 14, borderRadius: 6, border: 'none', cursor: 'pointer' }}
            onClick={onCreate}
          >
            <Plus className="h-4 w-4" />
            {tr('block.createWithName', { name: searchQuery })}
          </button>
        </div>
      )}

      {!isLoading && databases.length === 0 && !searchQuery && (
        <div className="border-t" style={{ padding: '16px', textAlign: 'center' }}>
          <FileSpreadsheet className="h-8 w-8 text-muted-foreground" style={{ margin: '0 auto 8px' }} />
          <p className="text-muted-foreground" style={{ fontSize: 14, marginBottom: 8 }}>{tr('block.noDatabasesYet')}</p>
          <p className="text-muted-foreground" style={{ fontSize: 12 }}>{tr('block.createFirstDatabase')}</p>
        </div>
      )}
    </div>
  )
}

// ============================================================
// Block Render Component (wrapped with QueryClientProvider)
// ============================================================

function DatabaseBlockRenderInner({
  block,
  editor,
  isEditable,
}: {
  block: {
    id: string
    type: string
    props: {
      databaseId: string
      tableSize: string
      showTitle: boolean
    }
  }
  editor: OpenBlockEditor
  isEditable: boolean
}) {
  const { databaseId, tableSize, showTitle } = block.props
  const updateBlock = useUpdateBlock(editor, block.id)

  // Listen for database created events
  useEffect(() => {
    const handleDatabaseCreated = (event: CustomEvent<{ blockId: string; databaseId: string }>) => {
      if (event.detail.blockId === block.id) {
        updateBlock({ databaseId: event.detail.databaseId })
      }
    }

    window.addEventListener('openblock:databaseCreated', handleDatabaseCreated as EventListener)
    return () => {
      window.removeEventListener('openblock:databaseCreated', handleDatabaseCreated as EventListener)
    }
  }, [block.id, updateBlock])

  const handleSelectDatabase = (id: string) => {
    updateBlock({ databaseId: id })
  }

  const handleCreateDatabase = () => {
    window.dispatchEvent(
      new CustomEvent('openblock:createDatabase', {
        detail: { blockId: block.id },
      })
    )
  }

  if (!databaseId) {
    if (!isEditable) {
      return (
        <div className="text-muted-foreground py-4">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span className="text-sm">{t('block.notConfigured')}</span>
          </div>
        </div>
      )
    }
    return <DatabaseSelector onSelect={handleSelectDatabase} onCreate={handleCreateDatabase} />
  }

  return (
    <InlineDatabaseView
      databaseId={databaseId}
      tableSize={(tableSize || 'default') as TableSize}
      showTitle={showTitle}
      onTableSizeChange={(size) => updateBlock({ tableSize: size })}
      onShowTitleChange={(show) => updateBlock({ showTitle: show })}
    />
  )
}

// Wrapper that provides QueryClientProvider for the isolated React root
function DatabaseBlockRender(props: {
  block: {
    id: string
    type: string
    props: {
      databaseId: string
      tableSize: string
      showTitle: boolean
    }
  }
  editor: OpenBlockEditor
  isEditable: boolean
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <DatabaseBlockRenderInner {...props} />
    </QueryClientProvider>
  )
}

// Create the database block spec
export const DatabaseBlock = createReactBlockSpec(
  {
    type: 'database',
    propSchema: {
      databaseId: { default: '' as string },
      tableSize: { default: 'default' as string },
      showTitle: { default: true as boolean },
    },
    content: 'none',
  },
  {
    render: DatabaseBlockRender,
    slashMenu: {
      title: 'Database',
      description: 'Insert an inline database view',
      icon: 'database',
      aliases: ['db', 'table', 'spreadsheet', 'data', 'inline'],
      group: 'Embeds',
    },
  }
)
