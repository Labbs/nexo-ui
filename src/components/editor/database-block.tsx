/**
 * Database Block for OpenBlock Editor
 *
 * Renders an inline database view within the editor using createReactBlockSpec.
 */

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { createReactBlockSpec, useUpdateBlock } from '@labbs/openblock-react'
import {
  Plus,
  Database,
  MoreHorizontal,
  ExternalLink,
  Trash2,
  Table,
  Search,
  FileSpreadsheet,
  Lock,
  Unlock,
  LayoutGrid,
  Calendar,
  List,
  Kanban,
  Columns3,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  useDatabase,
  useDatabaseRows,
  useCreateRow,
  useUpdateRow,
  useDeleteRow,
} from '@/hooks/use-database'
import type { RowItem } from '@/hooks/use-database'
import type { RowData } from '@/lib/database/columnTypes'

// Local PropertySchema type matching what views expect
interface PropertySchema {
  id: string
  name: string
  type: string
  options?: Record<string, unknown>
}
import { useCurrentSpace } from '@/contexts/space-context'
import { PropertyCell } from '@/components/database/common/property-cell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu'
import type { OpenBlockEditor } from '@labbs/openblock-core'

// Block settings interface
interface BlockSettings {
  showViewTabs: boolean
  isLocked: boolean
  rowLimit: number | null
  selectedViewId: string | null
}

// Get icon for view type
function getViewIcon(viewType: string) {
  switch (viewType) {
    case 'table':
      return <Table className="h-3.5 w-3.5" />
    case 'gallery':
      return <LayoutGrid className="h-3.5 w-3.5" />
    case 'board':
    case 'kanban':
      return <Kanban className="h-3.5 w-3.5" />
    case 'calendar':
      return <Calendar className="h-3.5 w-3.5" />
    case 'list':
      return <List className="h-3.5 w-3.5" />
    default:
      return <Table className="h-3.5 w-3.5" />
  }
}

// Inline database view component
function InlineDatabaseView({
  databaseId,
  isEditable,
  blockSettings,
  onSettingsChange,
}: {
  databaseId: string
  isEditable: boolean
  blockSettings: BlockSettings
  onSettingsChange: (settings: BlockSettings) => void
}) {
  const { t } = useTranslation('database')
  const navigate = useNavigate()
  const { currentSpace } = useCurrentSpace()
  const { data: database, isLoading: isLoadingDb } = useDatabase(databaseId)
  const { data: rowsData, isLoading: isLoadingRows } = useDatabaseRows(databaseId)
  const createRowMutation = useCreateRow()
  const updateRowMutation = useUpdateRow()
  const deleteRowMutation = useDeleteRow()
  const [isHovered, setIsHovered] = useState(false)

  // Cast API data to internal types (filter out incomplete records)
  const allRows: RowData[] = (rowsData?.rows || [])
    .filter((r: RowItem): r is RowItem & { id: string; properties: Record<string, unknown> } =>
      !!r.id && !!r.properties
    )
    .map((r: RowItem & { id: string; properties: Record<string, unknown> }) => ({ id: r.id, properties: r.properties as Record<string, unknown> }))

  const schema: PropertySchema[] = (database?.schema || [])
    .filter((s: { id?: string; name?: string; type?: string; options?: Record<string, unknown> }): s is { id: string; name: string; type: string; options?: Record<string, unknown> } =>
      !!s.id && !!s.name && !!s.type
    )
    .map((s: { id: string; name: string; type: string; options?: Record<string, unknown> }) => ({
      id: s.id,
      name: s.name,
      type: s.type,
      options: s.options as Record<string, unknown> | undefined
    }))

  // Get active view (used for view tabs display)
  const _activeView = useMemo(() => {
    const views = database?.views || []
    if (blockSettings.selectedViewId) {
      return views.find((v: { id?: string; name?: string; type?: string }) => v.id === blockSettings.selectedViewId)
    }
    if (database?.default_view) {
      return views.find((v: { id?: string; name?: string; type?: string }) => v.id === database.default_view)
    }
    return views[0]
  }, [database?.views, blockSettings.selectedViewId, database?.default_view])
  void _activeView // Suppress unused variable warning

  // Apply row limit if set
  const rows = blockSettings.rowLimit ? allRows.slice(0, blockSettings.rowLimit) : allRows
  const hasMoreRows = blockSettings.rowLimit && allRows.length > blockSettings.rowLimit

  // Check if editing is allowed (not locked and editable)
  const canEdit = isEditable && !blockSettings.isLocked

  const handleAddRow = async () => {
    if (!databaseId) return
    const defaultProperties: Record<string, unknown> = {}
    schema.forEach((prop) => {
      if (prop.type === 'title') {
        defaultProperties[prop.id] = ''
      } else if (prop.type === 'checkbox') {
        defaultProperties[prop.id] = false
      } else if (prop.type === 'number') {
        defaultProperties[prop.id] = null
      } else if (prop.type === 'select' || prop.type === 'multi_select') {
        defaultProperties[prop.id] = prop.type === 'multi_select' ? [] : null
      } else {
        defaultProperties[prop.id] = ''
      }
    })
    await createRowMutation.mutateAsync({ databaseId, properties: defaultProperties })
  }

  const handleUpdateRow = async (rowId: string, properties: Record<string, unknown>) => {
    await updateRowMutation.mutateAsync({ databaseId, rowId, properties })
  }

  const handleDeleteRow = async (rowId: string) => {
    await deleteRowMutation.mutateAsync({ databaseId, rowId })
  }

  const openFullPage = () => {
    if (currentSpace?.id && databaseId) {
      navigate(`/space/${currentSpace.id}/database/${databaseId}`)
    }
  }

  if (isLoadingDb) {
    return (
      <div className="rounded-lg p-4 bg-muted/30">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded bg-muted animate-pulse" />
          <div className="h-4 w-32 rounded bg-muted animate-pulse" />
        </div>
      </div>
    )
  }

  if (!database) {
    return (
      <div className="rounded-lg p-4 bg-destructive/10 text-destructive">
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4" />
          <span className="text-sm">{t('notFound')}</span>
        </div>
      </div>
    )
  }

  return (
    <div
      className="inline-block rounded-lg bg-card my-2 outline-none focus:outline-none focus-within:outline-none border"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      tabIndex={-1}
    >
      {/* Header */}
      <div className="px-3 py-2 flex items-center gap-2 group">
        <span className="text-lg">{database.icon || '📊'}</span>
        <span className="font-medium flex-1">{database.name}</span>

        {/* Lock indicator */}
        {blockSettings.isLocked && <Lock className="h-3.5 w-3.5 text-muted-foreground" />}

        {/* Settings menu - visible on hover */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`h-7 w-7 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {/* Open full page */}
            <DropdownMenuItem onClick={openFullPage}>
              <ExternalLink className="h-4 w-4 mr-2" />
              {t('block.openAsFullPage')}
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* View tabs toggle */}
            <DropdownMenuCheckboxItem
              checked={blockSettings.showViewTabs}
              onCheckedChange={(checked) =>
                onSettingsChange({ ...blockSettings, showViewTabs: checked })
              }
            >
              {t('block.showViewTabs')}
            </DropdownMenuCheckboxItem>

            {/* Lock toggle */}
            <DropdownMenuCheckboxItem
              checked={blockSettings.isLocked}
              onCheckedChange={(checked) =>
                onSettingsChange({ ...blockSettings, isLocked: checked })
              }
            >
              {blockSettings.isLocked ? (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  {t('block.locked')}
                </>
              ) : (
                <>
                  <Unlock className="h-4 w-4 mr-2" />
                  {t('block.lockDatabase')}
                </>
              )}
            </DropdownMenuCheckboxItem>

            <DropdownMenuSeparator />

            {/* Row limit */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Columns3 className="h-4 w-4 mr-2" />
                {t('block.rowLimit')}
                {blockSettings.rowLimit && (
                  <span className="ml-auto text-xs text-muted-foreground">
                    {blockSettings.rowLimit}
                  </span>
                )}
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="bg-popover">
                <DropdownMenuCheckboxItem
                  checked={blockSettings.rowLimit === null}
                  onCheckedChange={() => onSettingsChange({ ...blockSettings, rowLimit: null })}
                >
                  {t('block.showAll')}
                </DropdownMenuCheckboxItem>
                {[5, 10, 20, 50].map((limit) => (
                  <DropdownMenuCheckboxItem
                    key={limit}
                    checked={blockSettings.rowLimit === limit}
                    onCheckedChange={() => onSettingsChange({ ...blockSettings, rowLimit: limit })}
                  >
                    {t('block.rows', { count: limit })}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* View tabs */}
      {blockSettings.showViewTabs && database.views && database.views.length > 0 && (
        <div className="px-3 py-1 border-b flex items-center gap-1 overflow-x-auto">
          {database.views.map((view: { id?: string; name?: string; type?: string }) => {
            const isSelected =
              blockSettings.selectedViewId === view.id ||
              (!blockSettings.selectedViewId && view.id === database.default_view)
            return (
              <button
                key={view.id}
                onClick={() => onSettingsChange({ ...blockSettings, selectedViewId: view.id || null })}
                className={`flex items-center gap-1.5 px-2 py-1 rounded text-sm transition-colors whitespace-nowrap ${
                  isSelected
                    ? 'bg-accent text-accent-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {getViewIcon(view.type || 'table')}
                <span>{view.name}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* View content - table view for inline database blocks */}
      {isLoadingRows ? (
        <div className="px-3 py-4 text-center text-muted-foreground">{t('common:loading')}</div>
      ) : (
        <>
          <div className="overflow-x-auto focus:outline-none" tabIndex={-1}>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b bg-muted/20">
                  {schema.map((property) => (
                    <th
                      key={property.id}
                      className="px-3 py-2 text-left font-medium text-muted-foreground min-w-[120px]"
                    >
                      {property.name}
                    </th>
                  ))}
                  {canEdit && <th className="w-10" />}
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={schema.length + 1}
                      className="px-3 py-4 text-center text-muted-foreground"
                    >
                      {t('block.noRowsYet')}
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr key={row.id} className="border-b hover:bg-muted/10 group">
                      {schema.map((property) => (
                        <td key={property.id} className="px-1 py-0.5">
                          <PropertyCell
                            property={property}
                            value={row.properties[property.id]}
                            onChange={(value) => {
                              if (!canEdit) return
                              handleUpdateRow(row.id, {
                                ...row.properties,
                                [property.id]: value,
                              })
                            }}
                            isEditing={false}
                            onStartEdit={() => {}}
                            onEndEdit={() => {}}
                          />
                        </td>
                      ))}
                      {canEdit && (
                        <td className="w-10 px-1">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 opacity-0 group-hover:opacity-100"
                              >
                                <MoreHorizontal className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDeleteRow(row.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                {t('common:delete')}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer for table view */}
          {canEdit && (
            <div className="px-2 py-1 border-t">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-muted-foreground hover:text-foreground h-8"
                onClick={handleAddRow}
              >
                <Plus className="h-3.5 w-3.5 mr-2" />
                {t('block.newRow')}
              </Button>
            </div>
          )}
        </>
      )}

      {/* Row limit indicator */}
      {hasMoreRows && (
        <div className="px-3 py-2 text-center text-sm text-muted-foreground border-t bg-muted/20">
          {t('block.moreRowsHidden', { count: allRows.length - (blockSettings.rowLimit || 0) })}
          <Button variant="link" size="sm" className="ml-2 h-auto p-0" onClick={openFullPage}>
            {t('block.viewAll')}
          </Button>
        </div>
      )}
    </div>
  )
}

// Database selector for when no database is selected yet
function DatabaseSelector({
  onSelect,
  onCreate,
}: {
  onSelect: (databaseId: string) => void
  onCreate: () => void
}) {
  const { t } = useTranslation('database')
  const { currentSpace } = useCurrentSpace()
  const [databases, setDatabases] = useState<{ id: string; name: string; icon: string }[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const loadDatabases = async () => {
      if (!currentSpace?.id) return
      try {
        const { apiClient } = await import('@/api/client')
        const response = await apiClient.get<{
          databases: { id: string; name: string; icon: string }[]
        }>(`/databases?space_id=${currentSpace.id}`)
        setDatabases(response.data.databases || [])
      } catch (error) {
        console.error('Failed to load databases:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadDatabases()
  }, [currentSpace?.id])

  // Filter databases by search query
  const filteredDatabases = useMemo(() => {
    if (!searchQuery.trim()) return databases
    const query = searchQuery.toLowerCase()
    return databases.filter((db) => db.name.toLowerCase().includes(query))
  }, [databases, searchQuery])

  // Show suggested (first 3 databases)
  const suggestedDatabases = filteredDatabases.slice(0, 3)

  return (
    <div className="border rounded-lg bg-card shadow-lg my-2 w-[320px]">
      {/* Header */}
      <div className="px-3 py-2 border-b flex items-center justify-between">
        <span className="text-sm font-medium">{t('block.linkDatabase')}</span>
      </div>

      {/* Search input */}
      <div className="p-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t('block.searchDatabases')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-9 text-sm bg-muted/50"
            autoFocus
          />
        </div>
      </div>

      {/* Create option */}
      <div className="px-2 pb-2 space-y-0.5">
        <button
          onClick={onCreate}
          className="w-full flex items-center gap-3 px-2 py-2 rounded-md hover:bg-muted transition-colors text-left"
        >
          <div className="w-6 h-6 rounded bg-muted flex items-center justify-center">
            <Plus className="h-4 w-4 text-muted-foreground" />
          </div>
          <span className="text-sm">{t('block.newDatabase')}</span>
        </button>
      </div>

      {/* Suggested databases */}
      {!isLoading && suggestedDatabases.length > 0 && (
        <div className="px-2 pb-2">
          <div className="text-xs text-muted-foreground px-2 py-1.5">{t('block.databases')}</div>
          <div className="space-y-0.5">
            {suggestedDatabases.map((db) => (
              <button
                key={db.id}
                onClick={() => onSelect(db.id)}
                className="w-full flex items-center gap-3 px-2 py-2 rounded-md hover:bg-muted transition-colors text-left group"
              >
                <div className="w-6 h-6 rounded bg-muted flex items-center justify-center text-sm">
                  {db.icon || '📊'}
                </div>
                <span className="text-sm flex-1 truncate">{db.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="px-2 pb-2 space-y-1">
          <div className="h-10 rounded bg-muted animate-pulse" />
          <div className="h-10 rounded bg-muted animate-pulse" />
        </div>
      )}

      {/* More results */}
      {!isLoading && filteredDatabases.length > 3 && (
        <div className="px-2 pb-2 border-t pt-2 max-h-48 overflow-y-auto">
          <div className="text-xs text-muted-foreground px-2 py-1.5">{t('block.more')}</div>
          <div className="space-y-0.5">
            {filteredDatabases.slice(3).map((db) => (
              <button
                key={db.id}
                onClick={() => onSelect(db.id)}
                className="w-full flex items-center gap-3 px-2 py-2 rounded-md hover:bg-muted transition-colors text-left"
              >
                <div className="w-6 h-6 rounded bg-muted flex items-center justify-center text-sm">
                  {db.icon || '📊'}
                </div>
                <span className="text-sm flex-1 truncate">{db.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No results */}
      {searchQuery && filteredDatabases.length === 0 && !isLoading && (
        <div className="px-4 py-6 text-center">
          <p className="text-sm text-muted-foreground">{t('block.noDatabasesFound')}</p>
          <Button size="sm" className="mt-2" onClick={onCreate}>
            <Plus className="h-4 w-4 mr-2" />
            {t('block.createWithName', { name: searchQuery })}
          </Button>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && databases.length === 0 && !searchQuery && (
        <div className="px-4 py-4 text-center border-t">
          <FileSpreadsheet className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground mb-2">{t('block.noDatabasesYet')}</p>
          <p className="text-xs text-muted-foreground">{t('block.createFirstDatabase')}</p>
        </div>
      )}
    </div>
  )
}

// Database block render component
function DatabaseBlockRender({
  block,
  editor,
  isEditable,
}: {
  block: {
    id: string
    type: string
    props: {
      databaseId: string
      showViewTabs: boolean
      isLocked: boolean
      rowLimit: number | null
      selectedViewId: string | null
    }
  }
  editor: OpenBlockEditor
  isEditable: boolean
}) {
  const { t } = useTranslation('database')
  const { databaseId, showViewTabs, isLocked, rowLimit, selectedViewId } = block.props
  const updateBlock = useUpdateBlock(editor, block.id)

  // Build block settings object
  const blockSettings: BlockSettings = {
    showViewTabs: showViewTabs ?? false,
    isLocked: isLocked ?? false,
    rowLimit: rowLimit ?? null,
    selectedViewId: selectedViewId ?? null,
  }

  // Handle settings change
  const handleSettingsChange = useCallback(
    (newSettings: BlockSettings) => {
      updateBlock({
        showViewTabs: newSettings.showViewTabs,
        isLocked: newSettings.isLocked,
        rowLimit: newSettings.rowLimit,
        selectedViewId: newSettings.selectedViewId,
      })
    },
    [updateBlock]
  )

  // Listen for database created events
  useEffect(() => {
    const handleDatabaseCreated = (event: CustomEvent<{ blockId: string; databaseId: string }>) => {
      if (event.detail.blockId === block.id) {
        updateBlock({ databaseId: event.detail.databaseId })
      }
    }

    window.addEventListener('openblock:databaseCreated', handleDatabaseCreated as EventListener)
    return () => {
      window.removeEventListener(
        'openblock:databaseCreated',
        handleDatabaseCreated as EventListener
      )
    }
  }, [block.id, updateBlock])

  const handleSelectDatabase = (id: string) => {
    updateBlock({ databaseId: id })
  }

  const handleCreateDatabase = () => {
    // Dispatch event to open create database modal
    window.dispatchEvent(
      new CustomEvent('openblock:createDatabase', {
        detail: { blockId: block.id },
      })
    )
  }

  if (!databaseId) {
    if (!isEditable) {
      return (
        <div className="rounded-lg p-4 bg-muted/30 my-2 text-muted-foreground">
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
      isEditable={isEditable}
      blockSettings={blockSettings}
      onSettingsChange={handleSettingsChange}
    />
  )
}

// Create the database block spec
export const DatabaseBlock = createReactBlockSpec(
  {
    type: 'database',
    propSchema: {
      databaseId: { default: '' as string },
      showViewTabs: { default: false as boolean },
      isLocked: { default: false as boolean },
      rowLimit: { default: null as number | null },
      selectedViewId: { default: null as string | null },
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
