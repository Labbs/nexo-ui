import { useCallback, useState, useMemo, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Loader2, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
} from '@/hooks/use-database'
import { DatabaseSettingsSidebar } from '../common/database-settings-sidebar'
import { ViewTabs } from '../common/view-tabs'
import { DocumentTableView } from './document-table-view'
import { DocumentEditSidebar } from './document-edit-sidebar'

export function DocumentDatabaseView() {
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
  const [databaseName, setDatabaseName] = useState('')
  const [isEditingName, setIsEditingName] = useState(false)
  const [isSettingsSidebarOpen, setIsSettingsSidebarOpen] = useState(false)

  // Sync database name from API
  const currentName = database?.name || ''
  if (currentName && !databaseName && !isEditingName) {
    setDatabaseName(currentName)
  }

  // Get hidden columns from active view
  const hiddenColumnIds = useMemo(() => {
    return new Set(activeView?.hiddenColumns || [])
  }, [activeView?.hiddenColumns])

  // Filter visible columns based on view's hidden columns
  const visibleSchema: PropertySchema[] = useMemo(() => {
    if (!database?.schema) return []
    return database.schema.filter(col => col.id && !hiddenColumnIds.has(col.id))
  }, [database?.schema, hiddenColumnIds])

  // Convert rows from API format
  const rows = useMemo(() => {
    if (!rowsData?.rows) return []
    return rowsData.rows.map(row => ({
      id: row.id || '',
      properties: row.properties || {},
      showInSidebar: (row as { show_in_sidebar?: boolean }).show_in_sidebar,
    }))
  }, [rowsData?.rows])

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

    const newSchema = [...database.schema, property]
    await updateDatabase.mutateAsync({
      databaseId,
      schema: newSchema,
    })
  }, [databaseId, database?.schema, updateDatabase])

  // Save database name
  const saveDatabaseName = useCallback(() => {
    if (!databaseId || !databaseName.trim()) return

    updateDatabase.mutate({
      databaseId,
      name: databaseName.trim(),
    })

    setIsEditingName(false)
  }, [databaseId, databaseName, updateDatabase])

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
          <p className="text-muted-foreground">Database not found</p>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="flex flex-col h-full">
        {/* Simple header with database name */}
        <div className="px-12 py-6 flex items-center justify-center relative">
          <div className="text-center">
            {isEditingName ? (
              <input
                type="text"
                value={databaseName}
                onChange={(e) => setDatabaseName(e.target.value)}
                onBlur={saveDatabaseName}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    saveDatabaseName()
                  }
                  if (e.key === 'Escape') {
                    setDatabaseName(database.name || '')
                    setIsEditingName(false)
                  }
                }}
                className="text-3xl font-bold bg-transparent border-none outline-none text-center"
                autoFocus
              />
            ) : (
              <h1
                className="text-3xl font-bold cursor-pointer hover:bg-muted/50 rounded px-2 inline-block"
                onClick={() => setIsEditingName(true)}
              >
                {database.name || 'Untitled Database'}
              </h1>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSettingsSidebarOpen(true)}
            title="Database settings"
            className="absolute right-12"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>

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
            onDuplicateView={(viewId) => {
              if (!databaseId) return
              const viewToDuplicate = views.find(v => v.id === viewId)
              if (!viewToDuplicate) return
              createView.mutate({
                databaseId,
                name: `${viewToDuplicate.name} (copy)`,
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
            onShowColumn={showColumn}
            onHideColumn={hideColumn}
            onShowAllColumns={showAllColumns}
            canDeleteView={views.length > 1}
          />
        )}

        {/* Document table view */}
        <div className="flex-1 min-h-0 overflow-auto px-12 py-4">
          <DocumentTableView
            schema={visibleSchema}
            rows={rows}
            onUpdateRow={handleUpdateRow}
            onDeleteRow={handleDeleteRow}
            onAddRow={handleAddRow}
            onAddProperty={handleAddProperty}
            onOpenDocument={setEditingRowId}
            isLoading={isLoadingRows}
          />
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
        />
      )}
    </MainLayout>
  )
}
