import { useState } from 'react'
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
import { IconEmojiSelector } from './icon-emoji-selector'
import { cn } from '@/lib/utils'
import type { components } from '@/api/types'
import { useDeleteDocument } from '@/hooks/use-documents'
import { useNavigate, useParams } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { PermissionManager } from '@/components/permissions/permission-manager'
import {
  useDocumentPermissions,
  useUpsertDocumentPermission,
  useDeleteDocumentPermission,
} from '@/hooks/use-document-permissions'
import { useSpacePermissions } from '@/hooks/use-space-permissions'
import { useCurrentSpace } from '@/contexts/space-context'
import { useAuth } from '@/contexts/auth-context'

interface DocumentSettingsSidebarProps {
  isOpen: boolean
  onClose: () => void
  document: {
    id?: string
    space_id?: string
    config?: components['schemas']['DocumentConfig']
    name?: string
    updated_at?: string
    created_at?: string
  } | null
  isLocked?: boolean
  isFullWidth?: boolean
  onIconChange: (icon: string | null) => void
  onConfigChange: (config: Partial<{ fullWidth: boolean; lock: boolean }>) => void
  isUpdating?: boolean
}

export function DocumentSettingsSidebar({
  isOpen,
  onClose,
  document,
  isLocked = false,
  isFullWidth = false,
  onIconChange,
  onConfigChange,
  isUpdating = false,
}: DocumentSettingsSidebarProps) {
  const navigate = useNavigate()
  const { spaceId } = useParams<{ spaceId: string }>()
  const { mutateAsync: deleteDocument, isPending: isDeleting } = useDeleteDocument()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const { currentSpace } = useCurrentSpace()
  const { user } = useAuth()

  // Get document ID (can be in 'id' or 'document' field)
  const documentId = document?.id || (document as any)?.document
  const documentSpaceId = (document as any)?.space_id || spaceId

  // Permissions
  const { data: permissions = [], isLoading: permissionsLoading } = useDocumentPermissions(
    documentSpaceId,
    documentId
  )
  const { data: spacePermissionsData } = useSpacePermissions(documentSpaceId)
  const upsertPermission = useUpsertDocumentPermission()
  const deletePermission = useDeleteDocumentPermission()

  // Check if user can manage permissions
  // User can manage if: space admin/owner OR is owner/editor of the document
  // (editor included for backward compatibility with documents created before owner role)
  const isSpaceAdmin = currentSpace?.my_role === 'owner' || currentSpace?.my_role === 'admin'
  const isDocumentOwnerOrEditor = permissions.some(
    (p) => p.user_id === user?.id && (p.role === 'owner' || p.role === 'editor')
  )
  const canManagePermissions = isSpaceAdmin || isDocumentOwnerOrEditor

  // For personal spaces, exclude the space owner from permission management
  // (they always have full access by definition)
  const isPersonalSpace = currentSpace?.type === 'personal'
  const excludeUserId = isPersonalSpace && currentSpace?.owner_id ? currentSpace.owner_id : undefined

  return (
    <div
      className={cn(
        'fixed top-0 right-0 h-full w-80 border-l transition-transform duration-200 ease-in-out z-40',
        isOpen ? 'translate-x-0' : 'translate-x-full'
      )}
      style={{
        backgroundColor: 'hsl(var(--sidebar))',
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
            <IconEmojiSelector
              currentIcon={document?.config?.icon || undefined}
              isUpdating={isUpdating}
              onApplyIcon={onIconChange}
            />
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
              {(document as any)?.updated_at ? (
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Edited {formatDistanceToNow(new Date((document as any).updated_at), { addSuffix: true })}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs">
                  <Clock className="h-3.5 w-3.5" />
                  <span>No edit date</span>
                </div>
              )}
              {(document as any)?.created_at ? (
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Created {formatDistanceToNow(new Date((document as any).created_at), { addSuffix: true })}</span>
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

          {/* Permissions */}
          <div className="space-y-2">
            <PermissionManager
              permissions={permissions}
              spacePermissions={spacePermissionsData?.permissions}
              canManage={canManagePermissions}
              isLoading={permissionsLoading}
              supportGroups={false}
              excludeUserId={excludeUserId}
              onUpsertUser={(userId, role) => {
                if (documentSpaceId && documentId) {
                  upsertPermission.mutate({ spaceId: documentSpaceId, documentId, userId, role })
                }
              }}
              onDeleteUser={(userId) => {
                if (documentSpaceId && documentId) {
                  deletePermission.mutate({ spaceId: documentSpaceId, documentId, userId })
                }
              }}
            />
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
              Are you sure you want to delete <strong>"{document?.name || 'Untitled'}"</strong>?
              <br />
              <span className="text-destructive">This action cannot be undone.</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={async () => {
                // Document ID can be in 'id' or 'document' field depending on API response
                const docId = document?.id || (document as any)?.document
                const docSpaceId = (document as any)?.space_id || spaceId
                if (!docId || !docSpaceId) {
                  console.error('Missing document ID or space ID', { docId, docSpaceId, document })
                  return
                }
                try {
                  await deleteDocument({ spaceId: docSpaceId, identifier: docId })
                  setShowDeleteDialog(false)
                  onClose()
                  navigate('/')
                } catch (error) {
                  console.error('Failed to delete document:', error)
                }
              }}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
