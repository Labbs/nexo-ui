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
import { useUpdateSpace, useDeleteSpace } from '@/hooks/use-spaces'
import { useCurrentSpace } from '@/contexts/space-context'

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
  const [icon, setIcon] = useState('')
  const [iconColor, setIconColor] = useState('#6366f1')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const queryClient = useQueryClient()
  const { mutateAsync: updateSpace, isPending: isUpdating } = useUpdateSpace()
  const { mutateAsync: deleteSpace, isPending: isDeleting } = useDeleteSpace()

  useEffect(() => {
    if (open && currentSpace) {
      setName(currentSpace.name || '')
      setIcon(currentSpace.icon || '🏠')
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
        icon: icon || undefined,
        iconColor: iconColor || undefined,
      })
      // Rafraîchir la liste et le currentSpace
      await queryClient.invalidateQueries({ queryKey: ['spaces'] })
      setCurrentSpace({ ...(currentSpace as any), ...(updated as any) })
      setSuccess('Espace sauvegardé')
      setTimeout(() => setSuccess(''), 1500)
      onOpenChange(false)
    } catch (err: any) {
      setError(err?.response?.data?.details || 'Failed to update space')
    }
  }

  const handleDelete = async () => {
    if (!currentSpace?.id) return
    if (!window.confirm('Supprimer cet espace ? Cette action est irréversible.')) return
    setError('')
    try {
      await deleteSpace({ spaceId: currentSpace.id as string })
      await queryClient.invalidateQueries({ queryKey: ['spaces'] })
      setCurrentSpace(null)
      onOpenChange(false)
    } catch (err: any) {
      setError(err?.response?.data?.details || 'Failed to delete space')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Éditer l’espace</DialogTitle>
          <DialogDescription>
            Modifiez le nom, l’icône et la couleur de l’espace sélectionné.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSave}>
          <div className="space-y-4 py-4">
            {success && (
              <div className="text-sm text-emerald-600">{success}</div>
            )}
            <div>
              <label htmlFor="space-name" className="block text-sm font-medium mb-2">
                Nom de l’espace
              </label>
              <Input
                id="space-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Mon Espace"
                maxLength={100}
              />
            </div>

            <div>
              <label htmlFor="space-icon" className="block text-sm font-medium mb-2">
                Icône (emoji)
              </label>
              <Input
                id="space-icon"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder="Ex: 🏠"
                maxLength={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Couleur</label>
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

            {error && <div className="text-sm text-destructive">{error}</div>}
          </div>

          <DialogFooter>
            <Button type="button" variant="destructive" onClick={handleDelete} disabled={isUpdating || isDeleting}>
              Supprimer l’espace
            </Button>
            <div className="flex-1" />
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isUpdating}>
              Annuler
            </Button>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? 'Sauvegarde…' : 'Enregistrer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
