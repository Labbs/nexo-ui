import { useState } from 'react'
import { Loader2 } from 'lucide-react'
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
import { useCreateDrawing } from '@/hooks/use-drawings'

interface CreateDrawingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  spaceId: string
  documentId?: string
  onSuccess?: (drawingId: string) => void
}

export function CreateDrawingModal({
  open,
  onOpenChange,
  spaceId,
  documentId,
  onSuccess,
}: CreateDrawingModalProps) {
  const [name, setName] = useState('')

  const { mutateAsync: createDrawing, isPending } = useCreateDrawing()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    try {
      const result = await createDrawing({
        spaceId,
        documentId,
        name: name.trim(),
        elements: [],
        appState: {},
        files: {},
      })

      // Reset form
      setName('')
      onOpenChange(false)

      // Callback with new drawing ID
      if (result.id) {
        onSuccess?.(result.id)
      }
    } catch (error) {
      console.error('Failed to create drawing:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create drawing</DialogTitle>
            <DialogDescription>
              Create a new Excalidraw drawing to sketch diagrams, wireframes, and more.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Drawing name"
                className="mt-1.5"
                autoFocus
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim() || isPending}>
              {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create drawing
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
