import { useState } from 'react'
import { X, Trash2, Clock, AlertTriangle, Database } from 'lucide-react'
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
import { cn } from '@/lib/utils'
import { useDeleteDatabase, type GetDatabaseResponse } from '@/hooks/use-database'
import { useNavigate, useParams } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { PermissionManager } from '@/components/permissions/permission-manager'
import {
  useDatabasePermissions,
  useUpsertDatabasePermission,
  useDeleteDatabasePermission,
} from '@/hooks/use-database-permissions'
import { useAdminSpacePermissions } from '@/hooks/use-admin'
import { useCurrentSpace } from '@/contexts/space-context'

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

interface DatabaseSettingsSidebarProps {
  isOpen: boolean
  onClose: () => void
  database: GetDatabaseResponse | null
}

export function DatabaseSettingsSidebar({
  isOpen,
  onClose,
  database,
}: DatabaseSettingsSidebarProps) {
  const navigate = useNavigate()
  const { spaceId } = useParams<{ spaceId: string }>()
  const { mutateAsync: deleteDatabase, isPending: isDeleting } = useDeleteDatabase()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const { currentSpace } = useCurrentSpace()

  // Permissions
  const { data: permissions = [], isLoading: permissionsLoading } = useDatabasePermissions(database?.id)
  const { data: spacePermissionsData } = useAdminSpacePermissions(database?.space_id || spaceId || null)
  const upsertPermission = useUpsertDatabasePermission()
  const deletePermission = useDeleteDatabasePermission()

  // Check if user can manage permissions (space admin/owner)
  const isSpaceAdmin = currentSpace?.my_role === 'owner' || currentSpace?.my_role === 'admin'
  const canManagePermissions = isSpaceAdmin

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
          <h2 className="font-semibold">Database Settings</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Database info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">{database?.name || 'Untitled Database'}</span>
            </div>
            {database?.description && (
              <p className="text-sm text-muted-foreground">{database.description}</p>
            )}
          </div>

          <Separator />

          {/* Database info */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Information</h3>
            <div className="space-y-1.5 text-sm text-muted-foreground">
              {(() => {
                const updatedAt = parseDate(database?.updated_at)
                return updatedAt ? (
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Edited {formatDistanceToNow(updatedAt, { addSuffix: true })}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs">
                    <Clock className="h-3.5 w-3.5" />
                    <span>No edit date</span>
                  </div>
                )
              })()}
              {(() => {
                const createdAt = parseDate(database?.created_at)
                return createdAt ? (
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Created {formatDistanceToNow(createdAt, { addSuffix: true })}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs">
                    <Clock className="h-3.5 w-3.5" />
                    <span>No creation date</span>
                  </div>
                )
              })()}
              {database?.created_by && (
                <div className="flex items-center gap-2">
                  <span className="text-xs">By {database.created_by}</span>
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
              onUpsertUser={(userId, role) => {
                if (database?.id) {
                  upsertPermission.mutate({ databaseId: database.id, userId, role })
                }
              }}
              onUpsertGroup={(groupId, role) => {
                if (database?.id) {
                  upsertPermission.mutate({ databaseId: database.id, groupId, role })
                }
              }}
              onDeleteUser={(userId) => {
                if (database?.id) {
                  deletePermission.mutate({ databaseId: database.id, userId })
                }
              }}
              onDeleteGroup={(groupId) => {
                if (database?.id) {
                  deletePermission.mutate({ databaseId: database.id, groupId })
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
              Delete this database
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
              Delete database
            </DialogTitle>
            <DialogDescription className="pt-2">
              Are you sure you want to delete <strong>"{database?.name || 'Untitled Database'}"</strong>?
              <br />
              <span className="text-destructive">This will delete all rows and cannot be undone.</span>
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
                const dbId = database?.id
                const dbSpaceId = database?.space_id || spaceId
                const dbDocumentId = database?.document_id
                if (!dbId) {
                  console.error('Missing database ID', { database })
                  return
                }

                // Navigate FIRST to unmount the database page before the delete completes
                // This prevents React Query from trying to refetch the deleted database
                setShowDeleteDialog(false)
                onClose()

                // Navigate to parent document if inline, otherwise to space
                const targetPath = dbDocumentId && dbSpaceId
                  ? `/spaces/${dbSpaceId}/documents/${dbDocumentId}`
                  : dbSpaceId
                    ? `/spaces/${dbSpaceId}`
                    : '/'

                navigate(targetPath, { replace: true })

                // Now delete (the page is already unmounted so no refetch will happen)
                try {
                  await deleteDatabase({ databaseId: dbId })
                } catch (error) {
                  console.error('Failed to delete database:', error)
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
