import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Users, Plus, Trash2, UserPlus, UserMinus, Pencil, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
  useAdminGroups,
  useCreateGroup,
  useUpdateGroup,
  useDeleteGroup,
  useAddGroupMember,
  useRemoveGroupMember,
  useAdminUsers,
  type AdminGroup,
} from '@/hooks/use-admin'
import { formatDistanceToNow } from 'date-fns'
import { useLanguage } from '@/i18n/LanguageContext'
import { ChevronDown } from 'lucide-react'

export function GroupsManagement() {
  const { t } = useTranslation('admin')
  const { dateFnsLocale } = useLanguage()
  const { data, isLoading } = useAdminGroups()
  const { data: usersData } = useAdminUsers()
  const createGroup = useCreateGroup()
  const updateGroup = useUpdateGroup()
  const deleteGroup = useDeleteGroup()
  const addMember = useAddGroupMember()
  const removeMember = useRemoveGroupMember()

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<AdminGroup | null>(null)
  const [groupToDelete, setGroupToDelete] = useState<AdminGroup | null>(null)
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())

  // Form state
  const [formName, setFormName] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formRole, setFormRole] = useState('user')
  const [selectedUserId, setSelectedUserId] = useState('')

  const handleCreate = async () => {
    if (!formName) return
    await createGroup.mutateAsync({ name: formName, description: formDescription, role: formRole })
    setIsCreateOpen(false)
    resetForm()
  }

  const handleEdit = async () => {
    if (!selectedGroup || !formName) return
    await updateGroup.mutateAsync({
      groupId: selectedGroup.id,
      name: formName,
      description: formDescription,
      role: formRole,
    })
    setIsEditOpen(false)
    setSelectedGroup(null)
    resetForm()
  }

  const handleDelete = async () => {
    if (!groupToDelete) return
    await deleteGroup.mutateAsync(groupToDelete.id)
    setGroupToDelete(null)
  }

  const handleAddMember = async () => {
    if (!selectedGroup || !selectedUserId) return
    await addMember.mutateAsync({ groupId: selectedGroup.id, userId: selectedUserId })
    setIsAddMemberOpen(false)
    setSelectedUserId('')
  }

  const handleRemoveMember = async (groupId: string, userId: string) => {
    await removeMember.mutateAsync({ groupId, userId })
  }

  const openEditDialog = (group: AdminGroup) => {
    setSelectedGroup(group)
    setFormName(group.name)
    setFormDescription(group.description)
    setFormRole(group.role)
    setIsEditOpen(true)
  }

  const openAddMemberDialog = (group: AdminGroup) => {
    setSelectedGroup(group)
    setSelectedUserId('')
    setIsAddMemberOpen(true)
  }

  const resetForm = () => {
    setFormName('')
    setFormDescription('')
    setFormRole('user')
  }

  const toggleExpanded = (groupId: string) => {
    const newExpanded = new Set(expandedGroups)
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId)
    } else {
      newExpanded.add(groupId)
    }
    setExpandedGroups(newExpanded)
  }

  // Get users not already in the selected group
  const availableUsers = (usersData?.users ?? []).filter(
    (user) => !selectedGroup?.members?.some(m => m.id === user.id)
  )

  if (isLoading) {
    return <div className="p-4">{t('groups.loading')}</div>
  }

  const groups = data?.groups || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">{t('groups.title')}</h3>
          <p className="text-sm text-muted-foreground">
            {t('groups.description')}
          </p>
        </div>
        <Button onClick={() => { resetForm(); setIsCreateOpen(true) }}>
          <Plus className="mr-2 h-4 w-4" />
          {t('groups.createButton')}
        </Button>
      </div>

      <div className="space-y-4">
        {groups.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <Users className="h-10 w-10 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">{t('groups.empty')}</p>
              <p className="text-sm text-muted-foreground mt-2">
                {t('groups.emptyHint')}
              </p>
            </CardContent>
          </Card>
        ) : (
          groups.map(group => (
            <Collapsible
              key={group.id}
              open={expandedGroups.has(group.id)}
              onOpenChange={() => toggleExpanded(group.id)}
            >
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                        <Users className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-base flex items-center gap-2">
                          {group.name}
                          <Badge variant="outline" className="text-xs">
                            {group.role}
                          </Badge>
                        </CardTitle>
                        {group.description && (
                          <CardDescription className="mt-0.5">{group.description}</CardDescription>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openAddMemberDialog(group)}
                        title={t('groups.addMemberTooltip')}
                      >
                        <UserPlus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(group)}
                        title={t('groups.editGroupTooltip')}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setGroupToDelete(group)}
                        title={t('groups.deleteGroupTooltip')}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <ChevronDown className={`h-4 w-4 transition-transform ${expandedGroups.has(group.id) ? 'rotate-180' : ''}`} />
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                  </div>
                </CardHeader>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium">{t('groups.membersCount', { count: group.member_count })}</h4>
                      </div>
                      {group.members && group.members.length > 0 ? (
                        <div className="space-y-2">
                          {group.members.map(member => (
                            <div key={member.id} className="flex items-center justify-between py-2 px-3 rounded-md bg-muted/50">
                              <div className="flex items-center gap-3">
                                {member.avatar_url ? (
                                  <img
                                    src={member.avatar_url}
                                    alt={member.username}
                                    className="h-8 w-8 rounded-full"
                                  />
                                ) : (
                                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                                    {member.username[0]?.toUpperCase()}
                                  </div>
                                )}
                                <div>
                                  <p className="text-sm font-medium">{member.username}</p>
                                  <p className="text-xs text-muted-foreground">{member.email}</p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={() => handleRemoveMember(group.id, member.id)}
                                title={t('groups.removeMemberTooltip')}
                              >
                                <UserMinus className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          {t('groups.noMembers')}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-4 pt-4 border-t">
                      <span className="flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        {t('groups.roleLabel', { role: group.role })}
                      </span>
                      {group.owner_name && (
                        <span>{t('groups.ownerLabel', { owner: group.owner_name })}</span>
                      )}
                      <span>
                        {t('groups.createdLabel')}{formatDistanceToNow(new Date(group.created_at), { addSuffix: true, locale: dateFnsLocale })}
                      </span>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))
        )}
      </div>

      {/* Create Group Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('groups.createTitle')}</DialogTitle>
            <DialogDescription>
              {t('groups.createDescription')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('groups.nameLabel')}</Label>
              <Input
                id="name"
                placeholder={t('groups.namePlaceholder')}
                value={formName}
                onChange={e => setFormName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">{t('groups.descriptionLabel')}</Label>
              <Textarea
                id="description"
                placeholder={t('groups.descriptionPlaceholder')}
                value={formDescription}
                onChange={e => setFormDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('groups.defaultRoleLabel')}</Label>
              <Select value={formRole} onValueChange={setFormRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">{t('common:roles.user')}</SelectItem>
                  <SelectItem value="admin">{t('common:roles.admin')}</SelectItem>
                  <SelectItem value="guest">{t('common:roles.guest')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              {t('common:cancel')}
            </Button>
            <Button onClick={handleCreate} disabled={!formName || createGroup.isPending}>
              {createGroup.isPending ? t('groups.creating') : t('groups.createSubmit')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Group Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('groups.editTitle')}</DialogTitle>
            <DialogDescription>
              {t('groups.editDescription')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">{t('groups.nameLabel')}</Label>
              <Input
                id="edit-name"
                placeholder={t('groups.namePlaceholder')}
                value={formName}
                onChange={e => setFormName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">{t('groups.descriptionLabel')}</Label>
              <Textarea
                id="edit-description"
                placeholder={t('groups.descriptionPlaceholder')}
                value={formDescription}
                onChange={e => setFormDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('groups.defaultRoleLabel')}</Label>
              <Select value={formRole} onValueChange={setFormRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">{t('common:roles.user')}</SelectItem>
                  <SelectItem value="admin">{t('common:roles.admin')}</SelectItem>
                  <SelectItem value="guest">{t('common:roles.guest')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              {t('common:cancel')}
            </Button>
            <Button onClick={handleEdit} disabled={!formName || updateGroup.isPending}>
              {updateGroup.isPending ? t('groups.saving') : t('groups.saveSubmit')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Member Dialog */}
      <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('groups.addMemberTitle')}</DialogTitle>
            <DialogDescription>
              {t('groups.addMemberDescription', { name: selectedGroup?.name })}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>{t('groups.selectUserLabel')}</Label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger>
                  <SelectValue placeholder={t('groups.selectUserPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  {availableUsers.map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.username} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {availableUsers.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  {t('groups.allUsersAreMembersMessage')}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddMemberOpen(false)}>
              {t('common:cancel')}
            </Button>
            <Button onClick={handleAddMember} disabled={!selectedUserId || addMember.isPending}>
              {addMember.isPending ? t('groups.addingMember') : t('groups.addMemberSubmit')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!groupToDelete} onOpenChange={() => setGroupToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('groups.deleteTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('groups.deleteConfirm', { name: groupToDelete?.name })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common:cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('groups.deleteSubmit')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
