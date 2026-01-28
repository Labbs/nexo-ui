import { useNavigate, useParams } from 'react-router-dom'
import { ContentSettingsSidebar } from '@/components/shared/content-settings-sidebar'
import { useDeleteDrawing, useUpdateDrawing, type Drawing } from '@/hooks/use-drawings'
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
      onDelete={handleDelete}
      isDeleting={isDeleting}
    />
  )
}
