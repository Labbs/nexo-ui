import { useState } from 'react'
import {
  Type,
  Hash,
  CheckSquare,
  CircleDot,
  Tags,
  Calendar,
  Link,
  Mail,
  Phone,
  User,
  Paperclip,
  Clock,
  UserCheck,
  Search,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import type { PropertySchema } from '@/hooks/use-databases'

interface AddPropertyPopoverProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (property: PropertySchema) => Promise<void>
  trigger: React.ReactNode
}

// Property types organized like Notion
const basicTypes = [
  { type: 'text', name: 'Text', icon: Type, description: 'Plain text' },
  { type: 'number', name: 'Number', icon: Hash, description: 'Numbers' },
  { type: 'select', name: 'Select', icon: CircleDot, description: 'Single option' },
  { type: 'multi_select', name: 'Multi-select', icon: Tags, description: 'Multiple options' },
  { type: 'status', name: 'Status', icon: CircleDot, description: 'Track progress' },
  { type: 'date', name: 'Date', icon: Calendar, description: 'Date and time' },
  { type: 'person', name: 'Person', icon: User, description: 'Assign people' },
  { type: 'checkbox', name: 'Checkbox', icon: CheckSquare, description: 'Yes or no' },
  { type: 'url', name: 'URL', icon: Link, description: 'Web links' },
  { type: 'email', name: 'Email', icon: Mail, description: 'Email addresses' },
  { type: 'phone', name: 'Phone', icon: Phone, description: 'Phone numbers' },
]

const advancedTypes = [
  { type: 'files', name: 'Files & media', icon: Paperclip, description: 'Attachments' },
  { type: 'relation', name: 'Relation', icon: Link, description: 'Link to another database' },
  { type: 'rollup', name: 'Rollup', icon: Hash, description: 'Calculate from relations' },
  { type: 'formula', name: 'Formula', icon: Hash, description: 'Compute values' },
]

const systemTypes = [
  { type: 'created_time', name: 'Created time', icon: Clock, description: 'Auto-generated' },
  { type: 'created_by', name: 'Created by', icon: UserCheck, description: 'Auto-generated' },
  { type: 'last_edited_time', name: 'Last edited time', icon: Clock, description: 'Auto-generated' },
  { type: 'last_edited_by', name: 'Last edited by', icon: UserCheck, description: 'Auto-generated' },
]

// Default select options
const defaultSelectOptions = [
  { id: 'option_1', name: 'Option 1', color: 'gray' },
  { id: 'option_2', name: 'Option 2', color: 'blue' },
  { id: 'option_3', name: 'Option 3', color: 'green' },
]

// Default status options
const defaultStatusOptions = [
  { id: 'not_started', name: 'Not started', color: 'gray' },
  { id: 'in_progress', name: 'In progress', color: 'blue' },
  { id: 'done', name: 'Done', color: 'green' },
]

export function AddPropertyPopover({
  open,
  onOpenChange,
  onAdd,
  trigger,
}: AddPropertyPopoverProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [propertyName, setPropertyName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const allTypes = [...basicTypes, ...advancedTypes, ...systemTypes]
  const filteredTypes = searchQuery
    ? allTypes.filter(
        (t) =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null

  const handleTypeSelect = async (type: string) => {
    const typeInfo = allTypes.find((t) => t.type === type)
    const name = propertyName.trim() || typeInfo?.name || 'New property'

    setIsSubmitting(true)
    try {
      const id = `prop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      const property: PropertySchema = {
        id,
        name,
        type,
      }

      // Add default options for select types
      if (type === 'select' || type === 'multi_select') {
        property.options = { options: defaultSelectOptions }
      } else if (type === 'status') {
        property.options = { options: defaultStatusOptions }
      }

      await onAdd(property)
      onOpenChange(false)
      setSearchQuery('')
      setPropertyName('')
    } catch (error) {
      console.error('Failed to add property:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderTypeItem = (typeInfo: (typeof basicTypes)[0]) => {
    const Icon = typeInfo.icon
    return (
      <button
        key={typeInfo.type}
        className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-accent rounded-sm transition-colors disabled:opacity-50"
        onClick={() => handleTypeSelect(typeInfo.type)}
        disabled={isSubmitting}
      >
        <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
        <div className="flex-1 text-left">
          <div className="font-medium">{typeInfo.name}</div>
        </div>
      </button>
    )
  }

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        className="w-72 p-0"
        align="start"
        sideOffset={4}
      >
        {/* Search/Name input */}
        <div className="p-2 border-b">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery || propertyName}
              onChange={(e) => {
                const value = e.target.value
                setSearchQuery(value)
                setPropertyName(value)
              }}
              placeholder="Type property name..."
              className="h-8 pl-8 text-sm"
              autoFocus
            />
          </div>
        </div>

        {/* Type list */}
        <div className="max-h-80 overflow-y-auto py-1">
          {filteredTypes ? (
            // Search results
            filteredTypes.length > 0 ? (
              <div className="px-1">
                {filteredTypes.map(renderTypeItem)}
              </div>
            ) : (
              <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                No matching property types
              </div>
            )
          ) : (
            // Grouped list
            <>
              {/* Basic section */}
              <div className="px-3 py-1.5">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Basic
                </div>
              </div>
              <div className="px-1">
                {basicTypes.map(renderTypeItem)}
              </div>

              {/* Advanced section */}
              <div className="px-3 py-1.5 mt-1">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Advanced
                </div>
              </div>
              <div className="px-1">
                {advancedTypes.map(renderTypeItem)}
              </div>

              {/* System section */}
              <div className="px-3 py-1.5 mt-1">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  System
                </div>
              </div>
              <div className="px-1">
                {systemTypes.map(renderTypeItem)}
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
