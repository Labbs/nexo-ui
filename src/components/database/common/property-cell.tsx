import { useState, useEffect, useCallback } from 'react'
import { Check, X, ExternalLink, Mail, Phone, Calendar, ChevronDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import type { PropertySchema } from '@/hooks/use-databases'

interface PropertyCellProps {
  property: PropertySchema
  value: unknown
  onChange: (value: unknown) => void
  isEditing?: boolean
  onStartEdit?: () => void
  onEndEdit?: () => void
}

// Hook for text input with local state during editing
function useEditableText(
  externalValue: unknown,
  isEditing: boolean,
  onChange: (value: unknown) => void,
  onEndEdit?: () => void
) {
  const [localValue, setLocalValue] = useState<string>('')

  // Sync local value when entering edit mode
  useEffect(() => {
    if (isEditing) {
      setLocalValue((externalValue as string) || '')
    }
  }, [isEditing, externalValue])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value)
  }, [])

  const handleBlur = useCallback(() => {
    // Save the value when leaving edit mode
    onChange(localValue)
    setTimeout(() => onEndEdit?.(), 50)
  }, [localValue, onChange, onEndEdit])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onChange(localValue)
      onEndEdit?.()
    } else if (e.key === 'Escape') {
      // Discard changes on Escape
      onEndEdit?.()
    }
  }, [localValue, onChange, onEndEdit])

  return { localValue, handleChange, handleBlur, handleKeyDown }
}

// Hook for number input with local state during editing
function useEditableNumber(
  externalValue: unknown,
  isEditing: boolean,
  onChange: (value: unknown) => void,
  onEndEdit?: () => void
) {
  const [localValue, setLocalValue] = useState<string>('')

  // Sync local value when entering edit mode
  useEffect(() => {
    if (isEditing) {
      setLocalValue(externalValue !== null && externalValue !== undefined ? String(externalValue) : '')
    }
  }, [isEditing, externalValue])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value)
  }, [])

  const handleBlur = useCallback(() => {
    // Save the value when leaving edit mode
    onChange(localValue ? Number(localValue) : null)
    setTimeout(() => onEndEdit?.(), 50)
  }, [localValue, onChange, onEndEdit])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onChange(localValue ? Number(localValue) : null)
      onEndEdit?.()
    } else if (e.key === 'Escape') {
      onEndEdit?.()
    }
  }, [localValue, onChange, onEndEdit])

  return { localValue, handleChange, handleBlur, handleKeyDown }
}

// Color options for select badges
const selectColors: Record<string, { bg: string; text: string }> = {
  gray: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-300' },
  red: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400' },
  orange: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-400' },
  yellow: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400' },
  green: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400' },
  blue: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400' },
  purple: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-400' },
  pink: { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-700 dark:text-pink-400' },
}

// Text cell component with local state
function TextCell({
  value,
  onChange,
  isEditing,
  onStartEdit,
  onEndEdit,
  isTitle,
}: {
  value: unknown
  onChange: (value: unknown) => void
  isEditing: boolean
  onStartEdit?: () => void
  onEndEdit?: () => void
  isTitle?: boolean
}) {
  const { localValue, handleChange, handleBlur, handleKeyDown } = useEditableText(
    value,
    isEditing,
    onChange,
    onEndEdit
  )

  if (isEditing) {
    return (
      <Input
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cn(
          'h-9 text-sm border-primary ring-1 ring-primary',
          isTitle && 'font-medium'
        )}
        autoFocus
      />
    )
  }

  return (
    <div
      className={cn(
        'min-h-[36px] px-2 py-2 cursor-text flex items-center hover:bg-muted/30',
        isTitle && 'font-medium'
      )}
      onClick={(e) => {
        e.stopPropagation()
        onStartEdit?.()
      }}
    >
      {(value as string) || <span className="text-muted-foreground">Empty</span>}
    </div>
  )
}

// Number cell component with local state
function NumberCell({
  value,
  onChange,
  isEditing,
  onStartEdit,
  onEndEdit,
}: {
  value: unknown
  onChange: (value: unknown) => void
  isEditing: boolean
  onStartEdit?: () => void
  onEndEdit?: () => void
}) {
  const { localValue, handleChange, handleBlur, handleKeyDown } = useEditableNumber(
    value,
    isEditing,
    onChange,
    onEndEdit
  )

  if (isEditing) {
    return (
      <Input
        type="number"
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="h-9 text-sm border-primary ring-1 ring-primary"
        autoFocus
      />
    )
  }

  return (
    <div
      className="min-h-[36px] px-2 py-2 cursor-text flex items-center hover:bg-muted/30"
      onClick={(e) => {
        e.stopPropagation()
        onStartEdit?.()
      }}
    >
      {value !== null && value !== undefined ? (
        String(value)
      ) : (
        <span className="text-muted-foreground">Empty</span>
      )}
    </div>
  )
}

// URL cell component with local state
function UrlCell({
  value,
  onChange,
  isEditing,
  onStartEdit,
  onEndEdit,
}: {
  value: unknown
  onChange: (value: unknown) => void
  isEditing: boolean
  onStartEdit?: () => void
  onEndEdit?: () => void
}) {
  const { localValue, handleChange, handleBlur, handleKeyDown } = useEditableText(
    value,
    isEditing,
    onChange,
    onEndEdit
  )

  if (isEditing) {
    return (
      <Input
        type="url"
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="h-9 text-sm border-primary ring-1 ring-primary"
        placeholder="https://..."
        autoFocus
      />
    )
  }

  return (
    <div
      className="min-h-[36px] px-2 py-2 cursor-text flex items-center gap-1 hover:bg-muted/30"
      onClick={(e) => {
        e.stopPropagation()
        onStartEdit?.()
      }}
    >
      {value ? (
        <>
          <a
            href={value as string}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline truncate"
            onClick={(e) => e.stopPropagation()}
          >
            {value as string}
          </a>
          <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground" />
        </>
      ) : (
        <span className="text-muted-foreground">Empty</span>
      )}
    </div>
  )
}

// Email cell component with local state
function EmailCell({
  value,
  onChange,
  isEditing,
  onStartEdit,
  onEndEdit,
}: {
  value: unknown
  onChange: (value: unknown) => void
  isEditing: boolean
  onStartEdit?: () => void
  onEndEdit?: () => void
}) {
  const { localValue, handleChange, handleBlur, handleKeyDown } = useEditableText(
    value,
    isEditing,
    onChange,
    onEndEdit
  )

  if (isEditing) {
    return (
      <Input
        type="email"
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="h-9 text-sm border-primary ring-1 ring-primary"
        placeholder="email@example.com"
        autoFocus
      />
    )
  }

  return (
    <div
      className="min-h-[36px] px-2 py-2 cursor-text flex items-center gap-1 hover:bg-muted/30"
      onClick={(e) => {
        e.stopPropagation()
        onStartEdit?.()
      }}
    >
      {value ? (
        <>
          <Mail className="h-3 w-3 shrink-0 text-muted-foreground" />
          <a
            href={`mailto:${value}`}
            className="text-blue-600 dark:text-blue-400 hover:underline truncate"
            onClick={(e) => e.stopPropagation()}
          >
            {value as string}
          </a>
        </>
      ) : (
        <span className="text-muted-foreground">Empty</span>
      )}
    </div>
  )
}

// Phone cell component with local state
function PhoneCell({
  value,
  onChange,
  isEditing,
  onStartEdit,
  onEndEdit,
}: {
  value: unknown
  onChange: (value: unknown) => void
  isEditing: boolean
  onStartEdit?: () => void
  onEndEdit?: () => void
}) {
  const { localValue, handleChange, handleBlur, handleKeyDown } = useEditableText(
    value,
    isEditing,
    onChange,
    onEndEdit
  )

  if (isEditing) {
    return (
      <Input
        type="tel"
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="h-9 text-sm border-primary ring-1 ring-primary"
        autoFocus
      />
    )
  }

  return (
    <div
      className="min-h-[36px] px-2 py-2 cursor-text flex items-center gap-1 hover:bg-muted/30"
      onClick={(e) => {
        e.stopPropagation()
        onStartEdit?.()
      }}
    >
      {value ? (
        <>
          <Phone className="h-3 w-3 shrink-0 text-muted-foreground" />
          <a
            href={`tel:${value}`}
            className="hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {value as string}
          </a>
        </>
      ) : (
        <span className="text-muted-foreground">Empty</span>
      )}
    </div>
  )
}

export function PropertyCell({
  property,
  value,
  onChange,
  isEditing = false,
  onStartEdit,
  onEndEdit,
}: PropertyCellProps) {
  switch (property.type) {
    case 'title':
    case 'text':
      return (
        <TextCell
          value={value}
          onChange={onChange}
          isEditing={isEditing}
          onStartEdit={onStartEdit}
          onEndEdit={onEndEdit}
          isTitle={property.type === 'title'}
        />
      )

    case 'number':
      return (
        <NumberCell
          value={value}
          onChange={onChange}
          isEditing={isEditing}
          onStartEdit={onStartEdit}
          onEndEdit={onEndEdit}
        />
      )

    case 'checkbox':
      return (
        <div className="flex items-center justify-center h-8">
          <Checkbox
            checked={!!value}
            onCheckedChange={(checked) => onChange(checked)}
          />
        </div>
      )

    case 'select':
      return <SelectCell property={property} value={value} onChange={onChange} />

    case 'multi_select':
      return <MultiSelectCell property={property} value={value} onChange={onChange} />

    case 'date':
      return <DateCell value={value} onChange={onChange} />

    case 'url':
      return (
        <UrlCell
          value={value}
          onChange={onChange}
          isEditing={isEditing}
          onStartEdit={onStartEdit}
          onEndEdit={onEndEdit}
        />
      )

    case 'email':
      return (
        <EmailCell
          value={value}
          onChange={onChange}
          isEditing={isEditing}
          onStartEdit={onStartEdit}
          onEndEdit={onEndEdit}
        />
      )

    case 'phone':
      return (
        <PhoneCell
          value={value}
          onChange={onChange}
          isEditing={isEditing}
          onStartEdit={onStartEdit}
          onEndEdit={onEndEdit}
        />
      )

    case 'created_time':
    case 'updated_time':
      return (
        <div className="min-h-[32px] px-2 py-1 flex items-center text-muted-foreground text-sm">
          {value ? format(new Date(value as string), 'MMM d, yyyy HH:mm') : '-'}
        </div>
      )

    default:
      return (
        <div className="min-h-[32px] px-2 py-1 flex items-center text-muted-foreground">
          {String(value ?? '')}
        </div>
      )
  }
}

// Select cell component
function SelectCell({
  property,
  value,
  onChange,
}: {
  property: PropertySchema
  value: unknown
  onChange: (value: unknown) => void
}) {
  const [open, setOpen] = useState(false)
  const options = (property.options?.options as Array<{ id: string; name: string; color?: string }>) || []
  const selectedOption = options.find((o) => o.id === value || o.name === value)
  const color = selectColors[selectedOption?.color || 'gray']

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-full justify-start px-2 font-normal"
        >
          {selectedOption ? (
            <Badge className={cn('font-normal', color.bg, color.text)}>
              {selectedOption.name}
            </Badge>
          ) : (
            <span className="text-muted-foreground">Select...</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-1" align="start">
        <div className="space-y-1">
          {options.map((option) => {
            const optColor = selectColors[option.color || 'gray']
            const isSelected = option.id === value || option.name === value
            return (
              <button
                key={option.id}
                className={cn(
                  'w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm hover:bg-accent',
                  isSelected && 'bg-accent'
                )}
                onClick={() => {
                  onChange(option.id)
                  setOpen(false)
                }}
              >
                <Badge className={cn('font-normal', optColor.bg, optColor.text)}>
                  {option.name}
                </Badge>
                {isSelected && <Check className="h-4 w-4 ml-auto" />}
              </button>
            )
          })}
          {value !== null && value !== undefined && (
            <>
              <div className="border-t my-1" />
              <button
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm text-muted-foreground hover:bg-accent"
                onClick={() => {
                  onChange(null)
                  setOpen(false)
                }}
              >
                <X className="h-4 w-4" />
                Clear
              </button>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

// Multi-select cell component
function MultiSelectCell({
  property,
  value,
  onChange,
}: {
  property: PropertySchema
  value: unknown
  onChange: (value: unknown) => void
}) {
  const [open, setOpen] = useState(false)
  const options = (property.options?.options as Array<{ id: string; name: string; color?: string }>) || []
  const selectedIds = Array.isArray(value) ? value : []
  const selectedOptions = options.filter((o) => selectedIds.includes(o.id) || selectedIds.includes(o.name))

  const toggleOption = (optionId: string) => {
    if (selectedIds.includes(optionId)) {
      onChange(selectedIds.filter((id) => id !== optionId))
    } else {
      onChange([...selectedIds, optionId])
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="h-auto min-h-[32px] w-full justify-start px-2 font-normal"
        >
          {selectedOptions.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {selectedOptions.map((option) => {
                const color = selectColors[option.color || 'gray']
                return (
                  <Badge key={option.id} className={cn('font-normal', color.bg, color.text)}>
                    {option.name}
                  </Badge>
                )
              })}
            </div>
          ) : (
            <span className="text-muted-foreground">Select...</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-1" align="start">
        <div className="space-y-1">
          {options.map((option) => {
            const optColor = selectColors[option.color || 'gray']
            const isSelected = selectedIds.includes(option.id) || selectedIds.includes(option.name)
            return (
              <button
                key={option.id}
                className={cn(
                  'w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm hover:bg-accent',
                  isSelected && 'bg-accent'
                )}
                onClick={() => toggleOption(option.id)}
              >
                <Checkbox checked={isSelected} />
                <Badge className={cn('font-normal', optColor.bg, optColor.text)}>
                  {option.name}
                </Badge>
              </button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}

// Date cell component
function DateCell({
  value,
  onChange,
}: {
  value: unknown
  onChange: (value: unknown) => void
}) {
  const [open, setOpen] = useState(false)
  const dateValue = value ? new Date(value as string) : undefined

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-full justify-start px-2 font-normal"
        >
          {dateValue ? (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              {format(dateValue, 'MMM d, yyyy')}
            </div>
          ) : (
            <span className="text-muted-foreground">Pick a date...</span>
          )}
          <ChevronDown className="h-3 w-3 ml-auto text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <CalendarComponent
          mode="single"
          selected={dateValue}
          onSelect={(date) => {
            onChange(date?.toISOString() || null)
            setOpen(false)
          }}
          initialFocus
        />
        {value !== null && value !== undefined && (
          <div className="p-2 border-t">
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => {
                onChange(null)
                setOpen(false)
              }}
            >
              <X className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
