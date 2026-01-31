import { useState } from 'react'
import { useTranslation } from 'react-i18next'
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
import { IconPicker, DocumentIcon, type IconValue } from '@/components/ui/icon-picker'
import { cn } from '@/lib/utils'
import { useDeleteRow } from '@/hooks/use-database'
import { formatDistanceToNow } from 'date-fns'
import { useLanguage } from '@/i18n/LanguageContext'

interface UserInfo {
  id?: string
  username?: string
  avatar_url?: string
}

interface DocumentRowSettingsSidebarProps {
  isOpen: boolean
  onClose: () => void
  databaseId: string
  rowId: string
  rowName?: string
  icon?: IconValue
  isLocked?: boolean
  isFullWidth?: boolean
  updatedAt?: string
  createdAt?: string
  createdByUser?: UserInfo | null
  updatedByUser?: UserInfo | null
  onIconChange: (icon: IconValue) => void
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
  createdByUser,
  updatedByUser,
  onIconChange,
  onConfigChange,
  isUpdating = false,
}: DocumentRowSettingsSidebarProps) {
  const { t } = useTranslation('database')
  const { dateFnsLocale } = useLanguage()
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

  const handleIconChange = (newIcon: IconValue) => {
    onIconChange(newIcon)
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
            <h2 className="font-semibold">{t('rowSettings.title')}</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Icon selector */}
            <div>
              <h3 className="text-sm font-medium mb-2">{t('rowSettings.icon')}</h3>
              <IconPicker value={icon} onChange={handleIconChange}>
                <button
                  className="flex items-center gap-2 px-3 py-2 rounded-md border hover:bg-accent transition-colors w-full"
                  disabled={isUpdating}
                >
                  <DocumentIcon value={icon} size="lg" />
                  <span className="text-sm text-muted-foreground">{t('rowSettings.changeIcon')}</span>
                </button>
              </IconPicker>
            </div>

            <Separator />

            {/* Document settings */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">{t('rowSettings.settings')}</h3>

              {/* Full width toggle */}
              <div className="flex items-center justify-between">
                <Label htmlFor="full-width" className="cursor-pointer">
                  {t('rowSettings.fullWidth')}
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
                  {t('rowSettings.lockDocument')}
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
              <h3 className="text-sm font-medium">{t('rowSettings.information')}</h3>
              <div className="space-y-1.5 text-sm text-muted-foreground">
                {updatedAt ? (
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5" />
                    <span>
                      {t('rowSettings.edited', { time: formatDistanceToNow(new Date(updatedAt), { addSuffix: true, locale: dateFnsLocale }) })}
                      {(updatedByUser?.username || createdByUser?.username) && ` ${t('rowSettings.by', { name: updatedByUser?.username || createdByUser?.username })}`}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{t('rowSettings.noEditDate')}</span>
                  </div>
                )}
                {createdAt ? (
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5" />
                    <span>
                      {t('rowSettings.created', { time: formatDistanceToNow(new Date(createdAt), { addSuffix: true, locale: dateFnsLocale }) })}
                      {createdByUser?.username && ` ${t('rowSettings.by', { name: createdByUser.username })}`}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{t('rowSettings.noCreationDate')}</span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Actions */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-destructive">{t('rowSettings.dangerZone')}</h3>
              <Button
                variant="outline"
                className="w-full justify-start border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {t('rowSettings.deleteDocument')}
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
                {t('rowSettings.deleteTitle')}
              </DialogTitle>
              <DialogDescription className="pt-2">
                {t('rowSettings.deleteConfirm', { name: rowName || t('common:untitled') })}
                <br />
                <span className="text-destructive">{t('common:cannotBeUndone')}</span>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0 mt-4">
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
                disabled={deleteRow.isPending}
              >
                {t('common:cancel')}
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleDelete}
                disabled={deleteRow.isPending}
              >
                {deleteRow.isPending ? t('common:deleting') : t('common:delete')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
