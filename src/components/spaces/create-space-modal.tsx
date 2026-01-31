import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Globe, Lock } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { IconPicker, DocumentIcon, isEmoji, parseIconValue, type IconValue } from '@/components/ui/icon-picker'
import { useCreateSpace } from '@/hooks/use-spaces'
import { useTranslation } from 'react-i18next'

interface CreateSpaceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const COLOR_OPTIONS = [
  '#6366f1', // indigo
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#ef4444', // red
  '#f59e0b', // amber
  '#10b981', // green
  '#3b82f6', // blue
  '#06b6d4', // cyan
]

export function CreateSpaceModal({ open, onOpenChange }: CreateSpaceModalProps) {
  const [name, setName] = useState('')
  const [selectedIcon, setSelectedIcon] = useState<IconValue>('🏠')
  const [selectedColor, setSelectedColor] = useState('#6366f1')
  const [spaceType, setSpaceType] = useState<'public' | 'private'>('public')
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState('')

  const { createSpace } = useCreateSpace()
  const queryClient = useQueryClient()
  const { t } = useTranslation('navigation')

  // Extract emoji or icon for API
  const getIconForApi = (): string => {
    if (isEmoji(selectedIcon)) {
      return selectedIcon as string
    }
    const parsed = parseIconValue(selectedIcon)
    return parsed?.name || 'file-text'
  }

  // Get color for API - use icon color if it's an icon, otherwise use selectedColor
  const getColorForApi = (): string => {
    if (!isEmoji(selectedIcon)) {
      const parsed = parseIconValue(selectedIcon)
      return parsed?.color || selectedColor
    }
    return selectedColor
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError(t('spaces.nameRequired'))
      return
    }

    setIsCreating(true)

    try {
      await createSpace(name.trim(), getIconForApi(), getColorForApi(), spaceType)

      // Refresh spaces list
      await queryClient.invalidateQueries({ queryKey: ['spaces'] })

      // Reset form
      setName('')
      setSelectedIcon('🏠')
      setSelectedColor('#6366f1')
      setSpaceType('public')
      onOpenChange(false)
    } catch (err: any) {
      setError(err.response?.data?.details || t('spaces.createError'))
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('spaces.createTitle')}</DialogTitle>
          <DialogDescription>
            {t('spaces.createDescription')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Name input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                {t('spaces.nameLabel')}
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('spaces.namePlaceholder')}
                autoFocus
                maxLength={100}
              />
            </div>

            {/* Visibility selector */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('spaces.visibilityLabel')}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSpaceType('public')}
                  className={`flex flex-col items-start gap-1 rounded-lg border-2 p-3 text-left transition-colors ${
                    spaceType === 'public'
                      ? 'border-primary bg-primary/5'
                      : 'border-muted hover:border-muted-foreground/30'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span className="text-sm font-medium">{t('spaces.publicSpace')}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {t('spaces.publicSpaceDescription')}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setSpaceType('private')}
                  className={`flex flex-col items-start gap-1 rounded-lg border-2 p-3 text-left transition-colors ${
                    spaceType === 'private'
                      ? 'border-primary bg-primary/5'
                      : 'border-muted hover:border-muted-foreground/30'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    <span className="text-sm font-medium">{t('spaces.privateSpace')}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {t('spaces.privateSpaceDescription')}
                  </span>
                </button>
              </div>
            </div>

            {/* Icon picker */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('spaces.iconLabel')}
              </label>
              <IconPicker value={selectedIcon} onChange={setSelectedIcon} defaultTab="emoji">
                <button
                  type="button"
                  className="h-12 w-12 rounded-lg border-2 border-dashed hover:border-primary transition-colors flex items-center justify-center"
                >
                  <DocumentIcon value={selectedIcon} size="lg" />
                </button>
              </IconPicker>
              <p className="text-xs text-muted-foreground mt-1">
                {t('spaces.iconHelp')}
              </p>
            </div>

            {/* Color picker (only for emojis) */}
            {isEmoji(selectedIcon) && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('spaces.backgroundColorLabel')}
                </label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_OPTIONS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`h-10 w-10 rounded-lg border-2 transition-all hover:scale-110 ${
                        selectedColor === color
                          ? 'border-primary ring-2 ring-offset-2'
                          : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Preview */}
            <div className="pt-2">
              <label className="block text-sm font-medium mb-2">
                {t('spaces.previewLabel')}
              </label>
              <div className="flex items-center gap-2 px-3 py-2 border rounded-lg bg-muted/20">
                <div
                  className="h-8 w-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: isEmoji(selectedIcon) ? selectedColor : 'transparent' }}
                >
                  <DocumentIcon value={selectedIcon} size="md" />
                </div>
                <span className="font-medium truncate">
                  {name || t('spaces.namePlaceholder')}
                </span>
              </div>
            </div>

            {error && (
              <div className="text-sm text-destructive">{error}</div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isCreating}
            >
              {t('common:cancel')}
            </Button>
            <Button type="submit" disabled={isCreating || !name.trim()}>
              {isCreating ? t('spaces.creating') : t('spaces.createButton')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
