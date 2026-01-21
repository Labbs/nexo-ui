import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { X, Trash2, Clock, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { EmojiPicker } from '@/components/ui/emoji-picker'
import { cn } from '@/lib/utils'
import { useDeleteRow } from '@/hooks/use-database'
import { formatDistanceToNow } from 'date-fns'

interface DocumentRowSettingsSidebarProps {
  isOpen: boolean
  onClose: () => void
  databaseId: string
  rowId: string
  rowName?: string
  icon?: string | null
  isLocked?: boolean
  isFullWidth?: boolean
  updatedAt?: string
  createdAt?: string
  onIconChange: (icon: string | null) => void
  onConfigChange: (config: Partial<{ fullWidth: boolean; lock: boolean }>) => void
  isUpdating?: boolean
}

export function DocumentRowSettingsSidebar({
  isOpen,
  onClose,
  databaseId,
  rowId,
  rowName,
  icon,
  isLocked = false,
  isFullWidth = false,
  updatedAt,
  createdAt,
  onIconChange,
  onConfigChange,
  isUpdating = false,
}: DocumentRowSettingsSidebarProps) {
  const navigate = useNavigate()
  const { spaceId } = useParams<{ spaceId: string }>()
  const deleteRow = useDeleteRow()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = async () => {
    if (!databaseId || !rowId) return
    try {
      await deleteRow.mutateAsync({ databaseId, rowId })
      setShowDeleteDialog(false)
      onClose()
      // Navigate back to database
      navigate(`/space/${spaceId}/database/${databaseId}`)
    } catch (error) {
      console.error('Failed to delete document:', error)
    }
  }

  const handleIconChange = (newIcon: string) => {
    onIconChange(newIcon || null)
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="absolute inset-0 bg-black/20 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'absolute top-0 right-0 h-full w-80 border-l transition-transform duration-200 ease-in-out z-50',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        style={{
          backgroundColor: 'var(--main-bg)',
        }}
      >
        <div className="flex flex-col h-full w-80">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-semibold">Document Settings</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Icon selector */}
            <div>
              <h3 className="text-sm font-medium mb-2">Icon</h3>
              <EmojiPicker value={icon} onChange={handleIconChange}>
                <button
                  className="flex items-center gap-2 px-3 py-2 rounded-md border hover:bg-accent transition-colors w-full"
                  disabled={isUpdating}
                >
                  <span className="text-2xl">{icon || '📄'}</span>
                  <span className="text-sm text-muted-foreground">Change icon</span>
                </button>
              </EmojiPicker>
            </div>

            <Separator />

            {/* Document settings */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Settings</h3>

              {/* Full width toggle */}
              <div className="flex items-center justify-between">
                <Label htmlFor="full-width" className="cursor-pointer">
                  Full width
                </Label>
                <Switch
                  id="full-width"
                  checked={isFullWidth}
                  onCheckedChange={(checked) => onConfigChange({ fullWidth: checked })}
                  disabled={isUpdating}
                />
              </div>

              {/* Lock toggle */}
              <div className="flex items-center justify-between">
                <Label htmlFor="lock" className="cursor-pointer">
                  Lock document
                </Label>
                <Switch
                  id="lock"
                  checked={isLocked}
                  onCheckedChange={(checked) => onConfigChange({ lock: checked })}
                  disabled={isUpdating}
                />
              </div>
            </div>

            <Separator />

            {/* Document info */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Information</h3>
              <div className="space-y-1.5 text-sm text-muted-foreground">
                {updatedAt ? (
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Edited {formatDistanceToNow(new Date(updatedAt), { addSuffix: true })}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs">
                    <Clock className="h-3.5 w-3.5" />
                    <span>No edit date</span>
                  </div>
                )}
                {createdAt ? (
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Created {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs">
                    <Clock className="h-3.5 w-3.5" />
                    <span>No creation date</span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Actions */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-destructive">Danger zone</h3>
              <Button
                variant="outline"
                className="w-full justify-start border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete this document
              </Button>
            </div>
          </div>
        </div>

        {/* Delete confirmation dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Delete document
              </DialogTitle>
              <DialogDescription className="pt-2">
                Are you sure you want to delete <strong>"{rowName || 'Untitled'}"</strong>?
                <br />
                <span className="text-destructive">This action cannot be undone.</span>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0 mt-4">
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
                disabled={deleteRow.isPending}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleDelete}
                disabled={deleteRow.isPending}
              >
                {deleteRow.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
