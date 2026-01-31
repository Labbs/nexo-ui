import { useNavigate, useParams } from 'react-router-dom'
import { ContentSettingsSidebar } from '@/components/shared/content-settings-sidebar'
import { useDeleteDrawing, useUpdateDrawing, type Drawing } from '@/hooks/use-drawings'
import {
  useDrawingPermissions,
  useUpsertDrawingPermission,
  useDeleteDrawingPermission,
} from '@/hooks/use-drawing-permissions'
import { useSpacePermissions } from '@/hooks/use-space-permissions'
import { useCurrentSpace } from '@/contexts/space-context'
import { useAuth } from '@/contexts/auth-context'
import type { IconValue } from '@/components/ui/icon-picker'
import { parseStoredIcon, serializeIcon } from '@/lib/utils'

interface DrawingSettingsSidebarProps {
  isOpen: boolean
  onClose: () => void
  drawing: Drawing | null
}

export function DrawingSettingsSidebar({
  isOpen,
  onClose,
  drawing,
}: DrawingSettingsSidebarProps) {
  const navigate = useNavigate()
  const { spaceId } = useParams<{ spaceId: string }>()
  const { mutateAsync: deleteDrawing, isPending: isDeleting } = useDeleteDrawing()
  const { mutate: updateDrawing, isPending: isUpdating } = useUpdateDrawing()
  const { currentSpace } = useCurrentSpace()
  const { user } = useAuth()

  // Permissions
  const drawingSpaceId = drawing?.space_id || spaceId
  const { data: permissions = [], isLoading: permissionsLoading } = useDrawingPermissions(drawing?.id)
  const { data: spacePermissionsData } = useSpacePermissions(drawingSpaceId || null)
  const upsertPermission = useUpsertDrawingPermission()
  const deletePermission = useDeleteDrawingPermission()

  // Check if user can manage permissions
  const isSpaceAdmin = currentSpace?.my_role === 'owner' || currentSpace?.my_role === 'admin'
  const isDrawingOwnerOrEditor = permissions.some(
    (p) => p.user_id === user?.id && (p.role === 'owner' || p.role === 'editor')
  )
  const canManagePermissions = isSpaceAdmin || isDrawingOwnerOrEditor

  const handleIconChange = (icon: IconValue) => {
    if (!drawing?.id) return
    updateDrawing({ drawingId: drawing.id, icon: serializeIcon(icon) || undefined })
  }

  const handleDelete = async () => {
    if (!drawing?.id || !spaceId) return
    await deleteDrawing(drawing.id)
    navigate(`/space/${spaceId}`)
  }

  return (
    <ContentSettingsSidebar
      contentType="drawing"
      isOpen={isOpen}
      onClose={onClose}
      name={drawing?.name}
      icon={parseStoredIcon(drawing?.icon)}
      createdAt={drawing?.created_at}
      updatedAt={drawing?.updated_at}
      createdBy={drawing?.created_by}
      onIconChange={handleIconChange}
      isIconUpdating={isUpdating}
      permissions={permissions}
      spacePermissions={spacePermissionsData?.permissions}
      canManagePermissions={canManagePermissions}
      permissionsLoading={permissionsLoading}
      supportGroups={false}
      onUpsertUserPermission={(userId, role) => {
        if (drawing?.id) {
          upsertPermission.mutate({ drawingId: drawing.id, userId, role: role as 'owner' | 'editor' | 'viewer' | 'denied' })
        }
      }}
      onDeleteUserPermission={(userId) => {
        if (drawing?.id) {
          deletePermission.mutate({ drawingId: drawing.id, userId })
        }
      }}
      onDelete={handleDelete}
      isDeleting={isDeleting}
    />
  )
}
