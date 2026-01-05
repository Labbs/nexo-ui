import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { FilterConfig, FilterRule, PropertySchema } from '@/hooks/use-database'

interface FilterBuilderProps {
  columns: PropertySchema[]
  filter: FilterConfig | undefined
  onChange: (filter: FilterConfig | undefined) => void
}

const CONDITIONS = [
  { value: 'eq', label: 'equals' },
  { value: 'neq', label: 'not equals' },
  { value: 'contains', label: 'contains' },
  { value: 'not_contains', label: 'does not contain' },
  { value: 'starts_with', label: 'starts with' },
  { value: 'ends_with', label: 'ends with' },
  { value: 'gt', label: 'greater than' },
  { value: 'lt', label: 'less than' },
  { value: 'gte', label: 'greater or equal' },
  { value: 'lte', label: 'less or equal' },
  { value: 'is_empty', label: 'is empty' },
  { value: 'is_not_empty', label: 'is not empty' },
]

// Conditions that don't need a value input
const NO_VALUE_CONDITIONS = ['is_empty', 'is_not_empty']

export function FilterBuilder({ columns, filter, onChange }: FilterBuilderProps) {
  const rules = filter?.and || []

  const addRule = () => {
    const firstColumn = columns[0]
    if (!firstColumn || !firstColumn.id) return

    const newRule: FilterRule = {
      property: firstColumn.id,
      condition: 'contains',
      value: '',
    }

    onChange({
      ...filter,
      and: [...rules, newRule],
    })
  }

  const updateRule = (index: number, updates: Partial<FilterRule>) => {
    const newRules = [...rules]
    newRules[index] = { ...newRules[index], ...updates }
    onChange({
      ...filter,
      and: newRules,
    })
  }

  const removeRule = (index: number) => {
    const newRules = rules.filter((_, i) => i !== index)
    if (newRules.length === 0) {
      onChange(undefined)
    } else {
      onChange({
        ...filter,
        and: newRules,
      })
    }
  }

  const getColumnName = (propertyId: string): string => {
    const col = columns.find((c) => c.id === propertyId)
    return col?.name || propertyId
  }

  if (rules.length === 0) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">No filters applied</p>
        <Button variant="outline" size="sm" onClick={addRule} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add filter
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {rules.map((rule, index) => (
        <div key={index} className="space-y-2 p-2 rounded-md border bg-background">
          {/* Top row: Property + Condition + Remove button */}
          <div className="flex items-center gap-2">
            {/* Property select */}
            <Select
              value={rule.property}
              onValueChange={(value) => updateRule(index, { property: value })}
            >
              <SelectTrigger className="flex-1 h-8 bg-background">
                <SelectValue>{getColumnName(rule.property)}</SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {columns.filter(col => col.id).map((col) => (
                  <SelectItem key={col.id} value={col.id!}>
                    {col.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Condition select */}
            <Select
              value={rule.condition}
              onValueChange={(value) => updateRule(index, { condition: value })}
            >
              <SelectTrigger className="flex-1 h-8 bg-background">
                <SelectValue>
                  {CONDITIONS.find((c) => c.value === rule.condition)?.label || rule.condition}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {CONDITIONS.map((cond) => (
                  <SelectItem key={cond.value} value={cond.value}>
                    {cond.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Remove button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 flex-shrink-0"
              onClick={() => removeRule(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Bottom row: Value input (hidden for is_empty/is_not_empty) */}
          {!NO_VALUE_CONDITIONS.includes(rule.condition) && (
            <Input
              value={String(rule.value || '')}
              onChange={(e) => updateRule(index, { value: e.target.value })}
              placeholder="Enter value..."
              className="w-full h-9"
            />
          )}
        </div>
      ))}

      <Button variant="ghost" size="sm" onClick={addRule} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add filter
      </Button>
    </div>
  )
}
