import { createReactBlockSpec } from '@blocknote/react'
import { useState, useEffect, useMemo, useCallback } from 'react'
import {
  Plus,
  Database,
  MoreHorizontal,
  ExternalLink,
  Trash2,
  Table,
  Search,
  ArrowUpRight,
  FileSpreadsheet,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  ChevronDown,
  Settings2,
  Columns3,
  LayoutGrid,
  Calendar,
  List,
  Kanban,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useDatabase, useDatabaseRows, useCreateRow, useUpdateRow, useDeleteRow, useUpdateDatabase, type PropertySchema, type ViewConfig } from '@/hooks/use-database'
import { useCurrentSpace } from '@/contexts/space-context'
import { PropertyCell } from '@/components/database/common/property-cell'
import { ListView } from '@/components/database/spreadsheet/views/list-view'
import { GalleryView } from '@/components/database/spreadsheet/views/gallery-view'
import { BoardView } from '@/components/database/spreadsheet/views/board-view'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Block settings interface
interface BlockSettings {
  showViewTabs: boolean
  isLocked: boolean
  rowLimit: number | null // null = show all
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
  const navigate = useNavigate()
  const { currentSpace } = useCurrentSpace()
  const { data: database, isLoading: isLoadingDb } = useDatabase(databaseId)
  const { data: rowsData, isLoading: isLoadingRows } = useDatabaseRows(databaseId)
  const createRowMutation = useCreateRow()
  const updateRowMutation = useUpdateRow()
  const deleteRowMutation = useDeleteRow()
  const [isHovered, setIsHovered] = useState(false)

  const allRows = rowsData?.rows || []
  const schema = database?.schema || []
  const views = database?.views || []

  // Get active view
  const activeView = useMemo(() => {
    if (blockSettings.selectedViewId) {
      return views.find(v => v.id === blockSettings.selectedViewId)
    }
    if (database?.default_view) {
      return views.find(v => v.id === database.default_view)
    }
    return views[0]
  }, [views, blockSettings.selectedViewId, database?.default_view])

  // Apply row limit if set
  const rows = blockSettings.rowLimit
    ? allRows.slice(0, blockSettings.rowLimit)
    : allRows
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
          <span className="text-sm">Database not found</span>
        </div>
      </div>
    )
  }

  return (
    <div
      className="inline-block rounded-lg bg-card my-2 outline-none focus:outline-none focus-within:outline-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      tabIndex={-1}
      contentEditable={false}
    >
      {/* Header */}
      <div className="px-3 py-2 flex items-center gap-2 group">
        <span className="text-lg">{database.icon || '📊'}</span>
        <span className="font-medium flex-1">{database.name}</span>

        {/* Lock indicator */}
        {blockSettings.isLocked && (
          <Lock className="h-3.5 w-3.5 text-muted-foreground" />
        )}

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
              Open as full page
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* View tabs toggle */}
            <DropdownMenuCheckboxItem
              checked={blockSettings.showViewTabs}
              onCheckedChange={(checked) =>
                onSettingsChange({ ...blockSettings, showViewTabs: checked })
              }
            >
              <Eye className="h-4 w-4 mr-2" />
              Show view tabs
            </DropdownMenuCheckboxItem>

            {/* Lock toggle */}
            <DropdownMenuCheckboxItem
              checked={blockSettings.isLocked}
              onCheckedChange={(checked) =>
                onSettingsChange({ ...blockSettings, isLocked: checked })
              }
            >
              {blockSettings.isLocked ? (
                <Lock className="h-4 w-4 mr-2" />
              ) : (
                <Unlock className="h-4 w-4 mr-2" />
              )}
              Lock database
            </DropdownMenuCheckboxItem>

            <DropdownMenuSeparator />

            {/* Row limit */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Columns3 className="h-4 w-4 mr-2" />
                Row limit
                {blockSettings.rowLimit && (
                  <span className="ml-auto text-xs text-muted-foreground">
                    {blockSettings.rowLimit}
                  </span>
                )}
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="bg-popover">
                <DropdownMenuCheckboxItem
                  checked={blockSettings.rowLimit === null}
                  onCheckedChange={() =>
                    onSettingsChange({ ...blockSettings, rowLimit: null })
                  }
                >
                  Show all
                </DropdownMenuCheckboxItem>
                {[5, 10, 20, 50].map((limit) => (
                  <DropdownMenuCheckboxItem
                    key={limit}
                    checked={blockSettings.rowLimit === limit}
                    onCheckedChange={() =>
                      onSettingsChange({ ...blockSettings, rowLimit: limit })
                    }
                  >
                    {limit} rows
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
          {database.views.map((view) => {
            const isSelected = blockSettings.selectedViewId === view.id ||
              (!blockSettings.selectedViewId && view.id === database.default_view)
            return (
              <button
                key={view.id}
                onClick={() => onSettingsChange({ ...blockSettings, selectedViewId: view.id })}
                className={`flex items-center gap-1.5 px-2 py-1 rounded text-sm transition-colors whitespace-nowrap ${
                  isSelected
                    ? 'bg-accent text-accent-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {getViewIcon(view.type)}
                <span>{view.name}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* View content - render based on active view type */}
      {isLoadingRows ? (
        <div className="px-3 py-4 text-center text-muted-foreground">
          Loading...
        </div>
      ) : activeView?.type === 'gallery' ? (
        <GalleryView
          rows={rows}
          columns={schema}
          onRowClick={() => {}}
          onCreateRow={canEdit ? handleAddRow : undefined}
        />
      ) : activeView?.type === 'list' ? (
        <ListView
          rows={rows}
          columns={schema}
          onRowClick={() => {}}
          onCreateRow={canEdit ? handleAddRow : undefined}
        />
      ) : activeView?.type === 'board' || activeView?.type === 'kanban' ? (
        <BoardView
          rows={rows}
          columns={schema}
          groupByColumnId={schema.find(s => s.type === 'select')?.id}
          onRowClick={() => {}}
          onCreateRow={canEdit ? handleAddRow : undefined}
          onUpdateRow={canEdit ? (rowId, properties) => handleUpdateRow(rowId, properties) : undefined}
        />
      ) : (
        /* Default: Table view */
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
                    <td colSpan={schema.length + 1} className="px-3 py-4 text-center text-muted-foreground">
                      No rows yet
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
                                Delete
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
                New row
              </Button>
            </div>
          )}
        </>
      )}

      {/* Row limit indicator */}
      {hasMoreRows && (
        <div className="px-3 py-2 text-center text-sm text-muted-foreground border-t bg-muted/20">
          {allRows.length - (blockSettings.rowLimit || 0)} more rows hidden
          <Button
            variant="link"
            size="sm"
            className="ml-2 h-auto p-0"
            onClick={openFullPage}
          >
            View all
          </Button>
        </div>
      )}
    </div>
  )
}

// Database selector for when no database is selected yet (Notion-style)
function DatabaseSelector({
  onSelect,
  onCreate,
}: {
  onSelect: (databaseId: string) => void
  onCreate: () => void
}) {
  const { currentSpace } = useCurrentSpace()
  const [databases, setDatabases] = useState<{ id: string; name: string; icon: string }[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const loadDatabases = async () => {
      if (!currentSpace?.id) return
      try {
        const { apiClient } = await import('@/api/client')
        const response = await apiClient.get<{ databases: { id: string; name: string; icon: string }[] }>(
          `/databases?space_id=${currentSpace.id}`
        )
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
    return databases.filter(db => db.name.toLowerCase().includes(query))
  }, [databases, searchQuery])

  // Show suggested (first 3 databases)
  const suggestedDatabases = filteredDatabases.slice(0, 3)

  return (
    <div className="border rounded-lg bg-card shadow-lg my-2 w-[320px]">
      {/* Header */}
      <div className="px-3 py-2 border-b flex items-center justify-between">
        <span className="text-sm font-medium">New database</span>
        <button className="text-muted-foreground hover:text-foreground p-1">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Search input */}
      <div className="p-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Add or link data source..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-9 text-sm bg-muted/50 border-primary/30 focus:border-primary"
            autoFocus
          />
        </div>
      </div>

      {/* Create options */}
      <div className="px-2 pb-2 space-y-0.5">
        <button
          onClick={onCreate}
          className="w-full flex items-center gap-3 px-2 py-2 rounded-md hover:bg-muted transition-colors text-left"
        >
          <div className="w-6 h-6 rounded bg-muted flex items-center justify-center">
            <Plus className="h-4 w-4 text-muted-foreground" />
          </div>
          <span className="text-sm">New empty data source</span>
        </button>
      </div>

      {/* Suggested databases */}
      {!isLoading && suggestedDatabases.length > 0 && (
        <div className="px-2 pb-2">
          <div className="text-xs text-muted-foreground px-2 py-1.5">Suggested</div>
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

      {/* Link to existing - shown when there are more databases */}
      {!isLoading && databases.length > 3 && (
        <div className="px-2 pb-2 border-t pt-2">
          <button
            onClick={() => {
              // Focus the search input to browse all databases
              setSearchQuery('')
            }}
            className="w-full flex items-center gap-3 px-2 py-2 rounded-md hover:bg-muted transition-colors text-left"
          >
            <div className="w-6 h-6 rounded flex items-center justify-center">
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </div>
            <span className="text-sm text-muted-foreground">Link to existing data source</span>
          </button>
        </div>
      )}

      {/* Show all filtered results when searching */}
      {searchQuery && filteredDatabases.length > 3 && (
        <div className="px-2 pb-2 border-t pt-2 max-h-48 overflow-y-auto">
          <div className="text-xs text-muted-foreground px-2 py-1.5">All results</div>
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
          <p className="text-sm text-muted-foreground">No databases found</p>
          <Button size="sm" className="mt-2" onClick={onCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create "{searchQuery}"
          </Button>
        </div>
      )}

      {/* Empty state - no databases at all */}
      {!isLoading && databases.length === 0 && !searchQuery && (
        <div className="px-4 py-4 text-center border-t">
          <FileSpreadsheet className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground mb-2">No databases yet</p>
          <p className="text-xs text-muted-foreground">Create your first database to get started</p>
        </div>
      )}
    </div>
  )
}

// Wrapper component to handle database block logic with event listeners
function DatabaseBlockContent({
  block,
  editor,
}: {
  block: {
    id: string
    props: {
      databaseId: string
      showViewTabs: boolean
      isLocked: boolean
      rowLimit: number | null
      selectedViewId: string | null
    }
  }
  editor: { isEditable: boolean; updateBlock: (block: any, updates: any) => void }
}) {
  const { databaseId, showViewTabs, isLocked, rowLimit, selectedViewId } = block.props
  const isEditable = editor.isEditable

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
      editor.updateBlock(block, {
        props: {
          ...block.props,
          showViewTabs: newSettings.showViewTabs,
          isLocked: newSettings.isLocked,
          rowLimit: newSettings.rowLimit,
          selectedViewId: newSettings.selectedViewId,
        },
      })
    },
    [block, editor]
  )

  // Listen for database created events
  useEffect(() => {
    const handleDatabaseCreated = (event: CustomEvent<{ blockId: string; databaseId: string }>) => {
      if (event.detail.blockId === block.id) {
        editor.updateBlock(block, {
          props: { ...block.props, databaseId: event.detail.databaseId },
        })
      }
    }

    window.addEventListener('blocknote:databaseCreated', handleDatabaseCreated as EventListener)
    return () => {
      window.removeEventListener('blocknote:databaseCreated', handleDatabaseCreated as EventListener)
    }
  }, [block, editor])

  const handleSelectDatabase = (id: string) => {
    editor.updateBlock(block, {
      props: { ...block.props, databaseId: id },
    })
  }

  const handleCreateDatabase = () => {
    // Dispatch event to open create database modal
    window.dispatchEvent(
      new CustomEvent('blocknote:createDatabase', {
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
            <span className="text-sm">Database not configured</span>
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

// The BlockNote database block spec
export const DatabaseBlock = createReactBlockSpec(
  {
    type: 'database' as const,
    propSchema: {
      databaseId: {
        default: '' as string,
      },
      showViewTabs: {
        default: false as boolean,
      },
      isLocked: {
        default: false as boolean,
      },
      rowLimit: {
        default: null as number | null,
      },
      selectedViewId: {
        default: null as string | null,
      },
    },
    content: 'none' as const,
  },
  {
    render: ({ block, editor }) => {
      return <DatabaseBlockContent block={block} editor={editor} />
    },
  }
)

// Slash menu item for database
export const getDatabaseSlashMenuItem = (editor: any) => ({
  title: 'Database',
  subtext: 'Add an inline database table',
  group: 'Other',
  icon: <Table size={18} />,
  aliases: ['database', 'table', 'db', 'spreadsheet'],
  onItemClick: () => {
    editor.insertBlocks(
      [{ type: 'database', props: { databaseId: '' } }],
      editor.getTextCursorPosition().block,
      'after'
    )
  },
})
