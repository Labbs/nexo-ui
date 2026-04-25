import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { ContentSettingsSidebar } from '@/components/shared/content-settings-sidebar'
import type { DocumentConfig } from '@/api/generated/model'
import type { IconValue } from '@/components/ui/icon-picker'
import { parseStoredIcon } from '@/lib/utils'
import type { Permission, SpacePermission } from '@/components/permissions/permission-manager'
import { useDeleteDocument } from '@/hooks/use-documents'
import { useToggleTemplate } from '@/hooks/use-templates'
import {
  useDocumentPermissions,
  useUpsertDocumentPermission,
  useDeleteDocumentPermission,
} from '@/hooks/use-document-permissions'
import { useSpacePermissions } from '@/hooks/use-space-permissions'
import { useCurrentSpace } from '@/contexts/space-context'
import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/components/ui/toaster'

interface DocumentSettingsSidebarProps {
  isOpen: boolean
  onClose: () => void
  document: {
    id?: string
    space_id?: string
    config?: DocumentConfig
    name?: string
    updated_at?: string
    created_at?: string
    is_template?: boolean
    template_category?: string
  } | null
  isLocked?: boolean
  isFullWidth?: boolean
  onIconChange: (icon: IconValue) => void
  onConfigChange: (config: Partial<{ fullWidth: boolean; lock: boolean }>) => void
  isUpdating?: boolean
}

export function DocumentSettingsSidebar({
  isOpen,
  onClose,
  document,
  isLocked = false,
  isFullWidth = false,
  onIconChange,
  onConfigChange,
  isUpdating = false,
}: DocumentSettingsSidebarProps) {
  const { t } = useTranslation('document')
  const navigate = useNavigate()
  const { spaceId } = useParams<{ spaceId: string }>()
  const { mutateAsync: deleteDocument, isPending: isDeleting } = useDeleteDocument()
  const { mutate: toggleTemplate, isPending: isTogglingTemplate } = useToggleTemplate()
  const { currentSpace } = useCurrentSpace()
  const { user } = useAuth()
  const { show } = useToast()

  const [category, setCategory] = useState(document?.template_category ?? '')

  const documentId = document?.id
  const documentSpaceId = document?.space_id || spaceId
  const isTemplate = document?.is_template ?? false

  const { data: permissions = [], isLoading: permissionsLoading } = useDocumentPermissions(
    documentSpaceId,
    documentId
  )
  const { data: spacePermissionsData } = useSpacePermissions(documentSpaceId)
  const upsertPermission = useUpsertDocumentPermission()
  const deletePermission = useDeleteDocumentPermission()

  const isSpaceAdmin = currentSpace?.my_role === 'owner' || currentSpace?.my_role === 'admin'
  const isDocumentOwnerOrEditor = permissions.some(
    (p) => p.user_id === user?.id && (p.role === 'owner' || p.role === 'editor')
  )
  const canManagePermissions = isSpaceAdmin || isDocumentOwnerOrEditor

  const handleDelete = async () => {
    const docId = document?.id
    const docSpaceId = document?.space_id || spaceId
    if (!docId || !docSpaceId) return
    await deleteDocument({ spaceId: docSpaceId, identifier: docId })
    navigate('/')
  }

  const handleTemplateToggle = (checked: boolean) => {
    if (!documentId || !documentSpaceId) return
    toggleTemplate(
      { spaceId: documentSpaceId, documentId, isTemplate: checked, category: checked ? category : '' },
      {
        onSuccess: () =>
          show({ title: checked ? t('settingsSidebar.templateSaved') : t('settingsSidebar.templateRemoved') }),
      }
    )
  }

  const customSettings = (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">{t('settingsSidebar.settings')}</h3>

      <div className="flex items-center justify-between">
        <Label htmlFor="full-width" className="cursor-pointer">
          {t('settingsSidebar.fullWidth')}
        </Label>
        <Switch
          id="full-width"
          checked={isFullWidth}
          onCheckedChange={(checked) => onConfigChange({ fullWidth: checked })}
          disabled={isUpdating}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="lock" className="cursor-pointer">
          {t('settingsSidebar.lockDocument')}
        </Label>
        <Switch
          id="lock"
          checked={isLocked}
          onCheckedChange={(checked) => onConfigChange({ lock: checked })}
          disabled={isUpdating}
        />
      </div>

      {/* Template */}
      <div className="pt-2 border-t space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="is-template" className="cursor-pointer">
            {isTemplate ? t('settingsSidebar.removeTemplate') : t('settingsSidebar.saveAsTemplate')}
          </Label>
          <Switch
            id="is-template"
            checked={isTemplate}
            onCheckedChange={handleTemplateToggle}
            disabled={isUpdating || isTogglingTemplate}
          />
        </div>

        {isTemplate && (
          <div className="space-y-1">
            <Label htmlFor="template-category" className="text-xs text-muted-foreground">
              {t('settingsSidebar.templateCategory')}
            </Label>
            <Input
              id="template-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              onBlur={() => {
                if (!documentId || !documentSpaceId) return
                toggleTemplate({ spaceId: documentSpaceId, documentId, isTemplate: true, category })
              }}
              placeholder={t('settingsSidebar.templateCategoryPlaceholder')}
              className="h-7 text-sm"
            />
          </div>
        )}
      </div>
    </div>
  )

  return (
    <ContentSettingsSidebar
      contentType="document"
      isOpen={isOpen}
      onClose={onClose}
      name={document?.name}
      icon={parseStoredIcon(document?.config?.icon)}
      createdAt={document?.created_at}
      updatedAt={document?.updated_at}
      onIconChange={onIconChange}
      isIconUpdating={isUpdating}
      customSettings={customSettings}
      permissions={permissions as unknown as Permission[]}
      spacePermissions={spacePermissionsData?.permissions as unknown as SpacePermission[] | undefined}
      canManagePermissions={canManagePermissions}
      permissionsLoading={permissionsLoading}
      supportGroups={false}
      onUpsertUserPermission={(userId, role) => {
        if (documentSpaceId && documentId) {
          upsertPermission.mutate({ spaceId: documentSpaceId, documentId, userId, role: role as 'owner' | 'editor' | 'viewer' | 'denied' })
        }
      }}
      onDeleteUserPermission={(userId) => {
        if (documentSpaceId && documentId) {
          deletePermission.mutate({ spaceId: documentSpaceId, documentId, userId })
        }
      }}
      onDelete={handleDelete}
      isDeleting={isDeleting}
    />
  )
}
