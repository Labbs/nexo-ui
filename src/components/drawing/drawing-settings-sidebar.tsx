import { useNavigate, useParams } from 'react-router-dom'
import { ContentSettingsSidebar } from '@/components/shared/content-settings-sidebar'
import { useDeleteDrawing, useUpdateDrawing, type Drawing } from '@/hooks/use-drawings'

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

  const handleIconChange = (icon: string | null) => {
    if (!drawing?.id) return
    updateDrawing({ drawingId: drawing.id, icon: icon || '' })
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
      icon={drawing?.icon}
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
