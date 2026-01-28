import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Loader2, ArrowLeft } from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { DrawingEditor } from '@/components/drawing/drawing-editor'
import { DrawingSettingsSidebar } from '@/components/drawing/drawing-settings-sidebar'
import { ContentHeader, type BreadcrumbItem } from '@/components/shared/content-header'
import { useDrawing, useUpdateDrawing } from '@/hooks/use-drawings'
import { useSpaces } from '@/hooks/use-spaces'
import type { IconValue } from '@/components/ui/icon-picker'
import { parseStoredIcon, serializeIcon } from '@/lib/utils'

export function DrawingPage() {
  const { t } = useTranslation('drawing')
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
        label: space.name || t('common:untitled'),
        href: `/space/${spaceId}`,
      })
    }
    crumbs.push({
      label: drawing?.name || t('untitledDrawing'),
    })
    return crumbs
  }, [space, spaceId, drawing?.name, t])

  const handleTitleChange = (newTitle: string) => {
    if (!drawingId) return
    updateDrawing({ drawingId, name: newTitle || t('untitledDrawing') })
  }

  const handleIconChange = (newIcon: IconValue) => {
    if (!drawingId) return
    const iconString = serializeIcon(newIcon) || undefined
    updateDrawing({ drawingId, icon: iconString })
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
          <p className="text-muted-foreground">{t('notFound')}</p>
          <Button variant="outline" onClick={() => navigate(`/space/${spaceId}`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('common:goBack')}
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
          placeholder={t('untitledDrawing')}
          breadcrumbs={breadcrumbs}
          icon={parseStoredIcon(drawing?.icon)}
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
