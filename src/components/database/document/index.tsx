import { useCallback, useState, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { Loader2, Database } from 'lucide-react'
import { ContentHeader } from '@/components/shared/content-header'
import { MainLayout } from '@/components/layout/main-layout'
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
import { parseStoredIcon, serializeIcon } from '@/lib/utils'
import { DatabaseSettingsSidebar } from '../common/database-settings-sidebar'
import { ViewTabs } from '../common/view-tabs'
import { DocumentTableView } from './document-table-view'
import { DocumentBoardView } from './document-board-view'
import { DocumentGalleryView } from './document-gallery-view'
import { DocumentListView } from './document-list-view'
import { DocumentEditSidebar } from './document-edit-sidebar'

export function DocumentDatabaseView() {
  const { t } = useTranslation('database')
  const { spaceId, databaseId } = useParams<{ spaceId: string; databaseId: string }>()

  // View state - initialize from localStorage if available
  const [activeViewId, setActiveViewId] = useState<string>(() => {
    if (databaseId) {
      return localStorage.getItem(`nexo-active-view-${databaseId}`) || ''
    }
    return ''
  })

  // Document edit sidebar state
  const [editingRowId, setEditingRowId] = useState<string | null>(null)

  // Insert column state
  const [insertColumnPosition, setInsertColumnPosition] = useState<{ columnId: string; position: 'left' | 'right' } | null>(null)

  // Filter panel state (for opening from column menu)
  const [filterPanelOpen, setFilterPanelOpen] = useState(false)

  // API hooks
  const { data: database, isLoading: isLoadingDatabase } = useDatabase(databaseId)
  const { data: rowsData, isLoading: isLoadingRows } = useDatabaseRowsWithView(databaseId, activeViewId || undefined)
  const updateDatabase = useUpdateDatabase()
  const createRow = useCreateRow()
  const updateRow = useUpdateRow()
  const deleteRow = useDeleteRow()
  const createView = useCreateView()
  const updateView = useUpdateView()
  const deleteViewMutation = useDeleteView()

  // Get views from database (map snake_case to camelCase)
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

  // Get active view
  const activeView = useMemo(() => {
    return views.find(v => v.id === activeViewId) || views[0]
  }, [views, activeViewId])

  // Set initial active view when database loads
  useEffect(() => {
    if (views.length > 0) {
      const isCurrentViewValid = activeViewId && views.some(v => v.id === activeViewId)

      if (!isCurrentViewValid) {
        const defaultViewId = database?.default_view
        const isValidViewId = defaultViewId && views.some(v => v.id === defaultViewId)
        const viewIdToUse = isValidViewId ? defaultViewId : views[0]?.id
        if (viewIdToUse) {
          setActiveViewId(viewIdToUse)
        }
      }
    }
  }, [views, activeViewId, database?.default_view])

  // Save active view to localStorage when it changes
  useEffect(() => {
    if (databaseId && activeViewId) {
      localStorage.setItem(`nexo-active-view-${databaseId}`, activeViewId)
    }
  }, [databaseId, activeViewId])

  // Local state
  const [isSettingsSidebarOpen, setIsSettingsSidebarOpen] = useState(false)

  // Get hidden columns from active view
  const hiddenColumnIds = useMemo(() => {
    return new Set(activeView?.hiddenColumns || [])
  }, [activeView?.hiddenColumns])

  // Filter visible columns based on view's hidden columns
  const visibleSchema: PropertySchema[] = useMemo(() => {
    if (!database?.schema) return []
    return database.schema.filter((col: PropertySchema) => col.id && !hiddenColumnIds.has(col.id))
  }, [database?.schema, hiddenColumnIds])

  // Convert rows from API format
  const rows = useMemo(() => {
    if (!rowsData?.rows) return []

    // Find system date columns in schema to inject values by column ID
    const systemDateColumns = (database?.schema || []).filter((col: PropertySchema) =>
      ['created_time', 'updated_time', 'created_at', 'updated_at', 'last_edited_time'].includes(col.type || '')
    )

    // Find system user columns (created_by, last_edited_by)
    const systemUserColumns = (database?.schema || []).filter((col: PropertySchema) =>
      ['created_by', 'last_edited_by'].includes(col.type || '')
    )

    return rowsData.rows.map((row: RowItem) => {
      // Get row-level fields that might be used as column values
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

      // Start with existing properties
      const properties: Record<string, unknown> = {
        ...rowWithMeta.properties,
      }

      // Inject values for system date columns using their actual column IDs
      systemDateColumns.forEach((col: PropertySchema) => {
        if (!col.id) return
        const colType = col.type || ''

        if (colType === 'created_time' || colType === 'created_at') {
          properties[col.id] = rowWithMeta.created_at
        } else if (colType === 'updated_time' || colType === 'updated_at' || colType === 'last_edited_time') {
          properties[col.id] = rowWithMeta.updated_at
        }
      })

      // Inject values for system user columns using their actual column IDs
      systemUserColumns.forEach((col: PropertySchema) => {
        if (!col.id) return
        const colType = col.type || ''

        if (colType === 'created_by') {
          properties[col.id] = rowWithMeta.created_by_user
        } else if (colType === 'last_edited_by') {
          // Fallback to created_by_user if updated_by_user is not set
          properties[col.id] = rowWithMeta.updated_by_user || rowWithMeta.created_by_user
        }
      })

      return {
        id: row.id || '',
        properties,
        content: rowWithMeta.content,
        showInSidebar: rowWithMeta.show_in_sidebar,
      }
    })
  }, [rowsData?.rows, database?.schema])

  // Handle adding a new row
  const handleAddRow = useCallback(() => {
    if (!databaseId) return

    const newProperties: Record<string, unknown> = {}
    visibleSchema.forEach(col => {
      const colId = col.id || ''
      const colType = col.type || 'text'
      switch (colType) {
        case 'checkbox':
          newProperties[colId] = false
          break
        case 'number':
        case 'currency':
          newProperties[colId] = null
          break
        default:
          newProperties[colId] = ''
      }
    })

    createRow.mutate({
      databaseId,
      properties: newProperties,
    })
  }, [visibleSchema, databaseId, createRow])

  // Handle update row
  const handleUpdateRow = useCallback((rowId: string, properties: Record<string, unknown>) => {
    if (!databaseId) return
    updateRow.mutate({
      databaseId,
      rowId,
      properties,
    })
  }, [databaseId, updateRow])

  // Handle delete row
  const handleDeleteRow = useCallback((rowId: string) => {
    if (!databaseId) return
    deleteRow.mutate({ databaseId, rowId })
  }, [databaseId, deleteRow])

  // Handle add property
  const handleAddProperty = useCallback(async (property: PropertySchema) => {
    if (!databaseId || !database?.schema) return

    let newSchema: PropertySchema[]

    if (insertColumnPosition) {
      // Insert at specific position
      const index = database.schema.findIndex((col: PropertySchema) => col.id === insertColumnPosition.columnId)
      if (index !== -1) {
        const insertIndex = insertColumnPosition.position === 'left' ? index : index + 1
        newSchema = [
          ...database.schema.slice(0, insertIndex),
          property,
          ...database.schema.slice(insertIndex),
        ]
      } else {
        newSchema = [...database.schema, property]
      }
      setInsertColumnPosition(null)
    } else {
      // Add to end
      newSchema = [...database.schema, property]
    }

    await updateDatabase.mutateAsync({
      databaseId,
      schema: newSchema,
    })
  }, [databaseId, database?.schema, updateDatabase, insertColumnPosition])

  // Handle insert column (opens add property popover at position)
  const handleInsertColumn = useCallback((columnId: string, position: 'left' | 'right') => {
    setInsertColumnPosition({ columnId, position })
  }, [])

  // Handle filter column (opens filter panel)
  const handleFilterColumn = useCallback(() => {
    setFilterPanelOpen(true)
  }, [])

  // Show/hide column
  const showColumn = useCallback((columnId: string) => {
    if (!databaseId || !activeViewId) return

    const currentHidden = activeView?.hiddenColumns || []
    const newHiddenColumns = currentHidden.filter(id => id !== columnId)

    updateView.mutate({
      databaseId,
      viewId: activeViewId,
      hiddenColumns: newHiddenColumns,
    })
  }, [databaseId, activeViewId, activeView?.hiddenColumns, updateView])

  const hideColumn = useCallback((columnId: string) => {
    if (!databaseId || !activeViewId) return

    const currentHidden = activeView?.hiddenColumns || []
    const newHiddenColumns = [...currentHidden, columnId]

    updateView.mutate({
      databaseId,
      viewId: activeViewId,
      hiddenColumns: newHiddenColumns,
    })
  }, [databaseId, activeViewId, activeView?.hiddenColumns, updateView])

  const showAllColumns = useCallback(() => {
    if (!databaseId || !activeViewId) return

    updateView.mutate({
      databaseId,
      viewId: activeViewId,
      hiddenColumns: [],
    })
  }, [databaseId, activeViewId, updateView])

  // Rename column
  const handleRenameColumn = useCallback((columnId: string, name: string) => {
    if (!databaseId || !database?.schema) return

    const newSchema = database.schema.map((col: PropertySchema) =>
      col.id === columnId ? { ...col, name } : col
    )
    updateDatabase.mutate({
      databaseId,
      schema: newSchema,
    })
  }, [databaseId, database?.schema, updateDatabase])

  // Delete column
  const handleDeleteColumn = useCallback((columnId: string) => {
    if (!databaseId || !database?.schema) return

    const newSchema = database.schema.filter((col: PropertySchema) => col.id !== columnId)
    updateDatabase.mutate({
      databaseId,
      schema: newSchema,
    })
  }, [databaseId, database?.schema, updateDatabase])

  // Sort column
  const handleSortColumn = useCallback((columnId: string, direction: 'asc' | 'desc') => {
    if (!databaseId || !activeViewId) return

    updateView.mutate({
      databaseId,
      viewId: activeViewId,
      sort: [{ property_id: columnId, direction }],
    })
  }, [databaseId, activeViewId, updateView])

  // Update column options (for select/multi_select)
  const handleUpdateColumnOptions = useCallback((columnId: string, options: { id: string; name: string; color: string }[]) => {
    if (!databaseId || !database?.schema) return

    const newSchema = database.schema.map((col: PropertySchema) =>
      col.id === columnId
        ? { ...col, options: { ...col.options, options } }
        : col
    )
    updateDatabase.mutate({
      databaseId,
      schema: newSchema,
    })
  }, [databaseId, database?.schema, updateDatabase])

  // Toggle wrap text for a column
  const handleToggleWrapText = useCallback((columnId: string, wrapText: boolean) => {
    if (!databaseId || !database?.schema) return

    const newSchema = database.schema.map((col: PropertySchema) =>
      col.id === columnId
        ? { ...col, options: { ...col.options, wrapText } }
        : col
    )
    updateDatabase.mutate({
      databaseId,
      schema: newSchema,
    })
  }, [databaseId, database?.schema, updateDatabase])

  // Update column format options (number format, date format, conditional rules, custom icon, etc.)
  const handleUpdateColumnFormat = useCallback((columnId: string, options: Partial<ColumnOptions>) => {
    if (!databaseId || !database?.schema) return

    const newSchema = database.schema.map((col: PropertySchema) =>
      col.id === columnId
        ? { ...col, options: { ...col.options, ...options } }
        : col
    )
    updateDatabase.mutate({
      databaseId,
      schema: newSchema,
    })
  }, [databaseId, database?.schema, updateDatabase])

  // Duplicate column
  const handleDuplicateColumn = useCallback((columnId: string) => {
    if (!databaseId || !database?.schema) return

    const columnToDuplicate = database.schema.find((col: PropertySchema) => col.id === columnId)
    if (!columnToDuplicate) return

    const columnIndex = database.schema.findIndex((col: PropertySchema) => col.id === columnId)
    const newColumn: PropertySchema = {
      ...columnToDuplicate,
      id: `col-${Date.now()}`,
      name: t('common:copyName', { name: columnToDuplicate.name || t('common:untitled') }),
    }

    const newSchema = [
      ...database.schema.slice(0, columnIndex + 1),
      newColumn,
      ...database.schema.slice(columnIndex + 1),
    ]

    updateDatabase.mutate({
      databaseId,
      schema: newSchema,
    })
  }, [databaseId, database?.schema, updateDatabase])

  // Loading state
  if (isLoadingDatabase || isLoadingRows) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </MainLayout>
    )
  }

  // Not found state
  if (!database) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">{t('notFound')}</p>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="flex flex-col h-full">
        {/* Header with database name */}
        <ContentHeader
          title={database.name || ''}
          onTitleChange={(name) => {
            if (!databaseId) return
            updateDatabase.mutate({
              databaseId,
              name: name.trim() || t('untitledDatabase'),
            })
          }}
          onSettingsClick={() => setIsSettingsSidebarOpen(true)}
          placeholder={t('untitledDatabase')}
          icon={parseStoredIcon(database.icon)}
          onIconChange={(newIcon: IconValue) => {
            if (!databaseId) return
            const iconString = serializeIcon(newIcon) || undefined
            updateDatabase.mutate({ databaseId, icon: iconString })
          }}
          defaultIcon={<Database className="h-8 w-8 text-muted-foreground" />}
        />

        {/* View tabs with filter/sort */}
        {views.length > 0 && (
          <ViewTabs
            views={views}
            activeViewId={activeViewId}
            activeView={activeView}
            columns={database?.schema || []}
            allColumns={database?.schema || []}
            hiddenColumnIds={hiddenColumnIds}
            onViewChange={setActiveViewId}
            onCreateView={(name, type) => {
              if (!databaseId) return
              createView.mutate({
                databaseId,
                name,
                type: type || 'list',
              }, {
                onSuccess: (newView) => {
                  setActiveViewId(newView.id)
                }
              })
            }}
            onRenameView={(viewId, name) => {
              if (!databaseId) return
              updateView.mutate({ databaseId, viewId, name })
            }}
            onChangeViewType={(viewId, type) => {
              if (!databaseId) return
              updateView.mutate({ databaseId, viewId, type })
            }}
            onDuplicateView={(viewId) => {
              if (!databaseId) return
              const viewToDuplicate = views.find(v => v.id === viewId)
              if (!viewToDuplicate) return
              createView.mutate({
                databaseId,
                name: t('common:copyName', { name: viewToDuplicate.name }),
                type: viewToDuplicate.type,
                filter: viewToDuplicate.filter,
                sort: viewToDuplicate.sort,
                columns: viewToDuplicate.columns,
              }, {
                onSuccess: (newView) => {
                  setActiveViewId(newView.id)
                }
              })
            }}
            onDeleteView={(viewId) => {
              if (!databaseId) return
              deleteViewMutation.mutate({ databaseId, viewId })
              if (viewId === activeViewId && views.length > 1) {
                const nextView = views.find(v => v.id !== viewId)
                if (nextView) setActiveViewId(nextView.id)
              }
            }}
            onFilterChange={(filter) => {
              if (!databaseId || !activeViewId) return
              if (filter === undefined) {
                updateView.mutate({
                  databaseId,
                  viewId: activeViewId,
                  clearFilter: true,
                })
              } else {
                updateView.mutate({
                  databaseId,
                  viewId: activeViewId,
                  filter: filter as Record<string, unknown>,
                })
              }
            }}
            onSortChange={(sort) => {
              if (!databaseId || !activeViewId) return
              if (sort.length === 0) {
                updateView.mutate({
                  databaseId,
                  viewId: activeViewId,
                  clearSort: true,
                })
              } else {
                updateView.mutate({
                  databaseId,
                  viewId: activeViewId,
                  sort,
                })
              }
            }}
            onGroupByChange={(columnId) => {
              if (!databaseId || !activeViewId) return
              updateView.mutate({ databaseId, viewId: activeViewId, groupBy: columnId })
            }}
            onShowColumn={showColumn}
            onHideColumn={hideColumn}
            onShowAllColumns={showAllColumns}
            canDeleteView={views.length > 1}
            externalFilterOpen={filterPanelOpen}
            onExternalFilterOpenChange={setFilterPanelOpen}
          />
        )}

        {/* Document view - render based on active view type */}
        <div className="flex-1 min-h-0 overflow-auto py-4">
          {activeView?.type === 'board' ? (
            <DocumentBoardView
              schema={visibleSchema}
              rows={rows}
              groupByColumnId={activeView?.groupBy}
              onUpdateRow={handleUpdateRow}
              onDeleteRow={handleDeleteRow}
              onAddRow={handleAddRow}
              onOpenDocument={setEditingRowId}
              isLoading={isLoadingRows}
            />
          ) : activeView?.type === 'gallery' ? (
            <DocumentGalleryView
              schema={visibleSchema}
              rows={rows}
              onUpdateRow={handleUpdateRow}
              onDeleteRow={handleDeleteRow}
              onAddRow={handleAddRow}
              onOpenDocument={setEditingRowId}
              isLoading={isLoadingRows}
            />
          ) : activeView?.type === 'list' ? (
            <DocumentListView
              schema={visibleSchema}
              rows={rows}
              onUpdateRow={handleUpdateRow}
              onDeleteRow={handleDeleteRow}
              onAddRow={handleAddRow}
              onOpenDocument={setEditingRowId}
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
              onOpenDocument={setEditingRowId}
              onRenameColumn={handleRenameColumn}
              onDeleteColumn={handleDeleteColumn}
              onHideColumn={hideColumn}
              onSortColumn={handleSortColumn}
              onUpdateColumnOptions={handleUpdateColumnOptions}
              onInsertColumn={handleInsertColumn}
              insertColumnOpen={!!insertColumnPosition}
              onInsertColumnOpenChange={(open) => {
                if (!open) setInsertColumnPosition(null)
              }}
              onFilterColumn={handleFilterColumn}
              onToggleWrapText={handleToggleWrapText}
              onUpdateColumnFormat={handleUpdateColumnFormat}
              onDuplicateColumn={handleDuplicateColumn}
              isLoading={isLoadingRows}
            />
          )}
        </div>
      </div>

      {/* Settings Sidebar */}
      <DatabaseSettingsSidebar
        isOpen={isSettingsSidebarOpen}
        onClose={() => setIsSettingsSidebarOpen(false)}
        database={database}
      />

      {/* Document Edit Sidebar */}
      {spaceId && databaseId && editingRowId && (
        <DocumentEditSidebar
          isOpen={!!editingRowId}
          onClose={() => setEditingRowId(null)}
          databaseId={databaseId}
          rowId={editingRowId}
          spaceId={spaceId}
          initialRowData={rowsData?.rows?.find((r: RowItem) => r.id === editingRowId)}
        />
      )}
    </MainLayout>
  )
}
