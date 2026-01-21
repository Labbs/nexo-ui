import { useRef, useLayoutEffect, useState, useCallback } from 'react'
import DataEditor, { GridCellKind, type DrawCellCallback } from '@glideapps/glide-data-grid'
import '@glideapps/glide-data-grid/dist/index.css'
import { MainLayout } from '@/components/layout/main-layout'
import {
  Loader2,
  AlignLeft,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  WrapText,
  PanelLeftClose,
  PanelRightClose,
  EyeOff,
  Trash2,
  Search,
  Plus,
  GripVertical,
  ChevronRight,
  CircleDot,
} from 'lucide-react'
import { ContentHeader } from '@/components/shared/content-header'
import { DatabaseSettingsSidebar } from '@/components/database/common/database-settings-sidebar'
import { ViewTabs } from '@/components/database/common/view-tabs'
import { ListView, GalleryView, BoardView } from '@/components/database/spreadsheet/views'
import { DocumentDatabaseView } from '@/components/database/document'

// Import the hook that contains all logic
import { useDatabasePage } from '@/hooks/ui/useDatabasePage'
import { columnTypes, selectOptionColors, type SelectOption } from '@/lib/database'

// Hook to get container dimensions
function useContainerSize(ref: React.RefObject<HTMLDivElement | null>) {
  const [size, setSize] = useState({ width: 0, height: 0 })

  useLayoutEffect(() => {
    let mounted = true
    let resizeObserver: ResizeObserver | null = null
    let timeoutId: ReturnType<typeof setTimeout> | null = null

    const measure = () => {
      const element = ref.current
      if (!element || !mounted) return

      const newWidth = element.clientWidth
      const newHeight = element.clientHeight
      if (newWidth > 0 && newHeight > 0) {
        setSize({ width: newWidth, height: newHeight })
      }
    }

    measure()

    const checkAndObserve = () => {
      const element = ref.current
      if (element && mounted) {
        measure()
        resizeObserver = new ResizeObserver(measure)
        resizeObserver.observe(element)
      } else if (mounted) {
        timeoutId = setTimeout(checkAndObserve, 50)
      }
    }

    checkAndObserve()

    return () => {
      mounted = false
      if (timeoutId) clearTimeout(timeoutId)
      if (resizeObserver) resizeObserver.disconnect()
    }
  }, [ref])

  return size
}

export function DatabasePage() {
  // Get all state and actions from the hook
  const db = useDatabasePage()

  // Container ref for measuring width
  const containerRef = useRef<HTMLDivElement>(null)
  const { width } = useContainerSize(containerRef)

  // Custom cell drawing for select cells with colors
  const drawCell: DrawCellCallback = useCallback(
    (args, drawContent) => {
      const { cell, rect, ctx, col } = args
      const column = db.columns[col]

      if (!column || (column.type !== 'select' && column.type !== 'multi_select')) {
        drawContent()
        return
      }

      if (cell.kind !== GridCellKind.Bubble) {
        drawContent()
        return
      }

      const bubbleData = cell.data as string[]
      if (!bubbleData || bubbleData.length === 0) {
        drawContent()
        return
      }

      const selectOptions = column.options?.options as SelectOption[] | undefined
      const padding = 8
      const tagHeight = 20
      const tagRadius = 4
      const tagGap = 4
      const fontSize = 12

      let x = rect.x + padding
      const y = rect.y + (rect.height - tagHeight) / 2

      ctx.font = `${fontSize}px Inter, system-ui, sans-serif`
      ctx.textBaseline = 'middle'

      for (const displayValue of bubbleData) {
        const option = selectOptions?.find(o => o.name === displayValue)
        const colorValue = option?.color || 'default'
        const colorDef = selectOptionColors.find(c => c.value === colorValue) || selectOptionColors[0]

        const textWidth = ctx.measureText(displayValue).width
        const tagWidth = textWidth + 12

        if (x + tagWidth > rect.x + rect.width - padding) {
          break
        }

        ctx.fillStyle = db.isDarkMode ? colorDef.hexDark : colorDef.hex
        ctx.beginPath()
        ctx.roundRect(x, y, tagWidth, tagHeight, tagRadius)
        ctx.fill()

        ctx.fillStyle = db.isDarkMode ? colorDef.textHexDark : colorDef.textHex
        ctx.fillText(displayValue, x + 6, y + tagHeight / 2 + 1)

        x += tagWidth + tagGap
      }
    },
    [db.columns, db.isDarkMode]
  )

  // Loading state
  if (db.isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </MainLayout>
    )
  }

  // Not found state
  if (!db.database) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Database not found</p>
        </div>
      </MainLayout>
    )
  }

  // Document database type
  if ((db.database as { type?: string }).type === 'document') {
    return <DocumentDatabaseView />
  }

  // Spreadsheet database type (default)
  return (
    <MainLayout>
      <div className="flex flex-col h-full">
        {/* Header with database name */}
        <ContentHeader
          title={db.database?.name || ''}
          onTitleChange={(name) => db.updateDatabaseName(name)}
          onSettingsClick={() => db.setIsSettingsSidebarOpen(true)}
          placeholder="Untitled Database"
          breadcrumbs={db.breadcrumbs}
          icon={db.database?.icon}
          defaultIcon="🗃️"
          onIconChange={db.updateDatabaseIcon}
          updatedAt={(db.database as any)?.updated_at}
        />

        {/* View tabs */}
        {db.views.length > 0 && (
          <ViewTabs
            views={db.views}
            activeViewId={db.activeViewId}
            activeView={db.activeView}
            columns={db.database?.schema || []}
            allColumns={db.database?.schema || []}
            hiddenColumnIds={db.hiddenColumnIds}
            onViewChange={db.setActiveViewId}
            onCreateView={db.handleCreateView}
            onRenameView={db.handleRenameView}
            onDuplicateView={db.handleDuplicateView}
            onDeleteView={db.handleDeleteView}
            onFilterChange={db.handleFilterChange}
            onSortChange={db.handleSortChange}
            onShowColumn={db.showColumn}
            onHideColumn={db.hideColumn}
            onShowAllColumns={db.showAllColumns}
            canDeleteView={db.views.length > 1}
          />
        )}

        {/* Database view content */}
        <div className="flex-1 min-h-0 overflow-auto">
          {/* List View */}
          {db.activeView?.type === 'list' && (
            <div className="px-12 py-4">
              <ListView
                rows={db.rows}
                columns={db.database?.schema || []}
                onRowClick={(rowId) => console.log('Open row:', rowId)}
                onCreateRow={db.onRowAppended}
              />
            </div>
          )}

          {/* Gallery View */}
          {db.activeView?.type === 'gallery' && (
            <GalleryView
              rows={db.rows}
              columns={db.database?.schema || []}
              onRowClick={(rowId) => console.log('Open row:', rowId)}
              onCreateRow={db.onRowAppended}
            />
          )}

          {/* Board View */}
          {db.activeView?.type === 'board' && (
            <BoardView
              rows={db.rows}
              columns={db.database?.schema || []}
              onRowClick={(rowId) => console.log('Open row:', rowId)}
              onCreateRow={db.handleBoardCreateRow}
              onUpdateRow={db.handleBoardUpdateRow}
            />
          )}

          {/* Table View (default) */}
          {(!db.activeView?.type || db.activeView?.type === 'table') && (
            <div className="px-12 py-4">
              <div ref={containerRef} className="w-full" style={{ position: 'relative' }}>
                {width > 0 && (
                  <DataEditor
                    columns={db.gridColumns}
                    rows={db.rows.length}
                    getCellContent={db.getCellContent}
                    drawCell={drawCell}
                    onCellEdited={db.onCellEdited}
                    onHeaderMenuClick={db.onHeaderMenuClick}
                    onHeaderClicked={db.onHeaderClicked}
                    theme={db.gridTheme}
                    width={width}
                    height={36 + db.rows.length * 36 + 1}
                    rowMarkers="number"
                    smoothScrollX
                    rowHeight={36}
                    headerHeight={36}
                    getCellsForSelection={true}
                    keybindings={{
                      search: true,
                      selectAll: true,
                      selectColumn: true,
                      selectRow: true,
                      copy: true,
                      paste: true,
                      delete: true,
                      downFill: true,
                      rightFill: true,
                    }}
                    onColumnResize={db.onColumnResize}
                    onCellClicked={db.onCellClicked}
                  />
                )}

                {/* Add row button */}
                <button
                  onClick={db.onRowAppended}
                  className="w-full py-2 text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors text-left pl-10"
                >
                  + New
                </button>

                {/* Header Menu */}
                <HeaderMenu db={db} />

                {/* Add Column Menu */}
                <AddColumnMenu db={db} />

                {/* Select Cell Editor */}
                <SelectCellEditor db={db} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Settings Sidebar */}
      <DatabaseSettingsSidebar
        isOpen={db.isSettingsSidebarOpen}
        onClose={() => db.setIsSettingsSidebarOpen(false)}
        database={db.database}
      />
    </MainLayout>
  )
}

// Header Menu Component
function HeaderMenu({ db }: { db: ReturnType<typeof useDatabasePage> }) {
  if (!db.headerMenuOpen) return null

  const column = db.columns[db.headerMenuOpen.col]
  const IconComponent = columnTypes.find(t => t.value === column?.type)?.icon || AlignLeft

  return (
    <>
      <div
        className="fixed inset-0 z-[999]"
        onClick={() => {
          db.setHeaderMenuOpen(null)
          db.setShowSortSubmenu(false)
          db.setEditingOptionId(null)
        }}
      />
      <div
        className="fixed rounded-lg shadow-lg z-[1000] w-[280px] py-2"
        style={{
          left: db.headerMenuOpen.bounds.x,
          top: db.headerMenuOpen.bounds.y + db.headerMenuOpen.bounds.height,
          backgroundColor: db.isDarkMode ? '#1f2937' : '#ffffff',
          border: `1px solid ${db.isDarkMode ? '#374151' : '#e5e7eb'}`,
        }}
      >
        {/* Column name input */}
        <div className="px-3 pb-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-muted/30">
            <IconComponent className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <input
              type="text"
              value={db.editingColumnName}
              onChange={(e) => db.setEditingColumnName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  db.renameColumn(db.headerMenuOpen!.col, db.editingColumnName)
                  db.setHeaderMenuOpen(null)
                }
                if (e.key === 'Escape') {
                  db.setHeaderMenuOpen(null)
                }
              }}
              onBlur={() => db.renameColumn(db.headerMenuOpen!.col, db.editingColumnName)}
              className="flex-1 bg-transparent text-sm outline-none min-w-0"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>

        {/* Filter */}
        <MenuItem icon={Filter} label="Filter" onClick={() => db.setHeaderMenuOpen(null)} />

        {/* Sort */}
        <div
          className="relative"
          onMouseEnter={() => db.setShowSortSubmenu(true)}
          onMouseLeave={() => db.setShowSortSubmenu(false)}
        >
          <MenuItem icon={ArrowUpDown} label="Sort" hasSubmenu />
          {db.showSortSubmenu && (
            <SortSubmenu db={db} />
          )}
        </div>

        {/* Wrap content */}
        <MenuItem
          icon={WrapText}
          label="Wrap content"
          checked={!!(column?.options?.wrap as boolean)}
          onClick={() => {
            // Toggle wrap would need to be added to hook
            db.setHeaderMenuOpen(null)
          }}
        />

        {/* Insert left/right */}
        <MenuItem icon={PanelLeftClose} label="Insert left" onClick={() => db.setHeaderMenuOpen(null)} />
        <MenuItem icon={PanelRightClose} label="Insert right" onClick={() => db.setHeaderMenuOpen(null)} />

        {/* Edit property for select columns */}
        {(column?.type === 'select' || column?.type === 'multi_select') && (
          <div
            className="relative"
            onMouseEnter={() => db.setOptionsMenuOpen({ col: db.headerMenuOpen!.col, bounds: db.headerMenuOpen!.bounds })}
            onMouseLeave={() => {
              db.setOptionsMenuOpen(null)
              db.setEditingOptionId(null)
            }}
          >
            <MenuItem icon={CircleDot} label="Edit property" hasSubmenu />
            {db.optionsMenuOpen && <SelectOptionsMenu db={db} />}
          </div>
        )}

        <div className="h-px bg-border mx-3 my-1" />

        {/* Hide in view */}
        <MenuItem
          icon={EyeOff}
          label="Hide in view"
          onClick={() => {
            const columnId = column?.id
            if (columnId) db.hideColumn(columnId)
          }}
        />

        {/* Delete column */}
        <div
          onClick={() => db.deleteColumn(db.headerMenuOpen!.col)}
          className="mx-2 px-3 py-1.5 cursor-pointer flex items-center gap-3 text-sm text-destructive hover:bg-destructive/10 rounded-md"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete column</span>
        </div>
      </div>
    </>
  )
}

// MenuItem Component
function MenuItem({
  icon: Icon,
  label,
  onClick,
  hasSubmenu,
  checked,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  onClick?: () => void
  hasSubmenu?: boolean
  checked?: boolean
}) {
  return (
    <div
      onClick={onClick}
      className="mx-2 px-3 py-1.5 cursor-pointer flex items-center gap-3 text-sm hover:bg-muted rounded-md"
    >
      <Icon className="w-4 h-4 text-muted-foreground" />
      <span className="flex-1">{label}</span>
      {hasSubmenu && <span className="text-muted-foreground text-xs">›</span>}
      {checked && <span className="text-primary">✓</span>}
    </div>
  )
}

// Sort Submenu
function SortSubmenu({ db }: { db: ReturnType<typeof useDatabasePage> }) {
  const columnId = db.columns[db.headerMenuOpen!.col]?.id

  return (
    <div
      className="absolute left-full top-0 ml-1 rounded-lg shadow-lg w-[160px] py-1"
      style={{
        backgroundColor: db.isDarkMode ? '#1f2937' : '#ffffff',
        border: `1px solid ${db.isDarkMode ? '#374151' : '#e5e7eb'}`,
      }}
    >
      <div
        onClick={() => {
          if (columnId) {
            db.sortByColumn(columnId, 'asc')
            db.setHeaderMenuOpen(null)
            db.setShowSortSubmenu(false)
          }
        }}
        className="mx-1 px-3 py-1.5 cursor-pointer flex items-center gap-3 text-sm hover:bg-muted rounded-md"
      >
        <ArrowUp className="w-4 h-4 text-muted-foreground" />
        <span>Ascending</span>
      </div>
      <div
        onClick={() => {
          if (columnId) {
            db.sortByColumn(columnId, 'desc')
            db.setHeaderMenuOpen(null)
            db.setShowSortSubmenu(false)
          }
        }}
        className="mx-1 px-3 py-1.5 cursor-pointer flex items-center gap-3 text-sm hover:bg-muted rounded-md"
      >
        <ArrowDown className="w-4 h-4 text-muted-foreground" />
        <span>Descending</span>
      </div>
    </div>
  )
}

// Select Options Menu
function SelectOptionsMenu({ db }: { db: ReturnType<typeof useDatabasePage> }) {
  if (!db.optionsMenuOpen) return null

  const column = db.columns[db.optionsMenuOpen.col]
  const options = db.getSelectOptions(db.optionsMenuOpen.col)

  return (
    <div
      className="absolute left-full top-0 -ml-1 pl-2 z-[1001]"
      onMouseEnter={() => db.setOptionsMenuOpen({ col: db.headerMenuOpen!.col, bounds: db.headerMenuOpen!.bounds })}
      onMouseLeave={() => {
        db.setOptionsMenuOpen(null)
        db.setEditingOptionId(null)
      }}
    >
      <div
        className="rounded-lg shadow-lg w-[280px]"
        style={{
          backgroundColor: db.isDarkMode ? '#1f2937' : '#ffffff',
          border: `1px solid ${db.isDarkMode ? '#374151' : '#e5e7eb'}`,
        }}
      >
        {/* Header */}
        <div className="px-3 py-2 border-b border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Edit property</span>
            <span className="text-xs text-muted-foreground">
              {column?.type === 'multi_select' ? 'Multi-select' : 'Select'}
            </span>
          </div>
        </div>

        {/* Options */}
        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">Options</span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                db.addSelectOption(db.optionsMenuOpen!.col)
              }}
              className="p-1 hover:bg-muted rounded"
            >
              <Plus className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          <div className="space-y-1 max-h-64 overflow-y-auto">
            {options.map((option) => (
              <SelectOptionItem key={option.id} option={option} db={db} />
            ))}
            {options.length === 0 && (
              <div className="text-xs text-muted-foreground text-center py-4">
                No options yet. Click + to add one.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Select Option Item
function SelectOptionItem({
  option,
  db,
}: {
  option: SelectOption
  db: ReturnType<typeof useDatabasePage>
}) {
  const colorInfo = selectOptionColors.find(c => c.value === option.color) || selectOptionColors[0]

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.stopPropagation()
        db.setDraggingOptionId(option.id)
        e.dataTransfer.effectAllowed = 'move'
      }}
      onDragOver={(e) => {
        e.preventDefault()
        e.stopPropagation()
        if (db.draggingOptionId && db.draggingOptionId !== option.id) {
          db.setDragOverOptionId(option.id)
        }
      }}
      onDragLeave={(e) => {
        e.stopPropagation()
        db.setDragOverOptionId(null)
      }}
      onDrop={(e) => {
        e.preventDefault()
        e.stopPropagation()
        if (db.draggingOptionId && db.draggingOptionId !== option.id) {
          db.reorderSelectOptions(db.optionsMenuOpen!.col, db.draggingOptionId, option.id)
        }
        db.setDraggingOptionId(null)
        db.setDragOverOptionId(null)
      }}
      onDragEnd={() => {
        db.setDraggingOptionId(null)
        db.setDragOverOptionId(null)
      }}
      className={db.dragOverOptionId === option.id ? 'border-t-2 border-primary' : ''}
    >
      <div
        className={`flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted group cursor-pointer ${
          db.draggingOptionId === option.id ? 'opacity-50' : ''
        }`}
        onClick={(e) => {
          e.stopPropagation()
          db.setEditingOptionId(db.editingOptionId === option.id ? null : option.id)
        }}
      >
        <GripVertical className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 flex-shrink-0 cursor-grab active:cursor-grabbing" />
        <span className={`px-2 py-0.5 rounded text-xs ${colorInfo.bg} ${colorInfo.text}`}>
          {option.name || 'Unnamed'}
        </span>
        <ChevronRight className={`w-3.5 h-3.5 text-muted-foreground ml-auto transition-transform ${db.editingOptionId === option.id ? 'rotate-90' : ''}`} />
      </div>

      {/* Expanded editor */}
      {db.editingOptionId === option.id && (
        <div
          className="ml-6 mt-2 mb-3 p-2 rounded-md bg-muted/30 border border-border"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="text"
            value={option.name}
            onChange={(e) => db.updateSelectOption(db.optionsMenuOpen!.col, option.id, { name: e.target.value })}
            placeholder="Option name"
            className="w-full px-2 py-1.5 text-sm border border-border rounded bg-background outline-none focus:border-primary mb-2"
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />

          {/* Color picker */}
          <div className="mb-2">
            <span className="text-xs text-muted-foreground">Color</span>
            <div className="grid grid-cols-5 gap-1 mt-1">
              {selectOptionColors.map((color) => (
                <button
                  key={color.value}
                  onClick={(e) => {
                    e.stopPropagation()
                    db.updateSelectOption(db.optionsMenuOpen!.col, option.id, { color: color.value })
                  }}
                  className={`w-6 h-6 rounded flex items-center justify-center ${color.bg} ${
                    option.color === color.value ? 'ring-2 ring-primary ring-offset-1' : ''
                  }`}
                  title={color.name}
                >
                  {option.color === color.value && (
                    <span className={`text-xs ${color.text}`}>✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Delete button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              db.deleteSelectOption(db.optionsMenuOpen!.col, option.id)
            }}
            className="flex items-center gap-2 text-xs text-destructive hover:text-destructive/80"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete option</span>
          </button>
        </div>
      )}
    </div>
  )
}

// Add Column Menu
function AddColumnMenu({ db }: { db: ReturnType<typeof useDatabasePage> }) {
  if (!db.addColumnMenuOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 z-[999]"
        onClick={() => db.setAddColumnMenuOpen(null)}
      />
      <div
        className="fixed rounded-lg shadow-lg z-[1000] w-[320px]"
        style={{
          left: db.addColumnMenuOpen.bounds.x,
          top: db.addColumnMenuOpen.bounds.y + db.addColumnMenuOpen.bounds.height,
          backgroundColor: db.isDarkMode ? '#1f2937' : '#ffffff',
          border: `1px solid ${db.isDarkMode ? '#374151' : '#e5e7eb'}`,
        }}
      >
        <div className="p-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-muted/30">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Select type"
              className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground"
              autoFocus
            />
          </div>
        </div>
        <div className="px-2 pb-2 grid grid-cols-2 gap-1">
          {columnTypes.map((type) => {
            const IconComponent = type.icon
            return (
              <div
                key={type.value}
                onClick={() => db.addColumnWithType(type.value)}
                className="px-3 py-2 cursor-pointer flex items-center gap-2.5 text-sm hover:bg-muted rounded-md"
              >
                <IconComponent className="w-4 h-4 text-muted-foreground" />
                <span>{type.label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

// Select Cell Editor
function SelectCellEditor({ db }: { db: ReturnType<typeof useDatabasePage> }) {
  if (!db.selectCellEditor) return null

  const column = db.columns[db.selectCellEditor.col]
  const row = db.rows[db.selectCellEditor.row]
  const selectOptions = column?.options?.options as SelectOption[] | undefined
  const currentValue = row?.properties[column?.id || ''] as string | string[] | undefined
  const currentValues = Array.isArray(currentValue) ? currentValue : (currentValue ? [currentValue] : [])

  return (
    <>
      <div
        className="fixed inset-0 z-[999]"
        onClick={() => db.setSelectCellEditor(null)}
      />
      <div
        className="fixed rounded-lg shadow-lg z-[1000] w-[220px] py-2"
        style={{
          left: db.selectCellEditor.bounds.x,
          top: db.selectCellEditor.bounds.y + db.selectCellEditor.bounds.height,
          backgroundColor: db.isDarkMode ? '#1f2937' : '#ffffff',
          border: `1px solid ${db.isDarkMode ? '#374151' : '#e5e7eb'}`,
        }}
      >
        <div className="px-2 pb-2">
          <span className="text-xs text-muted-foreground px-2">Select an option</span>
        </div>
        <div className="max-h-48 overflow-y-auto">
          {!selectOptions || selectOptions.length === 0 ? (
            <div className="text-xs text-muted-foreground text-center py-4 px-2">
              No options available. Edit the column to add options.
            </div>
          ) : (
            selectOptions.map((option) => {
              const colorInfo = selectOptionColors.find(c => c.value === option.color) || selectOptionColors[0]
              const isSelected = currentValues.includes(option.id) || currentValues.includes(option.name)

              return (
                <div
                  key={option.id}
                  onClick={() => {
                    let newValue: string | string[]
                    if (column?.type === 'multi_select') {
                      if (isSelected) {
                        newValue = currentValues.filter(v => v !== option.id && v !== option.name)
                      } else {
                        newValue = [...currentValues, option.name]
                      }
                    } else {
                      newValue = option.name
                      db.setSelectCellEditor(null)
                    }
                    db.updateSelectCellValue(newValue)
                  }}
                  className="mx-1 px-2 py-1.5 cursor-pointer flex items-center gap-2 hover:bg-muted rounded-md"
                >
                  <span className={`px-2 py-0.5 rounded text-xs ${colorInfo.bg} ${colorInfo.text}`}>
                    {option.name || 'Unnamed'}
                  </span>
                  {isSelected && <span className="ml-auto text-primary">✓</span>}
                </div>
              )
            })
          )}
        </div>

        {column?.type === 'multi_select' && (
          <div className="border-t border-border mt-2 pt-2 px-2">
            <button
              onClick={() => db.setSelectCellEditor(null)}
              className="w-full text-center text-xs text-muted-foreground hover:text-foreground py-1"
            >
              Done
            </button>
          </div>
        )}

        {/* Clear selection */}
        <div
          onClick={() => {
            db.updateSelectCellValue(column?.type === 'multi_select' ? [] : '')
            db.setSelectCellEditor(null)
          }}
          className="mx-1 mt-1 px-2 py-1.5 cursor-pointer flex items-center gap-2 hover:bg-muted rounded-md text-muted-foreground"
        >
          <span className="text-xs">Clear selection</span>
        </div>
      </div>
    </>
  )
}
