import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FolderOpen, Plus, Trash2, Pencil, User, Users, ChevronDown, UserPlus, UserMinus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  useAdminSpaces,
  useCreateAdminSpace,
  useUpdateAdminSpace,
  useDeleteAdminSpace,
  useAdminSpacePermissions,
  useAddSpaceUserPermission,
  useRemoveSpaceUserPermission,
  useAddSpaceGroupPermission,
  useRemoveSpaceGroupPermission,
  useAdminUsers,
  useAdminGroups,
  type AdminSpace,
} from '@/hooks/use-admin'
import { formatDistanceToNow } from 'date-fns'
import { useLanguage } from '@/i18n/LanguageContext'

export function SpacesManagement() {
  const { t } = useTranslation('admin')
  const { data, isLoading } = useAdminSpaces()
  const { data: usersData } = useAdminUsers()
  const { data: groupsData } = useAdminGroups()
  const createSpace = useCreateAdminSpace()
  const updateSpace = useUpdateAdminSpace()
  const deleteSpace = useDeleteAdminSpace()
  const addUserPermission = useAddSpaceUserPermission()
  const removeUserPermission = useRemoveSpaceUserPermission()
  const addGroupPermission = useAddSpaceGroupPermission()
  const removeGroupPermission = useRemoveSpaceGroupPermission()

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isAddPermissionOpen, setIsAddPermissionOpen] = useState(false)
  const [selectedSpace, setSelectedSpace] = useState<AdminSpace | null>(null)
  const [spaceToDelete, setSpaceToDelete] = useState<AdminSpace | null>(null)
  const [expandedSpaces, setExpandedSpaces] = useState<Set<string>>(new Set())
  const [personalSpacesCollapsed, setPersonalSpacesCollapsed] = useState(true)

  // Form state
  const [formName, setFormName] = useState('')
  const [formIcon, setFormIcon] = useState('')
  const [formType, setFormType] = useState('public')
  const [formOwnerId, setFormOwnerId] = useState<string>('')

  // Permission form state
  const [permissionType, setPermissionType] = useState<'user' | 'group'>('user')
  const [selectedUserId, setSelectedUserId] = useState('')
  const [selectedGroupId, setSelectedGroupId] = useState('')
  const [selectedRole, setSelectedRole] = useState('viewer')

  // Fetch permissions for selected space
  const { data: permissionsData } = useAdminSpacePermissions(
    expandedSpaces.size > 0 ? Array.from(expandedSpaces)[0] : null
  )

  const handleCreate = async () => {
    if (!formName) return
    await createSpace.mutateAsync({
      name: formName,
      icon: formIcon,
      type: formType,
      ownerId: formOwnerId || null
    })
    setIsCreateOpen(false)
    resetForm()
  }

  const handleEdit = async () => {
    if (!selectedSpace || !formName) return
    await updateSpace.mutateAsync({
      spaceId: selectedSpace.id,
      name: formName,
      icon: formIcon,
      type: formType,
      ownerId: formOwnerId || null
    })
    setIsEditOpen(false)
    setSelectedSpace(null)
    resetForm()
  }

  const handleDelete = async () => {
    if (!spaceToDelete) return
    await deleteSpace.mutateAsync(spaceToDelete.id)
    setSpaceToDelete(null)
  }

  const handleAddPermission = async () => {
    if (!selectedSpace) return
    if (permissionType === 'user' && selectedUserId) {
      await addUserPermission.mutateAsync({
        spaceId: selectedSpace.id,
        userId: selectedUserId,
        role: selectedRole
      })
    } else if (permissionType === 'group' && selectedGroupId) {
      await addGroupPermission.mutateAsync({
        spaceId: selectedSpace.id,
        groupId: selectedGroupId,
        role: selectedRole
      })
    }
    setIsAddPermissionOpen(false)
    resetPermissionForm()
  }

  const handleRemoveUserPermission = async (spaceId: string, userId: string) => {
    await removeUserPermission.mutateAsync({ spaceId, userId })
  }

  const handleRemoveGroupPermission = async (spaceId: string, groupId: string) => {
    await removeGroupPermission.mutateAsync({ spaceId, groupId })
  }

  const handleUpdateUserRole = async (spaceId: string, userId: string, role: string) => {
    await addUserPermission.mutateAsync({ spaceId, userId, role })
  }

  const handleUpdateGroupRole = async (spaceId: string, groupId: string, role: string) => {
    await addGroupPermission.mutateAsync({ spaceId, groupId, role })
  }

  const openEditDialog = (space: AdminSpace) => {
    setSelectedSpace(space)
    setFormName(space.name)
    setFormIcon(space.icon || '')
    setFormType(space.type)
    setFormOwnerId(space.owner_id || '')
    setIsEditOpen(true)
  }

  const openAddPermissionDialog = (space: AdminSpace) => {
    setSelectedSpace(space)
    resetPermissionForm()
    setIsAddPermissionOpen(true)
  }

  const resetForm = () => {
    setFormName('')
    setFormIcon('')
    setFormType('public')
    setFormOwnerId('')
  }

  const resetPermissionForm = () => {
    setPermissionType('user')
    setSelectedUserId('')
    setSelectedGroupId('')
    setSelectedRole('viewer')
  }

  const toggleExpanded = (spaceId: string) => {
    const newExpanded = new Set(expandedSpaces)
    if (newExpanded.has(spaceId)) {
      newExpanded.delete(spaceId)
    } else {
      newExpanded.clear() // Only one expanded at a time for permissions fetch
      newExpanded.add(spaceId)
    }
    setExpandedSpaces(newExpanded)
  }

  // Get users not already in the selected space's permissions
  const availableUsers = usersData?.users.filter(
    user => !permissionsData?.permissions?.some(p => p.user_id === user.id)
  ) || []

  // Get groups not already in the selected space's permissions
  const availableGroups = groupsData?.groups.filter(
    group => !permissionsData?.permissions?.some(p => p.group_id === group.id)
  ) || []

  if (isLoading) {
    return <div className="p-4">{t('spaces.loading')}</div>
  }

  const spaces = data?.spaces || []
  const regularSpaces = spaces.filter(s => s.type !== 'personal')
  const personalSpaces = spaces.filter(s => s.type === 'personal')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">{t('spaces.title')}</h3>
          <p className="text-sm text-muted-foreground">
            {t('spaces.description')}
          </p>
        </div>
        <Button onClick={() => { resetForm(); setIsCreateOpen(true) }}>
          <Plus className="mr-2 h-4 w-4" />
          {t('spaces.createButton')}
        </Button>
      </div>

      {spaces.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <FolderOpen className="h-10 w-10 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">{t('spaces.empty')}</p>
            <p className="text-sm text-muted-foreground mt-2">
              {t('spaces.emptyHint')}
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Regular Spaces Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground">{t('spaces.spacesCount', { count: regularSpaces.length })}</h4>
            {regularSpaces.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('spaces.noSpaces')}</p>
            ) : (
              regularSpaces.map(space => (
                <SpaceCard
                  key={space.id}
                  space={space}
                  isExpanded={expandedSpaces.has(space.id)}
                  onToggleExpand={() => toggleExpanded(space.id)}
                  onEdit={() => openEditDialog(space)}
                  onDelete={() => setSpaceToDelete(space)}
                  onAddPermission={() => openAddPermissionDialog(space)}
                  onRemoveUserPermission={handleRemoveUserPermission}
                  onRemoveGroupPermission={handleRemoveGroupPermission}
                  onUpdateUserRole={handleUpdateUserRole}
                  onUpdateGroupRole={handleUpdateGroupRole}
                />
              ))
            )}
          </div>

          {/* Personal Spaces Section */}
          {personalSpaces.length > 0 && (
            <Collapsible open={!personalSpacesCollapsed} onOpenChange={(open) => setPersonalSpacesCollapsed(!open)}>
              <div className="border rounded-lg">
                <CollapsibleTrigger asChild>
                  <button className="flex items-center justify-between w-full p-4 hover:bg-muted/50 transition-colors">
                    <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {t('spaces.personalSpacesCount', { count: personalSpaces.length })}
                    </h4>
                    <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${!personalSpacesCollapsed ? 'rotate-180' : ''}`} />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-4 pt-0 space-y-4">
                    {personalSpaces.map(space => (
                      <SpaceCard
                        key={space.id}
                        space={space}
                        isExpanded={expandedSpaces.has(space.id)}
                        onToggleExpand={() => toggleExpanded(space.id)}
                        onEdit={() => openEditDialog(space)}
                        onDelete={() => setSpaceToDelete(space)}
                        onAddPermission={() => openAddPermissionDialog(space)}
                        onRemoveUserPermission={handleRemoveUserPermission}
                        onRemoveGroupPermission={handleRemoveGroupPermission}
                        onUpdateUserRole={handleUpdateUserRole}
                        onUpdateGroupRole={handleUpdateGroupRole}
                      />
                    ))}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          )}
        </>
      )}

      {/* Create Space Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('spaces.createTitle')}</DialogTitle>
            <DialogDescription>
              {t('spaces.createDescription')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('spaces.nameLabel')}</Label>
              <Input
                id="name"
                placeholder={t('spaces.namePlaceholder')}
                value={formName}
                onChange={e => setFormName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="icon">{t('spaces.iconLabel')}</Label>
              <Input
                id="icon"
                placeholder="📁"
                value={formIcon}
                onChange={e => setFormIcon(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('spaces.typeLabel')}</Label>
              <Select value={formType} onValueChange={setFormType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">{t('spaces.typePublic')}</SelectItem>
                  <SelectItem value="private">{t('spaces.typePrivate')}</SelectItem>
                  <SelectItem value="restricted">{t('spaces.typeRestricted')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t('spaces.ownerLabel')}</Label>
              <Select value={formOwnerId || '__none__'} onValueChange={(v) => setFormOwnerId(v === '__none__' ? '' : v)}>
                <SelectTrigger>
                  <SelectValue placeholder={t('spaces.ownerNone')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">{t('spaces.ownerNone')}</SelectItem>
                  {usersData?.users.map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.username} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              {t('common:cancel')}
            </Button>
            <Button onClick={handleCreate} disabled={!formName || createSpace.isPending}>
              {createSpace.isPending ? t('spaces.creating') : t('spaces.createSubmit')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Space Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('spaces.editTitle')}</DialogTitle>
            <DialogDescription>
              {t('spaces.editDescription')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">{t('spaces.nameLabel')}</Label>
              <Input
                id="edit-name"
                placeholder={t('spaces.namePlaceholder')}
                value={formName}
                onChange={e => setFormName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-icon">{t('spaces.iconLabel')}</Label>
              <Input
                id="edit-icon"
                placeholder="📁"
                value={formIcon}
                onChange={e => setFormIcon(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('spaces.typeLabel')}</Label>
              <Select value={formType} onValueChange={setFormType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">{t('spaces.typePublic')}</SelectItem>
                  <SelectItem value="private">{t('spaces.typePrivate')}</SelectItem>
                  <SelectItem value="restricted">{t('spaces.typeRestricted')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t('spaces.ownerLabel')}</Label>
              <Select value={formOwnerId || '__none__'} onValueChange={(v) => setFormOwnerId(v === '__none__' ? '' : v)}>
                <SelectTrigger>
                  <SelectValue placeholder={t('spaces.ownerNone')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">{t('spaces.ownerNone')}</SelectItem>
                  {usersData?.users.map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.username} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              {t('common:cancel')}
            </Button>
            <Button onClick={handleEdit} disabled={!formName || updateSpace.isPending}>
              {updateSpace.isPending ? t('spaces.saving') : t('spaces.saveSubmit')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Permission Dialog */}
      <Dialog open={isAddPermissionOpen} onOpenChange={setIsAddPermissionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('spaces.addPermissionTitle')}</DialogTitle>
            <DialogDescription>
              {t('spaces.addPermissionDescription', { name: selectedSpace?.name })}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>{t('spaces.permissionTypeLabel')}</Label>
              <Select value={permissionType} onValueChange={(v) => setPermissionType(v as 'user' | 'group')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">{t('common:types.user')}</SelectItem>
                  <SelectItem value="group">{t('spaces.permissionTypeGroup')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {permissionType === 'user' ? (
              <div className="space-y-2">
                <Label>{t('spaces.selectUserLabel')}</Label>
                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('spaces.selectUserPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableUsers.map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.username} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="space-y-2">
                <Label>{t('spaces.selectGroupLabel')}</Label>
                <Select value={selectedGroupId} onValueChange={setSelectedGroupId}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('spaces.selectGroupPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableGroups.map(group => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label>{t('spaces.roleLabel')}</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">{t('common:roles.viewer')}</SelectItem>
                  <SelectItem value="editor">{t('common:roles.editor')}</SelectItem>
                  <SelectItem value="admin">{t('common:roles.admin')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddPermissionOpen(false)}>
              {t('common:cancel')}
            </Button>
            <Button
              onClick={handleAddPermission}
              disabled={
                (permissionType === 'user' && !selectedUserId) ||
                (permissionType === 'group' && !selectedGroupId) ||
                addUserPermission.isPending ||
                addGroupPermission.isPending
              }
            >
              {addUserPermission.isPending || addGroupPermission.isPending ? t('spaces.adding') : t('spaces.addPermissionSubmit')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!spaceToDelete} onOpenChange={() => setSpaceToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('spaces.deleteTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('spaces.deleteConfirm', { name: spaceToDelete?.name })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common:cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('spaces.deleteSubmit')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// Sub-component for space card
function SpaceCard({
  space,
  isExpanded,
  onToggleExpand,
  onEdit,
  onDelete,
  onAddPermission,
  onRemoveUserPermission,
  onRemoveGroupPermission,
  onUpdateUserRole,
  onUpdateGroupRole
}: {
  space: AdminSpace
  isExpanded: boolean
  onToggleExpand: () => void
  onEdit: () => void
  onDelete: () => void
  onAddPermission: () => void
  onRemoveUserPermission: (spaceId: string, userId: string) => void
  onRemoveGroupPermission: (spaceId: string, groupId: string) => void
  onUpdateUserRole: (spaceId: string, userId: string, role: string) => void
  onUpdateGroupRole: (spaceId: string, groupId: string, role: string) => void
}) {
  const { t } = useTranslation('admin')
  const { dateFnsLocale } = useLanguage()

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggleExpand}>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-xl">
                {space.icon || '📁'}
              </div>
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  {space.name}
                  <Badge variant="outline" className="text-xs">
                    {space.type}
                  </Badge>
                </CardTitle>
                <div className="flex items-center gap-2 mt-0.5">
                  {space.description && (
                    <CardDescription className="mt-0">{space.description}</CardDescription>
                  )}
                  {space.owner_name && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {space.owner_name}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => { e.stopPropagation(); onAddPermission() }}
                title={t('spaces.addPermissionTooltip')}
              >
                <UserPlus className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => { e.stopPropagation(); onEdit() }}
                title={t('spaces.editSpaceTooltip')}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive"
                onClick={(e) => { e.stopPropagation(); onDelete() }}
                title={t('spaces.deleteSpaceTooltip')}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="icon">
                  <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium">{t('spaces.permissionsSection')}</h4>
              </div>
              <SpacePermissionsList
                spaceId={space.id}
                onRemoveUser={onRemoveUserPermission}
                onRemoveGroup={onRemoveGroupPermission}
                onUpdateUserRole={onUpdateUserRole}
                onUpdateGroupRole={onUpdateGroupRole}
              />
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-4 pt-4 border-t">
              <span>
                {t('spaces.createdLabel')}{formatDistanceToNow(new Date(space.created_at), { addSuffix: true, locale: dateFnsLocale })}
              </span>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}

// Sub-component for permissions list
function SpacePermissionsList({
  spaceId,
  onRemoveUser,
  onRemoveGroup,
  onUpdateUserRole,
  onUpdateGroupRole
}: {
  spaceId: string
  onRemoveUser: (spaceId: string, userId: string) => void
  onRemoveGroup: (spaceId: string, groupId: string) => void
  onUpdateUserRole: (spaceId: string, userId: string, role: string) => void
  onUpdateGroupRole: (spaceId: string, groupId: string, role: string) => void
}) {
  const { t } = useTranslation('admin')
  const { data, isLoading } = useAdminSpacePermissions(spaceId)

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">{t('spaces.loadingPermissions')}</p>
  }

  const permissions = data?.permissions || []

  if (permissions.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        {t('spaces.noPermissions')}
      </p>
    )
  }

  return (
    <div className="space-y-2">
      {permissions.map(perm => (
        <div key={perm.id} className="flex items-center justify-between py-2 px-3 rounded-md bg-muted/50">
          <div className="flex items-center gap-3">
            {perm.user_id ? (
              <>
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">{perm.username || t('common:unknownUser')}</p>
                  <p className="text-xs text-muted-foreground">{t('common:types.user')}</p>
                </div>
              </>
            ) : (
              <>
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">{perm.group_name || t('common:unknownGroup')}</p>
                  <p className="text-xs text-muted-foreground">{t('spaces.permissionTypeGroup')}</p>
                </div>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={perm.role}
              onValueChange={(newRole) => {
                if (perm.user_id) {
                  onUpdateUserRole(spaceId, perm.user_id, newRole)
                } else if (perm.group_id) {
                  onUpdateGroupRole(spaceId, perm.group_id, newRole)
                }
              }}
            >
              <SelectTrigger className="w-28 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="viewer">{t('common:roles.viewer')}</SelectItem>
                <SelectItem value="editor">{t('common:roles.editor')}</SelectItem>
                <SelectItem value="admin">{t('common:roles.admin')}</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => {
                if (perm.user_id) {
                  onRemoveUser(spaceId, perm.user_id)
                } else if (perm.group_id) {
                  onRemoveGroup(spaceId, perm.group_id)
                }
              }}
              title={t('spaces.removePermissionTooltip')}
            >
              <UserMinus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
