import { useState } from 'react'
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
import { useCreateSpace } from '@/hooks/use-spaces'

interface CreateSpaceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Simple emoji picker - just common emojis for now
const EMOJI_OPTIONS = [
  '🏠', '💼', '📚', '🎨', '🚀', '💡', '🎯', '📝',
  '🔧', '⚡', '🌟', '🎪', '🏢', '🎓', '🌈', '🔥'
]

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
  const [selectedEmoji, setSelectedEmoji] = useState('🏠')
  const [selectedColor, setSelectedColor] = useState('#6366f1')
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState('')

  const { createSpace } = useCreateSpace()
  const queryClient = useQueryClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Please enter a space name')
      return
    }

    setIsCreating(true)

    try {
      await createSpace(name.trim(), selectedEmoji, selectedColor)

      // Refresh spaces list
      await queryClient.invalidateQueries({ queryKey: ['spaces'] })

      // Reset form
      setName('')
      setSelectedEmoji('🏠')
      setSelectedColor('#6366f1')
      onOpenChange(false)
    } catch (err: any) {
      setError(err.response?.data?.details || 'Failed to create space')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create new space</DialogTitle>
          <DialogDescription>
            Create a new workspace to organize your documents.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Name input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Space name
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Workspace"
                autoFocus
                maxLength={100}
              />
            </div>

            {/* Emoji picker */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Icon
              </label>
              <div className="flex flex-wrap gap-2">
                {EMOJI_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setSelectedEmoji(emoji)}
                    className={`h-10 w-10 rounded-lg border-2 transition-all hover:scale-110 ${
                      selectedEmoji === emoji
                        ? 'border-primary'
                        : 'border-transparent hover:border-muted-foreground/30'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Color picker */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Color
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

            {/* Preview */}
            <div className="pt-2">
              <label className="block text-sm font-medium mb-2">
                Preview
              </label>
              <div className="flex items-center gap-2 px-3 py-2 border rounded-lg bg-muted/20">
                <div
                  className="h-8 w-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: selectedColor, color: 'white' }}
                >
                  {selectedEmoji}
                </div>
                <span className="font-medium truncate">
                  {name || 'My Workspace'}
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
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating || !name.trim()}>
              {isCreating ? 'Creating...' : 'Create space'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
