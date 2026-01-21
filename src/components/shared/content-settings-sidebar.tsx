import { useState, type ReactNode } from 'react'
import { X, Trash2, Clock, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { IconEmojiSelector } from '@/components/document/icon-emoji-selector'
import { PermissionManager, type Permission, type SpacePermission } from '@/components/permissions/permission-manager'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'

// Helper to parse date from API (can be string or object)
function parseDate(date: unknown): Date | null {
  if (!date) return null
  if (typeof date === 'string') return new Date(date)
  if (typeof date === 'object' && date !== null) {
    // Handle Go time.Time serialized as object
    const d = date as Record<string, unknown>
    if (d.Time) return new Date(d.Time as string)
  }
  return null
}

export type ContentType = 'document' | 'database' | 'drawing'

interface ContentSettingsSidebarProps {
  contentType: ContentType
  isOpen: boolean
  onClose: () => void

  // Content info
  name?: string
  icon?: string
  description?: string
  createdAt?: string | unknown
  updatedAt?: string | unknown
  createdBy?: string

  // Icon management
  onIconChange?: (icon: string | null) => void
  isIconUpdating?: boolean

  // Custom settings section (for document-specific settings like fullWidth, lock)
  customSettings?: ReactNode

  // Permissions
  permissions?: Permission[]
  spacePermissions?: SpacePermission[]
  canManagePermissions?: boolean
  permissionsLoading?: boolean
  supportGroups?: boolean
  excludeUserId?: string
  onUpsertUserPermission?: (userId: string, role: string) => void
  onDeleteUserPermission?: (userId: string) => void
  onUpsertGroupPermission?: (groupId: string, role: string) => void
  onDeleteGroupPermission?: (groupId: string) => void

  // Delete action
  onDelete: () => Promise<void>
  isDeleting?: boolean
  deleteWarning?: string
}

const contentTypeLabels: Record<ContentType, { title: string; deleteLabel: string; defaultName: string }> = {
  document: {
    title: 'Document Settings',
    deleteLabel: 'Delete this document',
    defaultName: 'Untitled',
  },
  database: {
    title: 'Database Settings',
    deleteLabel: 'Delete this database',
    defaultName: 'Untitled Database',
  },
  drawing: {
    title: 'Drawing Settings',
    deleteLabel: 'Delete this drawing',
    defaultName: 'Untitled Drawing',
  },
}

export function ContentSettingsSidebar({
  contentType,
  isOpen,
  onClose,
  name,
  icon,
  description,
  createdAt,
  updatedAt,
  createdBy,
  onIconChange,
  isIconUpdating = false,
  customSettings,
  permissions = [],
  spacePermissions,
  canManagePermissions = false,
  permissionsLoading = false,
  supportGroups = false,
  excludeUserId,
  onUpsertUserPermission,
  onDeleteUserPermission,
  onUpsertGroupPermission,
  onDeleteGroupPermission,
  onDelete,
  isDeleting = false,
  deleteWarning,
}: ContentSettingsSidebarProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const labels = contentTypeLabels[contentType]

  const handleDelete = async () => {
    try {
      await onDelete()
      setShowDeleteDialog(false)
      onClose()
    } catch (error) {
      console.error(`Failed to delete ${contentType}:`, error)
    }
  }

  const parsedUpdatedAt = parseDate(updatedAt)
  const parsedCreatedAt = parseDate(createdAt)

  return (
    <div
      className={cn(
        'absolute top-0 right-0 h-full w-80 border-l transition-transform duration-200 ease-in-out z-40',
        isOpen ? 'translate-x-0' : 'translate-x-full'
      )}
      style={{
        backgroundColor: 'var(--main-bg)',
      }}
    >
      <div className="flex flex-col h-full w-80">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold">{labels.title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Icon selector */}
          {onIconChange && (
            <>
              <div>
                <h3 className="text-sm font-medium mb-2">Icon</h3>
                <IconEmojiSelector
                  currentIcon={icon || undefined}
                  isUpdating={isIconUpdating}
                  onApplyIcon={onIconChange}
                />
              </div>
              <Separator />
            </>
          )}

          {/* Description (for database) */}
          {description && (
            <>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Description</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
              <Separator />
            </>
          )}

          {/* Custom settings section (for document-specific settings) */}
          {customSettings && (
            <>
              {customSettings}
              <Separator />
            </>
          )}

          {/* Information */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Information</h3>
            <div className="space-y-1.5 text-sm text-muted-foreground">
              {parsedUpdatedAt ? (
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Edited {formatDistanceToNow(parsedUpdatedAt, { addSuffix: true })}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs">
                  <Clock className="h-3.5 w-3.5" />
                  <span>No edit date</span>
                </div>
              )}
              {parsedCreatedAt ? (
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Created {formatDistanceToNow(parsedCreatedAt, { addSuffix: true })}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs">
                  <Clock className="h-3.5 w-3.5" />
                  <span>No creation date</span>
                </div>
              )}
              {createdBy && (
                <div className="flex items-center gap-2">
                  <span className="text-xs">By {createdBy}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Permissions */}
          {(onUpsertUserPermission || onDeleteUserPermission) && (
            <>
              <div className="space-y-2">
                <PermissionManager
                  permissions={permissions}
                  spacePermissions={spacePermissions}
                  canManage={canManagePermissions}
                  isLoading={permissionsLoading}
                  supportGroups={supportGroups}
                  excludeUserId={excludeUserId}
                  onUpsertUser={onUpsertUserPermission}
                  onDeleteUser={onDeleteUserPermission}
                  onUpsertGroup={onUpsertGroupPermission}
                  onDeleteGroup={onDeleteGroupPermission}
                />
              </div>
              <Separator />
            </>
          )}

          {/* Danger zone */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-destructive">Danger zone</h3>
            <Button
              variant="outline"
              className="w-full justify-start border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {labels.deleteLabel}
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
              Delete {contentType}
            </DialogTitle>
            <DialogDescription className="pt-2">
              Are you sure you want to delete <strong>"{name || labels.defaultName}"</strong>?
              <br />
              <span className="text-destructive">
                {deleteWarning || 'This action cannot be undone.'}
              </span>
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
              onClick={handleDelete}
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
