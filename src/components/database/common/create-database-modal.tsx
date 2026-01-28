import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2, Database } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useCreateDatabase, type PropertySchema } from '@/hooks/use-database'

interface CreateDatabaseModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  spaceId: string
  documentId?: string
  onSuccess?: (databaseId: string) => void
}

// Default schema for databases
const defaultSchema: PropertySchema[] = [
  {
    id: 'title',
    name: 'Title',
    type: 'title',
  },
]

export function CreateDatabaseModal({
  open,
  onOpenChange,
  spaceId,
  documentId,
  onSuccess,
}: CreateDatabaseModalProps) {
  const { t } = useTranslation('database')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [icon, setIcon] = useState('📚')

  const { mutateAsync: createDatabase, isPending } = useCreateDatabase()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    try {
      const result = await createDatabase({
        spaceId,
        name: name.trim(),
        description: description.trim() || undefined,
        icon: icon || undefined,
        schema: defaultSchema,
        documentId,
        type: 'document',
      })

      // Reset form
      setName('')
      setDescription('')
      setIcon('📚')
      onOpenChange(false)

      // Callback with new database ID
      if (result.id) {
        onSuccess?.(result.id)
      }
    } catch (error) {
      console.error('Failed to create database:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t('create.title')}</DialogTitle>
            <DialogDescription>
              {t('create.description')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Icon and Name row */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="text-3xl hover:bg-accent rounded p-2 transition-colors shrink-0"
                onClick={() => {
                  const newIcon = prompt('Enter icon (emoji):', icon)
                  if (newIcon !== null) {
                    setIcon(newIcon)
                  }
                }}
              >
                {icon || '📚'}
              </button>
              <div className="flex-1">
                <Label htmlFor="name" className="sr-only">
                  {t('create.nameLabel')}
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('create.namePlaceholder')}
                  className="text-lg font-medium"
                  autoFocus
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">{t('create.descriptionLabel')}</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('create.descriptionPlaceholder')}
                className="mt-1.5 resize-none"
                rows={2}
              />
            </div>

            {/* Info about default columns */}
            <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 mb-2">
                <Database className="h-4 w-4" />
                <span className="font-medium text-foreground">{t('create.defaultStructure')}</span>
              </div>
              <p>{t('create.defaultStructureInfo')}</p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              {t('common:cancel')}
            </Button>
            <Button type="submit" disabled={!name.trim() || isPending}>
              {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {t('create.submit')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
