import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
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
import { useUpdateSpace, useDeleteSpace } from '@/hooks/use-spaces'
import { useCurrentSpace } from '@/contexts/space-context'
import { useTranslation } from 'react-i18next'

interface EditSpaceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const COLOR_OPTIONS = [
  '#6366f1',
  '#8b5cf6',
  '#ec4899',
  '#ef4444',
  '#f59e0b',
  '#10b981',
  '#3b82f6',
  '#06b6d4',
]

export function EditSpaceModal({ open, onOpenChange }: EditSpaceModalProps) {
  const { currentSpace, setCurrentSpace } = useCurrentSpace()
  const [name, setName] = useState('')
  const [selectedIcon, setSelectedIcon] = useState<IconValue>('🏠')
  const [iconColor, setIconColor] = useState('#6366f1')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const queryClient = useQueryClient()
  const { mutateAsync: updateSpace, isPending: isUpdating } = useUpdateSpace()
  const { mutateAsync: deleteSpace, isPending: isDeleting } = useDeleteSpace()
  const { t } = useTranslation('navigation')

  // Extract icon value for API
  const getIconForApi = (): string => {
    if (isEmoji(selectedIcon)) {
      return selectedIcon as string
    }
    const parsed = parseIconValue(selectedIcon)
    return parsed?.name || 'file-text'
  }

  // Get color for API
  const getColorForApi = (): string => {
    if (!isEmoji(selectedIcon)) {
      const parsed = parseIconValue(selectedIcon)
      return parsed?.color || iconColor
    }
    return iconColor
  }

  useEffect(() => {
    if (open && currentSpace) {
      setName(currentSpace.name || '')
      // Convert stored icon to IconValue
      const storedIcon = currentSpace.icon || '🏠'
      setSelectedIcon(storedIcon)
      setIconColor((currentSpace as any).icon_color || '#6366f1')
      setError('')
    }
  }, [open, currentSpace])

  if (!currentSpace) return null

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const updated = await updateSpace({
        spaceId: currentSpace.id as string,
        name: name || undefined,
        icon: getIconForApi() || undefined,
        iconColor: getColorForApi() || undefined,
      })
      // Rafraîchir la liste et le currentSpace
      await queryClient.invalidateQueries({ queryKey: ['spaces'] })
      setCurrentSpace({ ...(currentSpace as any), ...(updated as any) })
      setSuccess(t('spaces.saved'))
      setTimeout(() => setSuccess(''), 1500)
      onOpenChange(false)
    } catch (err: any) {
      setError(err?.response?.data?.details || t('spaces.updateError'))
    }
  }

  const handleDelete = async () => {
    if (!currentSpace?.id) return
    if (!window.confirm(t('spaces.deleteConfirm'))) return
    setError('')
    try {
      await deleteSpace({ spaceId: currentSpace.id as string })
      await queryClient.invalidateQueries({ queryKey: ['spaces'] })
      setCurrentSpace(null)
      onOpenChange(false)
    } catch (err: any) {
      setError(err?.response?.data?.details || t('spaces.deleteError'))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('spaces.editTitle')}</DialogTitle>
          <DialogDescription>
            {t('spaces.editDescription')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSave}>
          <div className="space-y-4 py-4">
            {success && (
              <div className="text-sm text-emerald-600">{success}</div>
            )}
            <div>
              <label htmlFor="space-name" className="block text-sm font-medium mb-2">
                {t('spaces.nameLabel')}
              </label>
              <Input
                id="space-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('spaces.namePlaceholder')}
                maxLength={100}
              />
            </div>

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
                <label className="block text-sm font-medium mb-2">{t('spaces.backgroundColorLabel')}</label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_OPTIONS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setIconColor(color)}
                      className={`h-8 w-8 rounded border ${
                        iconColor === color ? 'ring-2 ring-offset-2' : ''
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}

            {error && <div className="text-sm text-destructive">{error}</div>}
          </div>

          <DialogFooter>
            <Button type="button" variant="destructive" onClick={handleDelete} disabled={isUpdating || isDeleting}>
              {t('spaces.deleteButton')}
            </Button>
            <div className="flex-1" />
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isUpdating}>
              {t('common:cancel')}
            </Button>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? t('spaces.savingButton') : t('spaces.saveButton')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
