import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Loader2, ArrowLeft } from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { DrawingEditor } from '@/components/drawing/drawing-editor'
import { DrawingSettingsSidebar } from '@/components/drawing/drawing-settings-sidebar'
import { ContentHeader, type BreadcrumbItem } from '@/components/shared/content-header'
import { useDrawing, useUpdateDrawing } from '@/hooks/use-drawings'
import { useSpaces } from '@/hooks/use-spaces'

export function DrawingPage() {
  const { spaceId, drawingId } = useParams<{ spaceId: string; drawingId: string }>()
  const navigate = useNavigate()
  const { data: drawing, isLoading, error } = useDrawing(drawingId)
  const { mutate: updateDrawing } = useUpdateDrawing()
  const { data: spaces = [] } = useSpaces()

  const [isSettingsSidebarOpen, setIsSettingsSidebarOpen] = useState(false)

  // Get current space
  const space = useMemo(() => {
    return spaces.find((s) => s.id === spaceId)
  }, [spaces, spaceId])

  // Build breadcrumbs
  const breadcrumbs: BreadcrumbItem[] = useMemo(() => {
    const crumbs: BreadcrumbItem[] = []
    if (space) {
      crumbs.push({
        label: space.name || 'Space',
        href: `/space/${spaceId}`,
      })
    }
    crumbs.push({
      label: drawing?.name || 'Untitled Drawing',
    })
    return crumbs
  }, [space, spaceId, drawing?.name])

  const handleTitleChange = (newTitle: string) => {
    if (!drawingId) return
    updateDrawing({ drawingId, name: newTitle || 'Untitled Drawing' })
  }

  const handleIconChange = (newIcon: string | null) => {
    if (!drawingId) return
    updateDrawing({ drawingId, icon: newIcon || undefined })
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </MainLayout>
    )
  }

  if (error || !drawing) {
    return (
      <MainLayout>
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="text-muted-foreground">Drawing not found</p>
          <Button variant="outline" onClick={() => navigate(`/space/${spaceId}`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go back
          </Button>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="flex flex-col h-full relative">
        {/* Unified Content Header */}
        <ContentHeader
          title={drawing?.name || ''}
          onTitleChange={handleTitleChange}
          onSettingsClick={() => setIsSettingsSidebarOpen(true)}
          placeholder="Untitled Drawing"
          breadcrumbs={breadcrumbs}
          icon={drawing?.icon}
          defaultIcon="🎨"
          onIconChange={handleIconChange}
          updatedAt={drawing?.updated_at}
        />

        {/* Editor */}
        <div className="flex-1 overflow-hidden">
          <DrawingEditor drawing={drawing} />
        </div>

        {/* Settings Sidebar */}
        <DrawingSettingsSidebar
          isOpen={isSettingsSidebarOpen}
          onClose={() => setIsSettingsSidebarOpen(false)}
          drawing={drawing}
        />
      </div>
    </MainLayout>
  )
}
