import { useState } from 'react'
import { User, Users, Plus, X, Ban } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { useTranslation } from 'react-i18next'

export interface Permission {
  id: string
  user_id?: string
  username?: string
  group_id?: string
  group_name?: string
  role: 'owner' | 'editor' | 'viewer' | 'denied'
}

export interface SpacePermission {
  id: string
  user_id?: string
  username?: string
  group_id?: string
  group_name?: string
  role: string
}

interface PermissionManagerProps {
  permissions: Permission[]
  spacePermissions?: SpacePermission[]
  canManage: boolean
  isLoading?: boolean
  onUpsertUser?: (userId: string, role: 'owner' | 'editor' | 'viewer' | 'denied') => void
  onUpsertGroup?: (groupId: string, role: 'owner' | 'editor' | 'viewer' | 'denied') => void
  onDeleteUser?: (userId: string) => void
  onDeleteGroup?: (groupId: string) => void
  supportGroups?: boolean
  /** User ID to exclude from display and actions (e.g., space owner in personal spaces) */
  excludeUserId?: string
}

export function PermissionManager({
  permissions,
  spacePermissions = [],
  canManage,
  isLoading,
  onUpsertUser,
  onUpsertGroup,
  onDeleteUser,
  onDeleteGroup,
  supportGroups = true,
  excludeUserId,
}: PermissionManagerProps) {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [permissionType, setPermissionType] = useState<'user' | 'group'>('user')
  const [selectedUserId, setSelectedUserId] = useState('')
  const [selectedGroupId, setSelectedGroupId] = useState('')
  const [selectedRole, setSelectedRole] = useState<'owner' | 'editor' | 'viewer'>('viewer')

  const { t } = useTranslation('document')

  // Filter out excluded user from permissions display
  const filteredPermissions = excludeUserId
    ? permissions.filter((p) => p.user_id !== excludeUserId)
    : permissions

  const filteredSpacePermissions = excludeUserId
    ? spacePermissions.filter((sp) => sp.user_id !== excludeUserId)
    : spacePermissions

  // Get available users/groups from space permissions (users who have access to the space)
  // Filter out those already in explicit permissions
  const availableUsers = filteredSpacePermissions
    .filter((sp) => sp.user_id && !filteredPermissions.some((p) => p.user_id === sp.user_id))
    .map((sp) => ({ id: sp.user_id!, username: sp.username || t('common:unknownUser') }))

  const availableGroups = spacePermissions
    .filter((sp) => sp.group_id && !permissions.some((p) => p.group_id === sp.group_id))
    .map((sp) => ({ id: sp.group_id!, name: sp.group_name || t('common:unknownGroup') }))

  // Inherited permissions (from space) that don't have explicit override
  const inheritedPermissions = filteredSpacePermissions.filter((sp) => {
    if (sp.user_id) {
      return !filteredPermissions.some((p) => p.user_id === sp.user_id)
    }
    if (sp.group_id) {
      return !filteredPermissions.some((p) => p.group_id === sp.group_id)
    }
    return false
  })

  const handleAdd = () => {
    if (permissionType === 'user' && selectedUserId && onUpsertUser) {
      onUpsertUser(selectedUserId, selectedRole)
    } else if (permissionType === 'group' && selectedGroupId && onUpsertGroup) {
      onUpsertGroup(selectedGroupId, selectedRole)
    }
    setIsAddOpen(false)
    resetForm()
  }

  const handleBlock = (sp: SpacePermission) => {
    if (sp.user_id && onUpsertUser) {
      onUpsertUser(sp.user_id, 'denied')
    } else if (sp.group_id && onUpsertGroup) {
      onUpsertGroup(sp.group_id, 'denied')
    }
  }

  const resetForm = () => {
    setPermissionType('user')
    setSelectedUserId('')
    setSelectedGroupId('')
    setSelectedRole('viewer')
  }

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">{t('permissions.loading')}</p>
  }

  const hasExplicitPermissions = filteredPermissions.length > 0
  const hasInheritedPermissions = inheritedPermissions.length > 0

  return (
    <div className="space-y-4">
      {/* Header with Add button */}
      {canManage && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{t('permissions.title')}</span>
          <Button variant="outline" size="sm" onClick={() => setIsAddOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />
            {t('permissions.add')}
          </Button>
        </div>
      )}

      {/* Explicit permissions */}
      {hasExplicitPermissions && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{t('permissions.explicit')}</p>
          {filteredPermissions.map((perm) => (
            <PermissionRow
              key={perm.id}
              permission={perm}
              canManage={canManage}
              onRoleChange={(role) => {
                if (perm.user_id && onUpsertUser) {
                  onUpsertUser(perm.user_id, role)
                } else if (perm.group_id && onUpsertGroup) {
                  onUpsertGroup(perm.group_id, role)
                }
              }}
              onDelete={() => {
                if (perm.user_id && onDeleteUser) {
                  onDeleteUser(perm.user_id)
                } else if (perm.group_id && onDeleteGroup) {
                  onDeleteGroup(perm.group_id)
                }
              }}
            />
          ))}
        </div>
      )}

      {/* Inherited permissions from space */}
      {hasInheritedPermissions && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{t('permissions.inheritedFromSpace')}</p>
          {inheritedPermissions.map((perm) => (
            <div
              key={perm.id}
              className="flex items-center justify-between py-2 px-3 rounded-md bg-muted/30"
            >
              <div className="flex items-center gap-3">
                {perm.user_id ? (
                  <>
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm">{perm.username || t('common:unknownUser')}</p>
                      <p className="text-xs text-muted-foreground">{t('common:types.user')}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm">{perm.group_name || t('common:unknownGroup')}</p>
                      <p className="text-xs text-muted-foreground">{t('common:types.group')}</p>
                    </div>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground capitalize">{perm.role}</span>
                {canManage && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-muted-foreground hover:text-destructive"
                    onClick={() => handleBlock(perm)}
                    title={t('permissions.blockAccess')}
                  >
                    <Ban className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!hasExplicitPermissions && !hasInheritedPermissions && (
        <p className="text-sm text-muted-foreground text-center py-4">
          {t('permissions.noPermissions')}
        </p>
      )}

      {/* Add Permission Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('permissions.addTitle')}</DialogTitle>
            <DialogDescription>
              {t('permissions.addDescription')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {supportGroups && (
              <div className="space-y-2">
                <Label>{t('permissions.typeLabel')}</Label>
                <Select
                  value={permissionType}
                  onValueChange={(v: 'user' | 'group') => setPermissionType(v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">{t('common:types.user')}</SelectItem>
                    <SelectItem value="group">{t('common:types.group')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {permissionType === 'user' && (
              <div className="space-y-2">
                <Label>{t('permissions.userLabel')}</Label>
                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('permissions.selectUserPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.username}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {permissionType === 'group' && supportGroups && (
              <div className="space-y-2">
                <Label>{t('permissions.groupLabel')}</Label>
                <Select value={selectedGroupId} onValueChange={setSelectedGroupId}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('permissions.selectGroupPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableGroups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label>{t('permissions.roleLabel')}</Label>
              <Select
                value={selectedRole}
                onValueChange={(v: 'owner' | 'editor' | 'viewer') => setSelectedRole(v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">{t('common:roles.viewer')}</SelectItem>
                  <SelectItem value="editor">{t('common:roles.editor')}</SelectItem>
                  <SelectItem value="owner">{t('common:roles.owner')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
              {t('common:cancel')}
            </Button>
            <Button
              onClick={handleAdd}
              disabled={
                (permissionType === 'user' && !selectedUserId) ||
                (permissionType === 'group' && !selectedGroupId)
              }
            >
              {t('permissions.addButton')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface PermissionRowProps {
  permission: Permission
  canManage: boolean
  onRoleChange: (role: 'owner' | 'editor' | 'viewer' | 'denied') => void
  onDelete: () => void
}

function PermissionRow({ permission, canManage, onRoleChange, onDelete }: PermissionRowProps) {
  const isDenied = permission.role === 'denied'
  const isOwner = permission.role === 'owner'

  const { t } = useTranslation('document')

  return (
    <div
      className={`flex items-center justify-between py-2 px-3 rounded-md ${
        isDenied ? 'bg-destructive/10' : isOwner ? 'bg-primary/10' : 'bg-muted/50'
      }`}
    >
      <div className="flex items-center gap-3">
        {permission.user_id ? (
          <>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium">{permission.username || t('common:unknownUser')}</p>
              <p className="text-xs text-muted-foreground">{t('common:types.user')}</p>
            </div>
          </>
        ) : (
          <>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium">{permission.group_name || t('common:unknownGroup')}</p>
              <p className="text-xs text-muted-foreground">{t('common:types.group')}</p>
            </div>
          </>
        )}
      </div>
      <div className="flex items-center gap-2">
        {canManage ? (
          <>
            <Select
              value={permission.role}
              onValueChange={(v: 'owner' | 'editor' | 'viewer' | 'denied') => onRoleChange(v)}
            >
              <SelectTrigger className="w-28 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="viewer">{t('common:roles.viewer')}</SelectItem>
                <SelectItem value="editor">{t('common:roles.editor')}</SelectItem>
                <SelectItem value="owner">{t('common:roles.owner')}</SelectItem>
                <SelectItem value="denied">{t('common:roles.blocked')}</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={onDelete}
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <span className={`text-sm capitalize ${isDenied ? 'text-destructive' : ''}`}>
            {isDenied ? t('common:roles.blocked') : permission.role}
          </span>
        )}
      </div>
    </div>
  )
}
