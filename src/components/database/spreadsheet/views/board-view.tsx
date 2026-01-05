import { useMemo, useState } from 'react'
import { Plus, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PropertySchema } from '@/hooks/use-database'

interface RowData {
  id: string
  properties: Record<string, unknown>
}

interface BoardViewProps {
  rows: RowData[]
  columns: PropertySchema[]
  groupByColumnId?: string
  onRowClick?: (rowId: string) => void
  onCreateRow?: (properties?: Record<string, unknown>) => void
  onUpdateRow?: (rowId: string, properties: Record<string, unknown>) => void
}

interface SelectOption {
  id: string
  name: string
  color?: string
}

// Select option colors (matching Notion's color palette - vibrant pastels)
const selectOptionColors: Record<string, { bg: string; text: string }> = {
  default: { bg: 'bg-slate-100 dark:bg-slate-600', text: 'text-slate-700 dark:text-slate-100' },
  gray: { bg: 'bg-gray-200 dark:bg-gray-500', text: 'text-gray-700 dark:text-gray-100' },
  brown: { bg: 'bg-amber-200 dark:bg-amber-700', text: 'text-amber-900 dark:text-amber-100' },
  orange: { bg: 'bg-orange-200 dark:bg-orange-600', text: 'text-orange-800 dark:text-orange-100' },
  yellow: { bg: 'bg-yellow-200 dark:bg-yellow-600', text: 'text-yellow-800 dark:text-yellow-100' },
  green: { bg: 'bg-emerald-200 dark:bg-emerald-600', text: 'text-emerald-800 dark:text-emerald-100' },
  blue: { bg: 'bg-sky-200 dark:bg-sky-600', text: 'text-sky-800 dark:text-sky-100' },
  purple: { bg: 'bg-violet-200 dark:bg-violet-600', text: 'text-violet-800 dark:text-violet-100' },
  pink: { bg: 'bg-pink-200 dark:bg-pink-600', text: 'text-pink-800 dark:text-pink-100' },
  red: { bg: 'bg-rose-200 dark:bg-rose-600', text: 'text-rose-800 dark:text-rose-100' },
}

// Default fallback colors (index-based) using the same palette
const defaultColorOrder = ['default', 'gray', 'brown', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'red']

export function BoardView({
  rows,
  columns,
  groupByColumnId,
  onRowClick,
  onCreateRow,
  onUpdateRow,
}: BoardViewProps) {
  const [draggedCard, setDraggedCard] = useState<string | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)

  // Find title column
  const titleColumn = useMemo(() => {
    const titleCol = columns.find(c => c.type === 'title' || c.name?.toLowerCase() === 'title' || c.name?.toLowerCase() === 'name')
    return titleCol || columns[0]
  }, [columns])

  // Find the select column to group by (status, select, or multi_select type)
  const groupByColumn = useMemo(() => {
    if (groupByColumnId) {
      return columns.find(c => c.id === groupByColumnId)
    }
    // Default to first select/status column
    return columns.find(c => c.type === 'select' || c.type === 'multi_select' || c.name?.toLowerCase() === 'status')
  }, [columns, groupByColumnId])

  // Get options from the groupBy column
  const groupOptions = useMemo((): SelectOption[] => {
    if (!groupByColumn) return [{ id: '_ungrouped', name: 'No Status' }]

    const options = groupByColumn.options?.options as SelectOption[] | undefined
    if (options && Array.isArray(options) && options.length > 0) {
      return [{ id: '_ungrouped', name: 'No Status' }, ...options]
    }

    // If no options defined, derive from existing row values
    const values = new Set<string>()
    rows.forEach(row => {
      const value = row.properties[groupByColumn.id || '']
      if (value && typeof value === 'string') {
        values.add(value)
      }
    })

    const derivedOptions: SelectOption[] = [{ id: '_ungrouped', name: 'No Status' }]
    values.forEach(v => derivedOptions.push({ id: v, name: v }))
    return derivedOptions
  }, [groupByColumn, rows])

  // Group rows by the selected column value
  const groupedRows = useMemo(() => {
    const groups: Record<string, RowData[]> = {}

    // Initialize all groups
    groupOptions.forEach(opt => {
      groups[opt.id] = []
    })

    rows.forEach(row => {
      const value = groupByColumn ? row.properties[groupByColumn.id || ''] : null

      // Find the matching option by id or name (value can be either)
      let groupId = '_ungrouped'
      if (value && typeof value === 'string') {
        const matchingOption = groupOptions.find(opt => opt.id === value || opt.name === value)
        groupId = matchingOption?.id || value
      }

      if (!groups[groupId]) {
        groups[groupId] = []
      }
      groups[groupId].push(row)
    })

    return groups
  }, [rows, groupByColumn, groupOptions])

  // Filter out "No Status" column if it's empty and we have a groupBy column
  const visibleGroupOptions = useMemo(() => {
    if (!groupByColumn) return groupOptions

    const ungroupedRows = groupedRows['_ungrouped'] || []
    if (ungroupedRows.length === 0) {
      return groupOptions.filter(opt => opt.id !== '_ungrouped')
    }
    return groupOptions
  }, [groupOptions, groupedRows, groupByColumn])

  // Get display value
  const getDisplayValue = (row: RowData, column: PropertySchema | undefined): string => {
    if (!column) return ''
    const value = row.properties[column.id || '']
    if (value == null) return ''
    return String(value)
  }

  // Get preview columns (excluding title and groupBy)
  const previewColumns = useMemo(() => {
    return columns
      .filter(c => c.id !== titleColumn?.id && c.id !== groupByColumn?.id)
      .slice(0, 2)
  }, [columns, titleColumn, groupByColumn])

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, rowId: string) => {
    setDraggedCard(rowId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    setDragOverColumn(columnId)
  }

  const handleDragLeave = () => {
    setDragOverColumn(null)
  }

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    setDragOverColumn(null)

    if (draggedCard && groupByColumn && onUpdateRow) {
      const newValue = columnId === '_ungrouped' ? '' : columnId
      onUpdateRow(draggedCard, { [groupByColumn.id || '']: newValue })
    }
    setDraggedCard(null)
  }

  const handleDragEnd = () => {
    setDraggedCard(null)
    setDragOverColumn(null)
  }

  return (
    <div className="flex gap-4 p-4 overflow-x-auto min-h-[500px]">
      {visibleGroupOptions.map((option, optionIndex) => {
        const columnRows = groupedRows[option.id] || []
        // Use option's color if available, otherwise fall back to index-based color
        const originalIndex = groupOptions.findIndex(o => o.id === option.id)
        const fallbackColorKey = defaultColorOrder[(originalIndex >= 0 ? originalIndex : optionIndex) % defaultColorOrder.length]
        const colorInfo = option.color ? (selectOptionColors[option.color] || selectOptionColors.default) : selectOptionColors[fallbackColorKey]
        const colorClass = `${colorInfo.bg} ${colorInfo.text}`

        return (
          <div
            key={option.id}
            className={cn(
              "flex flex-col w-72 flex-shrink-0 rounded-lg",
              dragOverColumn === option.id && "ring-2 ring-primary"
            )}
            onDragOver={(e) => handleDragOver(e, option.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, option.id)}
          >
            {/* Column header */}
            <div className="flex items-center gap-2 px-2 py-2 mb-2">
              <span className={cn("px-2 py-0.5 rounded text-xs font-medium", colorClass)}>
                {option.name}
              </span>
              <span className="text-xs text-muted-foreground">{columnRows.length}</span>
              <div className="flex-1" />
              <button className="p-1 hover:bg-muted rounded opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Cards */}
            <div className="flex-1 flex flex-col gap-2 min-h-[100px]">
              {columnRows.map(row => {
                const titleValue = getDisplayValue(row, titleColumn)

                return (
                  <div
                    key={row.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, row.id)}
                    onDragEnd={handleDragEnd}
                    onClick={() => onRowClick?.(row.id)}
                    className={cn(
                      "bg-card border border-border rounded-lg p-3 cursor-pointer",
                      "hover:border-primary/50 hover:shadow-sm transition-all",
                      draggedCard === row.id && "opacity-50"
                    )}
                  >
                    <div className="font-medium text-sm">
                      {titleValue || 'Untitled'}
                    </div>
                    {/* Preview properties */}
                    {previewColumns.map(col => {
                      const value = getDisplayValue(row, col)
                      if (!value) return null
                      return (
                        <div key={col.id} className="text-xs text-muted-foreground mt-1 truncate">
                          {col.name}: {value}
                        </div>
                      )
                    })}
                  </div>
                )
              })}

              {/* Add card button */}
              <button
                onClick={() => {
                  if (groupByColumn && option.id !== '_ungrouped') {
                    onCreateRow?.({ [groupByColumn.id || '']: option.id })
                  } else {
                    onCreateRow?.()
                  }
                }}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm",
                  "text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
                )}
              >
                <Plus className="w-4 h-4" />
                <span>New</span>
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
