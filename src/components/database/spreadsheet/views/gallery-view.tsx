import { useMemo } from 'react'
import { ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PropertySchema } from '@/hooks/use-database'

interface RowData {
  id: string
  properties: Record<string, unknown>
}

interface GalleryViewProps {
  rows: RowData[]
  columns: PropertySchema[]
  onRowClick?: (rowId: string) => void
  onCreateRow?: () => void
}

export function GalleryView({ rows, columns, onRowClick, onCreateRow }: GalleryViewProps) {
  // Find title column
  const titleColumn = useMemo(() => {
    const titleCol = columns.find(c => c.type === 'title' || c.name?.toLowerCase() === 'title' || c.name?.toLowerCase() === 'name')
    return titleCol || columns[0]
  }, [columns])

  // Find image column
  const imageColumn = useMemo(() => {
    return columns.find(c => c.type === 'image')
  }, [columns])

  // Get display value for a cell
  const getDisplayValue = (row: RowData, column: PropertySchema | undefined): string => {
    if (!column) return ''
    const value = row.properties[column.id || '']
    if (value == null) return ''

    // Handle select/multi_select to show option name instead of ID
    if (column.type === 'select' || column.type === 'multi_select') {
      if (typeof value !== 'string') return String(value)
      const options = column.options?.options as Array<{ id: string; name: string }> | undefined
      if (options) {
        const option = options.find(opt => opt.id === value || opt.name === value)
        if (option) return option.name
      }
      return value
    }

    return String(value)
  }

  // Get secondary columns (excluding title and image)
  const secondaryColumns = useMemo(() => {
    return columns
      .filter(c => c.id !== titleColumn?.id && c.id !== imageColumn?.id)
      .slice(0, 2)
  }, [columns, titleColumn, imageColumn])

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {rows.map((row) => {
          const titleValue = getDisplayValue(row, titleColumn)
          const imageUrl = imageColumn ? getDisplayValue(row, imageColumn) : ''

          return (
            <div
              key={row.id}
              onClick={() => onRowClick?.(row.id)}
              className={cn(
                "group flex flex-col rounded-lg border border-border overflow-hidden",
                "hover:border-primary/50 hover:shadow-md cursor-pointer transition-all"
              )}
            >
              {/* Image area */}
              <div className="aspect-[4/3] bg-muted/30 relative overflow-hidden">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={titleValue || 'Gallery item'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-muted-foreground/30" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-3 flex-1">
                <div className="font-medium text-sm truncate">
                  {titleValue || 'Untitled'}
                </div>
                {/* Secondary info */}
                {secondaryColumns.map(col => {
                  const value = getDisplayValue(row, col)
                  if (!value) return null
                  return (
                    <div key={col.id} className="text-xs text-muted-foreground mt-1 truncate">
                      {value}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}

        {/* Add new card */}
        <button
          onClick={onCreateRow}
          className={cn(
            "flex flex-col items-center justify-center rounded-lg border border-dashed border-border",
            "hover:border-primary/50 hover:bg-muted/30 cursor-pointer transition-all min-h-[180px]"
          )}
        >
          <span className="text-2xl text-muted-foreground mb-1">+</span>
          <span className="text-sm text-muted-foreground">New</span>
        </button>
      </div>
    </div>
  )
}
