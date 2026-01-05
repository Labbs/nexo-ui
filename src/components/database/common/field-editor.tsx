import { useState, useRef, useEffect } from 'react'
import { Check, ChevronDown, Calendar as CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import type { PropertySchema } from '@/hooks/use-database'

interface FieldEditorProps {
  property: PropertySchema
  value: unknown
  onChange: (value: unknown) => void
  className?: string
}

interface SelectOption {
  id: string
  name: string
  color?: string
}

// Select option colors
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

export function FieldEditor({ property, value, onChange, className }: FieldEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [localValue, setLocalValue] = useState<string>('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleSave = () => {
    setIsEditing(false)
    if (property.type === 'number' || property.type === 'currency') {
      const num = parseFloat(localValue)
      onChange(isNaN(num) ? null : num)
    } else {
      onChange(localValue)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    }
    if (e.key === 'Escape') {
      setIsEditing(false)
    }
  }

  const propertyType = property.type || 'text'
  const propertyName = property.name || 'value'

  // Text/Title/Email/URL/Phone editors
  if (['text', 'title', 'email', 'url', 'phone'].includes(propertyType)) {
    if (isEditing) {
      return (
        <Input
          ref={inputRef}
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className={cn("h-8", className)}
          placeholder={`Enter ${propertyName.toLowerCase()}...`}
        />
      )
    }

    return (
      <div
        onClick={() => {
          setLocalValue((value as string) || '')
          setIsEditing(true)
        }}
        className={cn(
          "h-8 px-3 flex items-center rounded-md cursor-pointer hover:bg-muted/50 text-sm",
          !value && "text-muted-foreground",
          className
        )}
      >
        {(value as string) || `Add ${propertyName.toLowerCase()}...`}
      </div>
    )
  }

  // Number/Currency editor
  if (propertyType === 'number' || propertyType === 'currency') {
    if (isEditing) {
      return (
        <Input
          ref={inputRef}
          type="number"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className={cn("h-8", className)}
          placeholder="0"
        />
      )
    }

    const displayValue = propertyType === 'currency' && value != null
      ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value as number)
      : value != null
        ? String(value)
        : null

    return (
      <div
        onClick={() => {
          setLocalValue(value != null ? String(value) : '')
          setIsEditing(true)
        }}
        className={cn(
          "h-8 px-3 flex items-center rounded-md cursor-pointer hover:bg-muted/50 text-sm",
          !displayValue && "text-muted-foreground",
          className
        )}
      >
        {displayValue || 'Empty'}
      </div>
    )
  }

  // Checkbox editor
  if (propertyType === 'checkbox') {
    return (
      <div className={cn("h-8 px-3 flex items-center", className)}>
        <Checkbox
          checked={!!value}
          onCheckedChange={(checked) => onChange(checked)}
        />
      </div>
    )
  }

  // Date editor
  if (propertyType === 'date') {
    const dateValue = value ? new Date(value as string) : undefined

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "h-8 justify-start text-left font-normal px-3",
              !dateValue && "text-muted-foreground",
              className
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateValue ? format(dateValue, "PPP") : "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={dateValue}
            onSelect={(date) => onChange(date?.toISOString())}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    )
  }

  // Select editor
  if (propertyType === 'select') {
    const options = (property.options?.options as SelectOption[]) || []
    const selectedOption = options.find(opt => opt.id === value || opt.name === value)
    const colorInfo = selectedOption?.color
      ? selectOptionColors[selectedOption.color] || selectOptionColors.default
      : selectOptionColors.default

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "h-8 justify-between px-3",
              !selectedOption && "text-muted-foreground",
              className
            )}
          >
            {selectedOption ? (
              <span className={cn("px-2 py-0.5 rounded text-xs", colorInfo.bg, colorInfo.text)}>
                {selectedOption.name}
              </span>
            ) : (
              "Select..."
            )}
            <ChevronDown className="h-4 w-4 ml-2 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-1" align="start">
          {options.map((option) => {
            const optColorInfo = option.color
              ? selectOptionColors[option.color] || selectOptionColors.default
              : selectOptionColors.default
            const isSelected = option.id === value || option.name === value

            return (
              <div
                key={option.id}
                onClick={() => onChange(option.name)}
                className="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer hover:bg-muted"
              >
                <span className={cn("px-2 py-0.5 rounded text-xs", optColorInfo.bg, optColorInfo.text)}>
                  {option.name}
                </span>
                {isSelected && <Check className="h-4 w-4 ml-auto" />}
              </div>
            )
          })}
          <div
            onClick={() => onChange('')}
            className="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer hover:bg-muted text-muted-foreground text-sm"
          >
            Clear
          </div>
        </PopoverContent>
      </Popover>
    )
  }

  // Multi-select editor
  if (propertyType === 'multi_select') {
    const options = (property.options?.options as SelectOption[]) || []
    const selectedValues = Array.isArray(value) ? value : (value ? [value] : [])
    const selectedOptions = options.filter(opt =>
      selectedValues.includes(opt.id) || selectedValues.includes(opt.name)
    )

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "h-auto min-h-8 justify-start px-3 py-1 flex-wrap gap-1",
              selectedOptions.length === 0 && "text-muted-foreground",
              className
            )}
          >
            {selectedOptions.length > 0 ? (
              selectedOptions.map((opt) => {
                const optColorInfo = opt.color
                  ? selectOptionColors[opt.color] || selectOptionColors.default
                  : selectOptionColors.default
                return (
                  <span key={opt.id} className={cn("px-2 py-0.5 rounded text-xs", optColorInfo.bg, optColorInfo.text)}>
                    {opt.name}
                  </span>
                )
              })
            ) : (
              "Select..."
            )}
            <ChevronDown className="h-4 w-4 ml-auto opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-1" align="start">
          {options.map((option) => {
            const optColorInfo = option.color
              ? selectOptionColors[option.color] || selectOptionColors.default
              : selectOptionColors.default
            const isSelected = selectedValues.includes(option.id) || selectedValues.includes(option.name)

            return (
              <div
                key={option.id}
                onClick={() => {
                  if (isSelected) {
                    onChange(selectedValues.filter(v => v !== option.id && v !== option.name))
                  } else {
                    onChange([...selectedValues, option.name])
                  }
                }}
                className="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer hover:bg-muted"
              >
                <span className={cn("px-2 py-0.5 rounded text-xs", optColorInfo.bg, optColorInfo.text)}>
                  {option.name}
                </span>
                {isSelected && <Check className="h-4 w-4 ml-auto" />}
              </div>
            )
          })}
          {selectedValues.length > 0 && (
            <div
              onClick={() => onChange([])}
              className="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer hover:bg-muted text-muted-foreground text-sm border-t mt-1 pt-1"
            >
              Clear all
            </div>
          )}
        </PopoverContent>
      </Popover>
    )
  }

  // Fallback for unknown types
  return (
    <div className={cn("h-8 px-3 flex items-center text-sm text-muted-foreground", className)}>
      {String(value || '')}
    </div>
  )
}
