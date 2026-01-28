import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, MoreHorizontal, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import type { PropertySchema } from '@/hooks/use-database'
import { selectOptionColors, type SelectOption } from '@/lib/database'
import { DocumentIcon, type IconValue } from '@/components/ui/icon-picker'

interface RowData {
  id: string
  properties: Record<string, unknown>
  content?: { icon?: IconValue; blocks?: unknown }
}

interface DocumentListViewProps {
  schema: PropertySchema[]
  rows: RowData[]
  onUpdateRow: (rowId: string, properties: Record<string, unknown>) => void
  onDeleteRow: (rowId: string) => void
  onAddRow: () => void
  onOpenDocument: (rowId: string) => void
  isLoading?: boolean
}

export function DocumentListView({
  schema,
  rows,
  onUpdateRow,
  onDeleteRow,
  onAddRow,
  onOpenDocument,
  isLoading,
}: DocumentListViewProps) {
  const { t } = useTranslation('database')

  // Get title column for displaying item titles
  const titleColumn = useMemo(() => {
    return schema.find(col => col.type === 'title') || schema[0]
  }, [schema])

  // Get checkbox column if exists (for todo-style lists)
  const checkboxColumn = useMemo(() => {
    return schema.find(col => col.type === 'checkbox')
  }, [schema])

  // Get preview properties (exclude title and checkbox)
  const previewProperties = useMemo(() => {
    return schema
      .filter(col => col.id !== titleColumn?.id && col.id !== checkboxColumn?.id)
      .slice(0, 3)
  }, [schema, titleColumn, checkboxColumn])

  const handleToggleCheckbox = (rowId: string, currentValue: unknown) => {
    if (!checkboxColumn?.id) return
    onUpdateRow(rowId, {
      [checkboxColumn.id]: !currentValue,
    })
  }

  return (
    <div className="flex flex-col h-full px-4">
      {/* List items */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-1">
          {rows.map(row => {
            const title = titleColumn?.id ? (row.properties[titleColumn.id] as string) || t('common:untitled') : t('common:untitled')
            const isChecked = checkboxColumn?.id ? !!row.properties[checkboxColumn.id] : false

            return (
              <div
                key={row.id}
                className={cn(
                  'group flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors',
                  isChecked && 'opacity-60'
                )}
                onClick={() => onOpenDocument(row.id)}
              >
                {/* Checkbox if available */}
                {checkboxColumn && (
                  <div onClick={e => e.stopPropagation()}>
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => handleToggleCheckbox(row.id, isChecked)}
                    />
                  </div>
                )}

                {/* Icon */}
                <DocumentIcon value={row.content?.icon} size="sm" />

                {/* Title */}
                <span className={cn(
                  'text-sm font-medium flex-1 truncate',
                  isChecked && 'line-through text-muted-foreground'
                )}>
                  {title}
                </span>

                {/* Preview properties */}
                <div className="hidden sm:flex items-center gap-2">
                  {previewProperties.map(prop => {
                    if (!prop.id) return null
                    const value = row.properties[prop.id]
                    if (!value) return null

                    return (
                      <PropertyBadge key={prop.id} property={prop} value={value} />
                    )
                  })}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" onClick={e => e.stopPropagation()}>
                      <DropdownMenuItem onClick={() => onOpenDocument(row.id)}>
                        {t('list.open')}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => onDeleteRow(row.id)}
                      >
                        {t('list.delete')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Add new item button */}
      <div className="pt-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onAddRow}
          className="text-muted-foreground"
          disabled={isLoading}
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('list.new')}
        </Button>
      </div>
    </div>
  )
}

interface PropertyBadgeProps {
  property: PropertySchema
  value: unknown
}

function getPropertyOptions(property: PropertySchema): SelectOption[] {
  if (!property.options) return []
  const opts = (property.options as { options?: SelectOption[] })?.options
  if (Array.isArray(opts)) return opts
  if (Array.isArray(property.options)) return property.options as SelectOption[]
  return []
}

function PropertyBadge({ property, value }: PropertyBadgeProps) {
  switch (property.type) {
    case 'select':
    case 'status': {
      const options = getPropertyOptions(property)
      const option = options.find(o => o.id === value || o.name === value)
      if (!option) return null
      const colorConfig = selectOptionColors.find(c => c.value === option.color)
      return (
        <Badge
          variant="secondary"
          className={cn('text-xs', colorConfig?.bg, colorConfig?.text)}
        >
          {option.name}
        </Badge>
      )
    }

    case 'multi_select': {
      if (!Array.isArray(value) || value.length === 0) return null
      const options = getPropertyOptions(property)
      const firstOption = options.find(o => o.id === value[0] || o.name === value[0])
      if (!firstOption) return null
      const colorConfig = selectOptionColors.find(c => c.value === firstOption.color)
      return (
        <div className="flex items-center gap-1">
          <Badge
            variant="secondary"
            className={cn('text-xs', colorConfig?.bg, colorConfig?.text)}
          >
            {firstOption.name}
          </Badge>
          {value.length > 1 && (
            <span className="text-xs text-muted-foreground">+{value.length - 1}</span>
          )}
        </div>
      )
    }

    case 'date': {
      if (typeof value !== 'string') return null
      try {
        return (
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {new Date(value).toLocaleDateString()}
          </span>
        )
      } catch {
        return null
      }
    }

    case 'checkbox':
      return (
        <span className={cn('text-xs', value ? 'text-green-600' : 'text-muted-foreground')}>
          {value ? '✓' : ''}
        </span>
      )

    case 'number':
      return (
        <span className="text-xs text-muted-foreground">
          {typeof value === 'number' ? value.toLocaleString() : String(value)}
        </span>
      )

    default:
      return null
  }
}
