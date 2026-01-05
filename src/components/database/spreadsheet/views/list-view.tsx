import { useMemo } from 'react'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PropertySchema } from '@/hooks/use-database'

interface RowData {
  id: string
  properties: Record<string, unknown>
}

interface ListViewProps {
  rows: RowData[]
  columns: PropertySchema[]
  onRowClick?: (rowId: string) => void
  onCreateRow?: () => void
}

export function ListView({ rows, columns, onRowClick, onCreateRow }: ListViewProps) {
  // Find title column (first column or one named "title"/"name")
  const titleColumn = useMemo(() => {
    const titleCol = columns.find(c => c.type === 'title' || c.name?.toLowerCase() === 'title' || c.name?.toLowerCase() === 'name')
    return titleCol || columns[0]
  }, [columns])

  // Get display value for a cell
  const getDisplayValue = (row: RowData, column: PropertySchema): string => {
    const value = row.properties[column.id || '']
    if (value == null) return ''

    switch (column.type) {
      case 'checkbox':
        return value ? '✓' : ''
      case 'date':
        if (typeof value === 'string') {
          try {
            return new Date(value).toLocaleDateString()
          } catch {
            return String(value)
          }
        }
        return ''
      case 'number':
      case 'currency':
        return typeof value === 'number' ? value.toLocaleString() : String(value)
      case 'select':
      case 'multi_select': {
        if (typeof value !== 'string') return String(value)
        // Look up option name by ID or return value if it's already a name
        const options = column.options?.options as Array<{ id: string; name: string }> | undefined
        if (options) {
          const option = options.find(opt => opt.id === value || opt.name === value)
          if (option) return option.name
        }
        return value
      }
      default:
        return String(value)
    }
  }

  // Get secondary info (other visible columns)
  const getSecondaryColumns = useMemo(() => {
    return columns.filter(c => c.id !== titleColumn?.id).slice(0, 3)
  }, [columns, titleColumn])

  return (
    <div className="flex flex-col">
      {rows.map((row) => {
        const titleValue = titleColumn ? getDisplayValue(row, titleColumn) : ''

        return (
          <div
            key={row.id}
            onClick={() => onRowClick?.(row.id)}
            className={cn(
              "group flex items-center gap-3 px-4 py-2.5 border-b border-border/50",
              "hover:bg-muted/50 cursor-pointer transition-colors"
            )}
          >
            {/* Title */}
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate">
                {titleValue || 'Untitled'}
              </div>
              {/* Secondary info */}
              {getSecondaryColumns.length > 0 && (
                <div className="flex items-center gap-3 mt-0.5">
                  {getSecondaryColumns.map(col => {
                    const value = getDisplayValue(row, col)
                    if (!value) return null
                    return (
                      <span key={col.id} className="text-xs text-muted-foreground truncate max-w-32">
                        {value}
                      </span>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Arrow indicator */}
            <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )
      })}

      {/* Add new row */}
      <button
        onClick={onCreateRow}
        className="flex items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors text-left"
      >
        <span className="text-lg leading-none">+</span>
        <span>New</span>
      </button>
    </div>
  )
}
