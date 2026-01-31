import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
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
import { IconPicker, DocumentIcon, type IconValue } from '@/components/ui/icon-picker'
import { PermissionManager, type Permission, type SpacePermission } from '@/components/permissions/permission-manager'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { useLanguage } from '@/i18n/LanguageContext'
import type { TFunction } from 'i18next'

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
  icon?: IconValue
  description?: string
  createdAt?: string | unknown
  updatedAt?: string | unknown
  createdBy?: string

  // Icon management
  onIconChange?: (icon: IconValue) => void
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

function getContentTypeLabels(t: TFunction): Record<ContentType, { title: string; deleteLabel: string; defaultName: string }> {
  return {
    document: {
      title: t('settingsSidebar.contentTypes.document.title'),
      deleteLabel: t('settingsSidebar.contentTypes.document.deleteLabel'),
      defaultName: t('settingsSidebar.contentTypes.document.defaultName'),
    },
    database: {
      title: t('settingsSidebar.contentTypes.database.title'),
      deleteLabel: t('settingsSidebar.contentTypes.database.deleteLabel'),
      defaultName: t('settingsSidebar.contentTypes.database.defaultName'),
    },
    drawing: {
      title: t('settingsSidebar.contentTypes.drawing.title'),
      deleteLabel: t('settingsSidebar.contentTypes.drawing.deleteLabel'),
      defaultName: t('settingsSidebar.contentTypes.drawing.defaultName'),
    },
  }
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
  const { t } = useTranslation('document')
  const { dateFnsLocale } = useLanguage()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const contentTypeLabels = getContentTypeLabels(t)
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
                <h3 className="text-sm font-medium mb-2">{t('settingsSidebar.icon')}</h3>
                <IconPicker value={icon} onChange={onIconChange}>
                  <button
                    className="flex items-center gap-2 px-3 py-2 rounded-md border hover:bg-accent transition-colors w-full"
                    disabled={isIconUpdating}
                  >
                    <DocumentIcon value={icon} size="lg" />
                    <span className="text-sm text-muted-foreground">{t('settingsSidebar.changeIcon')}</span>
                  </button>
                </IconPicker>
              </div>
              <Separator />
            </>
          )}

          {/* Description (for database) */}
          {description && (
            <>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">{t('settingsSidebar.description')}</h3>
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
            <h3 className="text-sm font-medium">{t('settingsSidebar.information')}</h3>
            <div className="space-y-1.5 text-sm text-muted-foreground">
              {parsedUpdatedAt ? (
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{t('settingsSidebar.edited', { time: formatDistanceToNow(parsedUpdatedAt, { addSuffix: true, locale: dateFnsLocale }) })}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{t('common:noEditDate')}</span>
                </div>
              )}
              {parsedCreatedAt ? (
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{t('settingsSidebar.created', { time: formatDistanceToNow(parsedCreatedAt, { addSuffix: true, locale: dateFnsLocale }) })}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{t('common:noCreationDate')}</span>
                </div>
              )}
              {createdBy && (
                <div className="flex items-center gap-2">
                  <span className="text-xs">{t('settingsSidebar.createdBy', { name: createdBy })}</span>
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
            <h3 className="text-sm font-medium text-destructive">{t('settingsSidebar.dangerZone')}</h3>
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
              {t('settingsSidebar.deleteContentType', { type: contentType })}
            </DialogTitle>
            <DialogDescription className="pt-2">
              {t('settingsSidebar.deleteConfirm', { name: name || labels.defaultName })}
              <br />
              <span className="text-destructive">
                {deleteWarning || t('common:cannotBeUndone')}
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              {t('common:cancel')}
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? t('common:deleting') : t('common:delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
