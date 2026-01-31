import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { User, Plus, X, Lock } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { IconPicker, DocumentIcon, isEmoji, parseIconValue, type IconValue } from '@/components/ui/icon-picker'
import { useUpdateSpace, useDeleteSpace } from '@/hooks/use-spaces'
import {
  useSpacePermissions,
  useUpsertSpaceUserPermission,
  useDeleteSpaceUserPermission,
} from '@/hooks/use-space-permissions'
import { useUsers } from '@/hooks/use-users'
import { useCurrentSpace } from '@/contexts/space-context'
import { useAuth } from '@/contexts/auth-context'
import { useTranslation } from 'react-i18next'

interface EditSpaceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  space?: {
    id?: string
    name?: string
    icon?: string
    icon_color?: string
    my_role?: string
    type?: string
  } | null
}

const COLOR_OPTIONS = [
  '#6366f1',
  '#8b5cf6',
  '#ec4899',
  '#ef4444',
  '#f59e0b',
  '#10b981',
  '#3b82f6',
  '#06b6d4',
]

export function EditSpaceModal({ open, onOpenChange, space: spaceProp }: EditSpaceModalProps) {
  const { currentSpace, setCurrentSpace } = useCurrentSpace()
  const { user } = useAuth()
  const [name, setName] = useState('')
  const [selectedIcon, setSelectedIcon] = useState<IconValue>('🏠')
  const [iconColor, setIconColor] = useState('#6366f1')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState('')
  const [selectedRole, setSelectedRole] = useState('viewer')

  // Use the explicit space prop if provided, otherwise fall back to currentSpace
  const space = spaceProp || currentSpace

  const queryClient = useQueryClient()
  const { mutateAsync: updateSpace, isPending: isUpdating } = useUpdateSpace()
  const { mutateAsync: deleteSpace, isPending: isDeleting } = useDeleteSpace()
  const { t } = useTranslation('navigation')

  // Permissions
  const spaceId = space?.id as string | undefined
  const { data: permissionsData } = useSpacePermissions(open ? spaceId : null)
  const permissions = permissionsData?.permissions || []
  const upsertPermission = useUpsertSpaceUserPermission()
  const deletePermission = useDeleteSpaceUserPermission()
  const { data: usersData } = useUsers()

  const isAdmin = space?.my_role === 'owner' || space?.my_role === 'admin'

  // Filter out users already in the space
  const availableUsers = usersData?.users.filter(
    (u) => !permissions.some((p) => p.user_id === u.id)
  ) || []

  // Extract icon value for API
  const getIconForApi = (): string => {
    if (isEmoji(selectedIcon)) {
      return selectedIcon as string
    }
    const parsed = parseIconValue(selectedIcon)
    return parsed?.name || 'file-text'
  }

  // Get color for API
  const getColorForApi = (): string => {
    if (!isEmoji(selectedIcon)) {
      const parsed = parseIconValue(selectedIcon)
      return parsed?.color || iconColor
    }
    return iconColor
  }

  useEffect(() => {
    if (open && space) {
      setName(space.name || '')
      const storedIcon = space.icon || '🏠'
      setSelectedIcon(storedIcon)
      setIconColor(space.icon_color || '#6366f1')
      setError('')
      setSuccess('')
    }
  }, [open, space])

  if (!space) return null

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const updated = await updateSpace({
        spaceId: space.id as string,
        name: name || undefined,
        icon: getIconForApi() || undefined,
        iconColor: getColorForApi() || undefined,
      })
      await queryClient.invalidateQueries({ queryKey: ['spaces'] })
      // Update currentSpace if editing the current one
      if (currentSpace?.id === space.id) {
        setCurrentSpace({ ...(currentSpace as any), ...(updated as any) })
      }
      setSuccess(t('spaces.saved'))
      setTimeout(() => setSuccess(''), 1500)
      onOpenChange(false)
    } catch (err: any) {
      setError(err?.response?.data?.details || t('spaces.updateError'))
    }
  }

  const handleDelete = async () => {
    if (!space?.id) return
    if (!window.confirm(t('spaces.deleteConfirm'))) return
    setError('')
    try {
      await deleteSpace({ spaceId: space.id as string })
      await queryClient.invalidateQueries({ queryKey: ['spaces'] })
      if (currentSpace?.id === space.id) {
        setCurrentSpace(null)
      }
      onOpenChange(false)
    } catch (err: any) {
      setError(err?.response?.data?.details || t('spaces.deleteError'))
    }
  }

  const handleAddMember = () => {
    if (!spaceId || !selectedUserId) return
    upsertPermission.mutate(
      { spaceId, userId: selectedUserId, role: selectedRole },
      {
        onSuccess: () => {
          setIsAddMemberOpen(false)
          setSelectedUserId('')
          setSelectedRole('viewer')
        },
      }
    )
  }

  const handleRoleChange = (userId: string, role: string) => {
    if (!spaceId) return
    upsertPermission.mutate({ spaceId, userId, role })
  }

  const handleRemoveMember = (userId: string) => {
    if (!spaceId) return
    deletePermission.mutate({ spaceId, userId })
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t('spaces.editTitle')}</DialogTitle>
            <DialogDescription>
              {t('spaces.editDescription')}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="general">
            <TabsList className="w-full">
              <TabsTrigger value="general" className="flex-1">{t('spaces.tabGeneral')}</TabsTrigger>
              <TabsTrigger value="members" className="flex-1">{t('spaces.tabMembers')}</TabsTrigger>
            </TabsList>

            {/* General tab */}
            <TabsContent value="general">
              <form onSubmit={handleSave}>
                <div className="space-y-4 py-4">
                  {success && (
                    <div className="text-sm text-emerald-600">{success}</div>
                  )}
                  <div>
                    <label htmlFor="space-name" className="block text-sm font-medium mb-2">
                      {t('spaces.nameLabel')}
                    </label>
                    <Input
                      id="space-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t('spaces.namePlaceholder')}
                      maxLength={100}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t('spaces.iconLabel')}
                    </label>
                    <IconPicker value={selectedIcon} onChange={setSelectedIcon} defaultTab="emoji">
                      <button
                        type="button"
                        className="h-12 w-12 rounded-lg border-2 border-dashed hover:border-primary transition-colors flex items-center justify-center"
                      >
                        <DocumentIcon value={selectedIcon} size="lg" />
                      </button>
                    </IconPicker>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('spaces.iconHelp')}
                    </p>
                  </div>

                  {/* Color picker (only for emojis) */}
                  {isEmoji(selectedIcon) && (
                    <div>
                      <label className="block text-sm font-medium mb-2">{t('spaces.backgroundColorLabel')}</label>
                      <div className="flex flex-wrap gap-2">
                        {COLOR_OPTIONS.map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setIconColor(color)}
                            className={`h-8 w-8 rounded border ${
                              iconColor === color ? 'ring-2 ring-offset-2' : ''
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {error && <div className="text-sm text-destructive">{error}</div>}
                </div>

                <DialogFooter>
                  <Button type="button" variant="destructive" onClick={handleDelete} disabled={isUpdating || isDeleting}>
                    {t('spaces.deleteButton')}
                  </Button>
                  <div className="flex-1" />
                  <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isUpdating}>
                    {t('common:cancel')}
                  </Button>
                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating ? t('spaces.savingButton') : t('spaces.saveButton')}
                  </Button>
                </DialogFooter>
              </form>
            </TabsContent>

            {/* Members tab */}
            <TabsContent value="members">
              <div className="space-y-4 py-4">
                {/* Personal/Private space indicator */}
                {(space.type === 'personal' || space.type === 'private') && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-muted/50 text-sm text-muted-foreground">
                    <Lock className="h-4 w-4 shrink-0" />
                    <span>{t(`spaces.${space.type === 'personal' ? 'personalSpaceNotice' : 'privateSpaceNotice'}`)}</span>
                  </div>
                )}

                {/* Add member button */}
                {isAdmin && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{t('spaces.membersTitle')}</span>
                    <Button variant="outline" size="sm" onClick={() => setIsAddMemberOpen(true)}>
                      <Plus className="h-4 w-4 mr-1" />
                      {t('spaces.addMember')}
                    </Button>
                  </div>
                )}

                {/* Members list */}
                {permissions.length > 0 ? (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {permissions.map((perm) => {
                      const isCurrentUser = perm.user_id === user?.id
                      const isOwner = perm.role === 'owner'
                      return (
                        <div
                          key={perm.id}
                          className={`flex items-center justify-between py-2 px-3 rounded-md ${
                            isOwner ? 'bg-primary/10' : 'bg-muted/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{perm.username || perm.group_name || '?'}</p>
                              <p className="text-xs text-muted-foreground capitalize">{perm.role}</p>
                            </div>
                          </div>
                          {isAdmin && !isCurrentUser && (
                            <div className="flex items-center gap-2">
                              <Select
                                value={perm.role}
                                onValueChange={(role) => {
                                  if (perm.user_id) handleRoleChange(perm.user_id, role)
                                }}
                              >
                                <SelectTrigger className="w-28 h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="viewer">{t('spaces.roleViewer')}</SelectItem>
                                  <SelectItem value="editor">{t('spaces.roleEditor')}</SelectItem>
                                  <SelectItem value="admin">{t('spaces.roleAdmin')}</SelectItem>
                                  <SelectItem value="owner">{t('spaces.roleOwner')}</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={() => {
                                  if (perm.user_id) handleRemoveMember(perm.user_id)
                                }}
                                title={t('spaces.removeMember')}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                          {(!isAdmin || isCurrentUser) && (
                            <span className="text-sm text-muted-foreground capitalize">{perm.role}</span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    {t('spaces.noMembers')}
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Add member dialog */}
      <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('spaces.addMemberTitle')}</DialogTitle>
            <DialogDescription>{t('spaces.addMemberDescription')}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('spaces.selectUser')}</label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger>
                  <SelectValue placeholder={t('spaces.selectUser')} />
                </SelectTrigger>
                <SelectContent>
                  {availableUsers.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('spaces.selectRole')}</label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">{t('spaces.roleViewer')}</SelectItem>
                  <SelectItem value="editor">{t('spaces.roleEditor')}</SelectItem>
                  <SelectItem value="admin">{t('spaces.roleAdmin')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddMemberOpen(false)}>
              {t('common:cancel')}
            </Button>
            <Button
              onClick={handleAddMember}
              disabled={!selectedUserId || upsertPermission.isPending}
            >
              {t('spaces.addButton')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
