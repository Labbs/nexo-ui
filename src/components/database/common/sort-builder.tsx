import { Plus, X, ArrowUp, ArrowDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { SortConfig, PropertySchema } from '@/hooks/use-database'

interface SortBuilderProps {
  columns: PropertySchema[]
  sort: SortConfig[]
  onChange: (sort: SortConfig[]) => void
}

export function SortBuilder({ columns, sort, onChange }: SortBuilderProps) {
  const addSort = () => {
    // Find first column not already in sort
    const usedProperties = new Set(sort.map((s) => s.property_id))
    const availableColumn = columns.find((col) => col.id && !usedProperties.has(col.id))

    if (!availableColumn || !availableColumn.id) return

    onChange([
      ...sort,
      {
        property_id: availableColumn.id,
        direction: 'asc',
      },
    ])
  }

  const updateSort = (index: number, updates: Partial<SortConfig>) => {
    const newSort = [...sort]
    newSort[index] = { ...newSort[index], ...updates }
    onChange(newSort)
  }

  const removeSort = (index: number) => {
    onChange(sort.filter((_, i) => i !== index))
  }

  const toggleDirection = (index: number) => {
    const current = sort[index]
    updateSort(index, {
      direction: current.direction === 'asc' ? 'desc' : 'asc',
    })
  }

  const getColumnName = (propertyId: string): string => {
    const col = columns.find((c) => c.id === propertyId)
    return col?.name || propertyId
  }

  // Check if we can add more sorts
  const canAddSort = sort.length < columns.length

  if (sort.length === 0) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">No sorting applied</p>
        <Button variant="outline" size="sm" onClick={addSort} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add sort
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {sort.map((sortItem, index) => (
        <div key={index} className="flex items-center gap-2">
          {/* Property select */}
          <Select
            value={sortItem.property_id}
            onValueChange={(value) => updateSort(index, { property_id: value })}
          >
            <SelectTrigger className="flex-1 h-8">
              <SelectValue>{getColumnName(sortItem.property_id)}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {columns.filter(col => col.id).map((col) => (
                <SelectItem
                  key={col.id}
                  value={col.id!}
                  disabled={
                    col.id !== sortItem.property_id &&
                    sort.some((s) => s.property_id === col.id)
                  }
                >
                  {col.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Direction toggle */}
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-24"
            onClick={() => toggleDirection(index)}
          >
            {sortItem.direction === 'asc' ? (
              <>
                <ArrowUp className="h-4 w-4 mr-1" />
                Asc
              </>
            ) : (
              <>
                <ArrowDown className="h-4 w-4 mr-1" />
                Desc
              </>
            )}
          </Button>

          {/* Remove button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 flex-shrink-0"
            onClick={() => removeSort(index)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}

      {canAddSort && (
        <Button variant="ghost" size="sm" onClick={addSort} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add sort
        </Button>
      )}
    </div>
  )
}
