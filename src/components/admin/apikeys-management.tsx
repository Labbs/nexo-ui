import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Key, Trash2, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import { useAdminApiKeys, useRevokeApiKey, type AdminApiKey } from '@/hooks/use-admin'
import { formatDistanceToNow } from 'date-fns'
import { useLanguage } from '@/i18n/LanguageContext'

export function ApiKeysManagement() {
  const { t } = useTranslation('admin')
  const { dateFnsLocale } = useLanguage()
  const { data, isLoading } = useAdminApiKeys()
  const revokeApiKey = useRevokeApiKey()
  const [keyToRevoke, setKeyToRevoke] = useState<AdminApiKey | null>(null)

  const handleRevoke = async () => {
    if (!keyToRevoke) return
    await revokeApiKey.mutateAsync(keyToRevoke.id)
    setKeyToRevoke(null)
  }

  if (isLoading) {
    return <div className="p-4">{t('apiKeys.loading')}</div>
  }

  const apiKeys = data?.api_keys || []

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{t('apiKeys.title')}</h3>
        <p className="text-sm text-muted-foreground">
          {t('apiKeys.description')}
        </p>
      </div>

      <div className="space-y-4">
        {apiKeys.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <Key className="h-10 w-10 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">{t('apiKeys.empty')}</p>
            </CardContent>
          </Card>
        ) : (
          apiKeys.map(apiKey => (
            <Card key={apiKey.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Key className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <CardTitle className="text-base">{apiKey.name}</CardTitle>
                      <CardDescription className="font-mono text-xs">
                        {apiKey.key_prefix}...
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setKeyToRevoke(apiKey)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-3">
                  {apiKey.permissions?.map(perm => (
                    <Badge key={perm} variant="secondary">
                      {perm}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {t('apiKeys.ownerLabel')}{apiKey.username || apiKey.user_id}
                  </span>
                  <span>
                    {t('apiKeys.createdLabel')}{formatDistanceToNow(new Date(apiKey.created_at), { addSuffix: true, locale: dateFnsLocale })}
                  </span>
                  {apiKey.last_used_at && (
                    <span>
                      {t('apiKeys.lastUsedLabel')}{formatDistanceToNow(new Date(apiKey.last_used_at), { addSuffix: true, locale: dateFnsLocale })}
                    </span>
                  )}
                  {apiKey.expires_at && (
                    <span>
                      {t('apiKeys.expiresLabel')}{formatDistanceToNow(new Date(apiKey.expires_at), { addSuffix: true, locale: dateFnsLocale })}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Revoke Confirmation Dialog */}
      <AlertDialog open={!!keyToRevoke} onOpenChange={() => setKeyToRevoke(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('apiKeys.revokeTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('apiKeys.revokeConfirm', { name: keyToRevoke?.name })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common:cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRevoke}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('apiKeys.revokeButton')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
