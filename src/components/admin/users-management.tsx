import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { User, Trash2, Shield, Ban, Check, UserPlus } from 'lucide-react'
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
  useAdminUsers,
  useUpdateUserRole,
  useUpdateUserActive,
  useDeleteUser,
  useInviteUser,
  type AdminUser,
} from '@/hooks/use-admin'
import { formatDistanceToNow } from 'date-fns'
import { useLanguage } from '@/i18n/LanguageContext'

export function UsersManagement() {
  const { t } = useTranslation('admin')
  const { dateFnsLocale } = useLanguage()
  const { data, isLoading } = useAdminUsers()
  const updateRole = useUpdateUserRole()
  const updateActive = useUpdateUserActive()
  const deleteUser = useDeleteUser()
  const inviteUser = useInviteUser()

  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('user')
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null)

  const handleInvite = async () => {
    if (!inviteEmail) return
    await inviteUser.mutateAsync({ email: inviteEmail, role: inviteRole })
    setIsInviteOpen(false)
    setInviteEmail('')
    setInviteRole('user')
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    await updateRole.mutateAsync({ userId, role: newRole })
  }

  const handleToggleActive = async (userId: string, currentActive: boolean) => {
    await updateActive.mutateAsync({ userId, active: !currentActive })
  }

  const handleDelete = async () => {
    if (!userToDelete) return
    await deleteUser.mutateAsync(userToDelete.id)
    setUserToDelete(null)
  }

  if (isLoading) {
    return <div className="p-4">{t('users.loading')}</div>
  }

  const users = data?.users || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">{t('users.title')}</h3>
          <p className="text-sm text-muted-foreground">
            {t('users.description')}
          </p>
        </div>
        <Button onClick={() => setIsInviteOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          {t('users.inviteButton')}
        </Button>
      </div>

      <div className="space-y-4">
        {users.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <User className="h-10 w-10 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">{t('users.empty')}</p>
            </CardContent>
          </Card>
        ) : (
          users.map(user => (
            <Card key={user.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.username}
                        className="h-10 w-10 rounded-full"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        {user.username}
                        {!user.active && (
                          <Badge variant="destructive" className="text-xs">
                            {t('users.inactiveBadge')}
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription>{user.email}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      value={user.role}
                      onValueChange={(value) => handleRoleChange(user.id, value)}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">{t('common:roles.user')}</SelectItem>
                        <SelectItem value="admin">{t('common:roles.admin')}</SelectItem>
                        <SelectItem value="guest">{t('common:roles.guest')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleActive(user.id, user.active)}
                      title={user.active ? t('users.deactivateTooltip') : t('users.activateTooltip')}
                    >
                      {user.active ? (
                        <Ban className="h-4 w-4 text-orange-500" />
                      ) : (
                        <Check className="h-4 w-4 text-green-500" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setUserToDelete(user)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    {t('users.roleLabel', { role: user.role })}
                  </span>
                  <span>
                    {t('users.joinedLabel')}{formatDistanceToNow(new Date(user.created_at), { addSuffix: true, locale: dateFnsLocale })}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Invite User Dialog */}
      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('users.inviteTitle')}</DialogTitle>
            <DialogDescription>
              {t('users.inviteDescription')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('users.emailLabel')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('users.emailPlaceholder')}
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('users.roleSelectLabel')}</Label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
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
            <Button variant="outline" onClick={() => setIsInviteOpen(false)}>
              {t('common:cancel')}
            </Button>
            <Button onClick={handleInvite} disabled={!inviteEmail || inviteUser.isPending}>
              {inviteUser.isPending ? t('users.sendingInvite') : t('users.sendInvite')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('users.deleteTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('users.deleteConfirm', { username: userToDelete?.username })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common:cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('users.deleteButton')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
