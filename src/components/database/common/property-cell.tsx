import { useState, useEffect, useCallback, memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Check, X, ExternalLink, Mail, Phone, Calendar, ChevronDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import type { PropertySchema } from '@/hooks/use-database'
import { useUsers } from '@/hooks/use-users'
import {
  formatNumber,
  formatDate as formatDateValue,
  selectOptionColors,
  evaluateConditionalStyle,
  type NumberFormatOptions,
  type DateFormatOptions,
} from '@/lib/database'
import type { ConditionalRule } from '@/lib/database/conditionalStyles'

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
// Helper to get color classes from selectOptionColors
function getOptionColor(colorValue?: string): { bg: string; text: string } {
  const colorInfo = selectOptionColors.find(c => c.value === colorValue)
  if (colorInfo) {
    return { bg: colorInfo.bg, text: colorInfo.text }
  }
  // Fallback to default
  const defaultColor = selectOptionColors[0]
  return { bg: defaultColor.bg, text: defaultColor.text }
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
  const { t } = useTranslation('database')
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
      {(value as string) || <span className="text-muted-foreground">{t('cells.empty')}</span>}
    </div>
  )
}

// Number cell component with local state and formatting
function NumberCell({
  value,
  onChange,
  isEditing,
  onStartEdit,
  onEndEdit,
  formatOptions,
  conditionalStyle,
}: {
  value: unknown
  onChange: (value: unknown) => void
  isEditing: boolean
  onStartEdit?: () => void
  onEndEdit?: () => void
  formatOptions?: NumberFormatOptions
  conditionalStyle?: { bgColor?: string; textColor?: string } | null
}) {
  const { t } = useTranslation('database')
  const { localValue, handleChange, handleBlur, handleKeyDown } = useEditableNumber(
    value,
    isEditing,
    onChange,
    onEndEdit
  )

  // Get conditional style classes
  const bgColorInfo = conditionalStyle?.bgColor ? selectOptionColors.find(c => c.value === conditionalStyle.bgColor) : null
  const textColorInfo = conditionalStyle?.textColor ? selectOptionColors.find(c => c.value === conditionalStyle.textColor) : null

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

  // Format the display value
  const displayValue = value !== null && value !== undefined
    ? formatNumber(Number(value), formatOptions)
    : null

  return (
    <div
      className={cn(
        "min-h-[36px] px-2 py-2 cursor-text flex items-center hover:bg-muted/30",
        bgColorInfo?.bg,
        textColorInfo?.text
      )}
      onClick={(e) => {
        e.stopPropagation()
        onStartEdit?.()
      }}
    >
      {displayValue !== null ? (
        displayValue
      ) : (
        <span className="text-muted-foreground">{t('cells.empty')}</span>
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
  const { t } = useTranslation('database')
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
        placeholder={t('cells.urlPlaceholder')}
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
        <span className="text-muted-foreground">{t('cells.empty')}</span>
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
  const { t } = useTranslation('database')
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
        placeholder={t('cells.emailPlaceholder')}
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
        <span className="text-muted-foreground">{t('cells.empty')}</span>
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
  const { t } = useTranslation('database')
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
        <span className="text-muted-foreground">{t('cells.empty')}</span>
      )}
    </div>
  )
}

export const PropertyCell = memo(function PropertyCell({
  property,
  value,
  onChange,
  isEditing = false,
  onStartEdit,
  onEndEdit,
}: PropertyCellProps) {
  const { t } = useTranslation('database')
  // Evaluate conditional formatting rules
  const conditionalRules = property.options?.conditionalRules as ConditionalRule[] | undefined
  const conditionalStyle = evaluateConditionalStyle(value, conditionalRules)

  // Get format options from property
  const numberFormatOptions = property.options?.numberFormat as NumberFormatOptions | undefined
  const dateFormatOptions = property.options?.dateFormat as DateFormatOptions | undefined

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
          formatOptions={numberFormatOptions}
          conditionalStyle={conditionalStyle}
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
    case 'status':
      return <SelectCell property={property} value={value} onChange={onChange} />

    case 'multi_select':
      return <MultiSelectCell property={property} value={value} onChange={onChange} />

    case 'person':
      return <PersonCell value={value} onChange={onChange} />

    case 'relation':
      // Relation displays linked items (read-only for now)
      return (
        <div className="min-h-[32px] px-2 py-1 flex items-center gap-1 flex-wrap">
          {Array.isArray(value) && value.length > 0 ? (
            value.map((item: { id: string; title?: string }, idx) => (
              <Badge key={item.id || idx} variant="secondary" className="font-normal">
                {item.title || item.id}
              </Badge>
            ))
          ) : (
            <span className="text-muted-foreground text-sm">{t('cells.noRelations')}</span>
          )}
        </div>
      )

    case 'date':
      return (
        <DateCell
          value={value}
          onChange={onChange}
          formatOptions={dateFormatOptions}
          conditionalStyle={conditionalStyle}
        />
      )

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
    case 'created_at':
    case 'updated_at':
    case 'last_edited_time':
      // Handle various date value formats
      const dateValue = (() => {
        if (!value) return null
        if (typeof value === 'string') return value
        if (typeof value === 'object' && value !== null) {
          // Handle object format like { date: '...' } or { value: '...' }
          const obj = value as Record<string, unknown>
          return obj.date || obj.value || obj.created_at || obj.updated_at
        }
        return null
      })()
      return (
        <div className="min-h-[32px] px-2 py-1 flex items-center text-muted-foreground text-sm">
          {dateValue ? format(new Date(dateValue as string), 'MMM d, yyyy HH:mm') : '-'}
        </div>
      )

    case 'created_by':
    case 'last_edited_by':
      // Handle user info object { id, username, avatar_url }
      const userInfo = value as { id?: string; username?: string; avatar_url?: string } | null | undefined
      const username = userInfo?.username
      const getInitials = (name: string) => {
        return name
          .split(' ')
          .map(n => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)
      }
      return (
        <div className="min-h-[32px] px-2 py-1 flex items-center text-sm">
          {username ? (
            <div className="flex items-center gap-1.5">
              <Avatar className="h-5 w-5">
                <AvatarFallback className="text-[10px]">
                  {getInitials(username)}
                </AvatarFallback>
              </Avatar>
              <span>{username}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">{t('cells.empty')}</span>
          )}
        </div>
      )

    default:
      return (
        <div className="min-h-[32px] px-2 py-1 flex items-center text-muted-foreground">
          {String(value ?? '')}
        </div>
      )
  }
})

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
  const { t } = useTranslation('database')
  const [open, setOpen] = useState(false)
  const options = (property.options?.options as Array<{ id: string; name: string; color?: string }>) || []
  const selectedOption = options.find((o) => o.id === value || o.name === value)
  const color = getOptionColor(selectedOption?.color)

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
            <span className="text-muted-foreground">{t('cells.selectPlaceholder')}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-1" align="start">
        <div className="space-y-1">
          {options.map((option) => {
            const optColor = getOptionColor(option.color)
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
                {t('cells.clear')}
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
  const { t } = useTranslation('database')
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
                const color = getOptionColor(option.color)
                return (
                  <Badge key={option.id} className={cn('font-normal', color.bg, color.text)}>
                    {option.name}
                  </Badge>
                )
              })}
            </div>
          ) : (
            <span className="text-muted-foreground">{t('cells.selectPlaceholder')}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-1" align="start">
        <div className="space-y-1">
          {options.map((option) => {
            const optColor = getOptionColor(option.color)
            const isSelected = selectedIds.includes(option.id) || selectedIds.includes(option.name)
            return (
              <div
                key={option.id}
                className={cn(
                  'w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm hover:bg-accent cursor-pointer',
                  isSelected && 'bg-accent'
                )}
                onClick={() => toggleOption(option.id)}
                role="option"
                aria-selected={isSelected}
              >
                <Checkbox checked={isSelected} onCheckedChange={() => toggleOption(option.id)} />
                <Badge className={cn('font-normal', optColor.bg, optColor.text)}>
                  {option.name}
                </Badge>
              </div>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}

// Date cell component with formatting
function DateCell({
  value,
  onChange,
  formatOptions,
  conditionalStyle,
}: {
  value: unknown
  onChange: (value: unknown) => void
  formatOptions?: DateFormatOptions
  conditionalStyle?: { bgColor?: string; textColor?: string } | null
}) {
  const { t } = useTranslation('database')
  const [open, setOpen] = useState(false)
  const dateValue = value ? new Date(value as string) : undefined

  // Get conditional style classes
  const bgColorInfo = conditionalStyle?.bgColor ? selectOptionColors.find(c => c.value === conditionalStyle.bgColor) : null
  const textColorInfo = conditionalStyle?.textColor ? selectOptionColors.find(c => c.value === conditionalStyle.textColor) : null

  // Format the display value using our formatter
  const displayValue = dateValue ? formatDateValue(dateValue, formatOptions) : null

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "h-8 w-full justify-start px-2 font-normal",
            bgColorInfo?.bg,
            textColorInfo?.text
          )}
        >
          {displayValue ? (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              {displayValue}
            </div>
          ) : (
            <span className="text-muted-foreground">{t('cells.pickDate')}</span>
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
              {t('cells.clear')}
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

// Person cell component - allows selecting users
function PersonCell({
  value,
  onChange,
}: {
  value: unknown
  onChange: (value: unknown) => void
}) {
  const { t } = useTranslation('database')
  const [open, setOpen] = useState(false)
  const { data: usersData, isLoading } = useUsers()

  // Get list of users
  const availableUsers = (usersData?.users || [])
    .filter(u => u.id && u.username)
    .map(u => ({ id: u.id, username: u.username, avatarUrl: u.avatar_url }))

  // Current value can be a single user ID or an array of user IDs
  const selectedIds: string[] = Array.isArray(value)
    ? value
    : (value ? [value as string] : [])

  // Find selected users
  const selectedUsers = availableUsers.filter(u => selectedIds.includes(u.id))

  // Sort users: selected first, then alphabetically
  const sortedUsers = [...availableUsers].sort((a, b) => {
    const aSelected = selectedIds.includes(a.id)
    const bSelected = selectedIds.includes(b.id)
    if (aSelected && !bSelected) return -1
    if (!aSelected && bSelected) return 1
    return a.username.localeCompare(b.username)
  })

  const toggleUser = (userId: string) => {
    if (selectedIds.includes(userId)) {
      // Remove user
      const newValue = selectedIds.filter(id => id !== userId)
      onChange(newValue.length > 0 ? newValue : null)
    } else {
      // Add user
      onChange([...selectedIds, userId])
    }
  }

  // Get initials for avatar fallback
  const getInitials = (username: string) => {
    return username
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="h-auto min-h-[32px] w-full justify-start px-2 font-normal"
        >
          {selectedUsers.length > 0 ? (
            <div className="flex items-center gap-1 flex-wrap">
              {selectedUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-1 bg-muted rounded-full pl-0.5 pr-2 py-0.5"
                >
                  <Avatar className="h-5 w-5">
                    <AvatarFallback className="text-[10px]">
                      {getInitials(user.username)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs">{user.username}</span>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-muted-foreground">{t('cells.selectPerson')}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-1" align="start">
        {isLoading ? (
          <div className="p-2 text-sm text-muted-foreground text-center">
            {t('cells.loadingUsers')}
          </div>
        ) : sortedUsers.length === 0 ? (
          <div className="p-2 text-sm text-muted-foreground text-center">
            {t('cells.noUsersFound')}
          </div>
        ) : (
          <div className="space-y-0.5 max-h-64 overflow-y-auto">
            {sortedUsers.map((user) => {
              const isSelected = selectedIds.includes(user.id)
              return (
                <div
                  key={user.id}
                  className={cn(
                    'w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm hover:bg-accent transition-colors cursor-pointer',
                    isSelected && 'bg-accent'
                  )}
                  onClick={() => toggleUser(user.id)}
                  role="option"
                  aria-selected={isSelected}
                >
                  <Checkbox checked={isSelected} onCheckedChange={() => toggleUser(user.id)} />
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {getInitials(user.username)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate">{user.username}</span>
                  {isSelected && <Check className="h-4 w-4 ml-auto shrink-0 text-primary" />}
                </div>
              )
            })}
          </div>
        )}
        {selectedIds.length > 0 && (
          <>
            <div className="border-t my-1" />
            <button
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm text-muted-foreground hover:bg-accent transition-colors"
              onClick={() => {
                onChange(null)
                setOpen(false)
              }}
            >
              <X className="h-4 w-4" />
              {t('cells.clearAll')}
            </button>
          </>
        )}
      </PopoverContent>
    </Popover>
  )
}
