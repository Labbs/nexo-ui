import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2, Type, Hash, CheckSquare, List, ListChecks, Calendar, Link, Mail, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import type { PropertySchema } from '@/hooks/use-databases'

interface AddPropertyModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  existingProperties: PropertySchema[]
  onAdd: (property: PropertySchema) => Promise<void>
}

// Default select options for new select/multi-select properties
const defaultSelectOptions = [
  { id: 'option_1', name: 'Option 1', color: 'gray' },
  { id: 'option_2', name: 'Option 2', color: 'blue' },
  { id: 'option_3', name: 'Option 3', color: 'green' },
]

export function AddPropertyModal({
  open,
  onOpenChange,
  existingProperties: _existingProperties,
  onAdd,
}: AddPropertyModalProps) {
  const { t } = useTranslation('database')
  const [step, setStep] = useState<'type' | 'configure'>('type')
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const propertyTypes = [
    {
      type: 'text',
      name: t('properties.text'),
      description: t('properties.textDescription'),
      icon: Type,
    },
    {
      type: 'number',
      name: t('properties.number'),
      description: t('properties.numberDescription'),
      icon: Hash,
    },
    {
      type: 'checkbox',
      name: t('properties.checkbox'),
      description: t('properties.checkboxDescription'),
      icon: CheckSquare,
    },
    {
      type: 'select',
      name: t('properties.select'),
      description: t('properties.selectDescription'),
      icon: List,
    },
    {
      type: 'multi_select',
      name: t('properties.multiSelect'),
      description: t('properties.multiSelectDescription'),
      icon: ListChecks,
    },
    {
      type: 'date',
      name: t('properties.date'),
      description: t('properties.dateDescription'),
      icon: Calendar,
    },
    {
      type: 'url',
      name: t('properties.url'),
      description: t('properties.urlDescription'),
      icon: Link,
    },
    {
      type: 'email',
      name: t('properties.email'),
      description: t('properties.emailDescription'),
      icon: Mail,
    },
    {
      type: 'phone',
      name: t('properties.phone'),
      description: t('properties.phoneDescription'),
      icon: Phone,
    },
  ]

  const resetForm = () => {
    setStep('type')
    setSelectedType(null)
    setName('')
  }

  const handleClose = () => {
    onOpenChange(false)
    setTimeout(resetForm, 200) // Reset after animation
  }

  const handleTypeSelect = (type: string) => {
    setSelectedType(type)
    // Default name based on type
    const typeInfo = propertyTypes.find((t) => t.type === type)
    setName(typeInfo?.name || 'New property')
    setStep('configure')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedType || !name.trim()) return

    setIsSubmitting(true)
    try {
      // Generate unique ID
      const id = `prop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      const property: PropertySchema = {
        id,
        name: name.trim(),
        type: selectedType,
      }

      // Add default options for select types
      if (selectedType === 'select' || selectedType === 'multi_select') {
        property.options = {
          options: defaultSelectOptions,
        }
      }

      await onAdd(property)
      handleClose()
    } catch (error) {
      console.error('Failed to add property:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {step === 'type' ? (
          <>
            <DialogHeader>
              <DialogTitle>{t('properties.addPropertyTitle')}</DialogTitle>
              <DialogDescription>
                {t('properties.chooseType')}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-2 py-4">
              {propertyTypes.map((propType) => {
                const Icon = propType.icon
                return (
                  <button
                    key={propType.type}
                    className={cn(
                      'flex items-start gap-3 p-3 rounded-lg border text-left hover:bg-accent transition-colors'
                    )}
                    onClick={() => handleTypeSelect(propType.type)}
                  >
                    <Icon className="h-5 w-5 shrink-0 mt-0.5 text-muted-foreground" />
                    <div>
                      <div className="font-medium text-sm">{propType.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {propType.description}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                {t('common:cancel')}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{t('properties.configurePropertyTitle')}</DialogTitle>
              <DialogDescription>
                {t('properties.configureDescription', {
                  type: propertyTypes.find((t) => t.type === selectedType)?.name.toLowerCase(),
                })}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Property type indicator */}
              <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                {(() => {
                  const typeInfo = propertyTypes.find((t) => t.type === selectedType)
                  if (!typeInfo) return null
                  const Icon = typeInfo.icon
                  return (
                    <>
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{typeInfo.name}</span>
                    </>
                  )
                })()}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="ml-auto text-xs"
                  onClick={() => setStep('type')}
                >
                  {t('views.changeType')}
                </Button>
              </div>

              {/* Name input */}
              <div>
                <Label htmlFor="property-name">{t('properties.propertyName')}</Label>
                <Input
                  id="property-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('properties.enterPropertyName')}
                  className="mt-1.5"
                  autoFocus
                />
              </div>

              {/* Select options info */}
              {(selectedType === 'select' || selectedType === 'multi_select') && (
                <div className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
                  {t('properties.defaultOptionsInfo')}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                {t('common:cancel')}
              </Button>
              <Button type="submit" disabled={!name.trim() || isSubmitting}>
                {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {t('properties.addPropertyTitle')}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
