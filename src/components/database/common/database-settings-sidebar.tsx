import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ContentSettingsSidebar } from '@/components/shared/content-settings-sidebar'
import type { Permission, SpacePermission } from '@/components/permissions/permission-manager'
import { useDeleteDatabase, type GetDatabaseResponse } from '@/hooks/use-database'
import {
  useDatabasePermissions,
  useUpsertDatabasePermission,
  useDeleteDatabasePermission,
} from '@/hooks/use-database-permissions'
import { useSpacePermissions } from '@/hooks/use-space-permissions'
import { useCurrentSpace } from '@/contexts/space-context'

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
  const { t } = useTranslation('database')
  const navigate = useNavigate()
  const { spaceId } = useParams<{ spaceId: string }>()
  const { mutateAsync: deleteDatabase, isPending: isDeleting } = useDeleteDatabase()
  const { currentSpace } = useCurrentSpace()

  // Permissions
  const { data: permissions = [], isLoading: permissionsLoading } = useDatabasePermissions(database?.id)
  const { data: spacePermissionsData } = useSpacePermissions(database?.space_id || spaceId || null)
  const upsertPermission = useUpsertDatabasePermission()
  const deletePermission = useDeleteDatabasePermission()

  // Check if user can manage permissions (space admin/owner)
  const isSpaceAdmin = currentSpace?.my_role === 'owner' || currentSpace?.my_role === 'admin'
  const canManagePermissions = isSpaceAdmin

  const handleDelete = async () => {
    const dbId = database?.id
    const dbSpaceId = database?.space_id || spaceId
    const dbDocumentId = database?.document_id
    if (!dbId) {
      console.error('Missing database ID', { database })
      return
    }

    // Navigate to parent document if inline, otherwise to space
    const targetPath = dbDocumentId && dbSpaceId
      ? `/spaces/${dbSpaceId}/documents/${dbDocumentId}`
      : dbSpaceId
        ? `/spaces/${dbSpaceId}`
        : '/'

    navigate(targetPath, { replace: true })

    // Now delete (the page is already unmounted so no refetch will happen)
    await deleteDatabase({ databaseId: dbId })
  }

  return (
    <ContentSettingsSidebar
      contentType="database"
      isOpen={isOpen}
      onClose={onClose}
      name={database?.name}
      description={database?.description}
      createdAt={database?.created_at}
      updatedAt={database?.updated_at}
      createdBy={database?.created_by}
      permissions={permissions as unknown as Permission[]}
      spacePermissions={spacePermissionsData?.permissions as unknown as SpacePermission[] | undefined}
      canManagePermissions={canManagePermissions}
      permissionsLoading={permissionsLoading}
      supportGroups={true}
      onUpsertUserPermission={(userId, role) => {
        if (database?.id && role !== 'owner') {
          upsertPermission.mutate({ databaseId: database.id, userId, role: role as 'editor' | 'viewer' | 'denied' })
        }
      }}
      onUpsertGroupPermission={(groupId, role) => {
        if (database?.id && role !== 'owner') {
          upsertPermission.mutate({ databaseId: database.id, groupId, role: role as 'editor' | 'viewer' | 'denied' })
        }
      }}
      onDeleteUserPermission={(userId) => {
        if (database?.id) {
          deletePermission.mutate({ databaseId: database.id, userId })
        }
      }}
      onDeleteGroupPermission={(groupId) => {
        if (database?.id) {
          deletePermission.mutate({ databaseId: database.id, groupId })
        }
      }}
      onDelete={handleDelete}
      isDeleting={isDeleting}
      deleteWarning={t('settings.deleteWarning')}
    />
  )
}
