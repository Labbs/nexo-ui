import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Key, Plus, Trash2, Copy, Check, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  useApiKeys,
  useAvailableScopes,
  useCreateApiKey,
  useDeleteApiKey,
  type CreateApiKeyResponse,
} from '@/hooks/use-api-keys'

export function ApiKeysSettings() {
  const { t } = useTranslation('settings')
  const { data: apiKeys, isLoading } = useApiKeys()
  const { data: availableScopes } = useAvailableScopes()
  const createApiKey = useCreateApiKey()
  const deleteApiKey = useDeleteApiKey()

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [selectedScopes, setSelectedScopes] = useState<string[]>([])
  const [createdKey, setCreatedKey] = useState<CreateApiKeyResponse | null>(null)
  const [copiedKey, setCopiedKey] = useState(false)
  const [showSecret, setShowSecret] = useState(false)

  const handleCreate = async () => {
    if (!newKeyName || selectedScopes.length === 0) return

    const result = await createApiKey.mutateAsync({
      name: newKeyName,
      scopes: selectedScopes,
    })

    setCreatedKey(result)
  }

  const handleCloseCreate = () => {
    setIsCreateOpen(false)
    setNewKeyName('')
    setSelectedScopes([])
    setCreatedKey(null)
    setCopiedKey(false)
    setShowSecret(false)
  }

  const handleCopyKey = async () => {
    if (createdKey?.key) {
      await navigator.clipboard.writeText(createdKey.key)
      setCopiedKey(true)
      setTimeout(() => setCopiedKey(false), 2000)
    }
  }

  const handleDelete = async (apiKeyId: string) => {
    if (confirm(t('apiKeys.deleteConfirm'))) {
      await deleteApiKey.mutateAsync({ apiKeyId })
    }
  }

  const toggleScope = (scope: string) => {
    setSelectedScopes(prev =>
      prev.includes(scope) ? prev.filter(s => s !== scope) : [...prev, scope]
    )
  }

  if (isLoading) {
    return <div className="p-4">{t('common:loading')}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">{t('apiKeys.title')}</h3>
          <p className="text-sm text-muted-foreground">
            {t('apiKeys.description')}
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t('apiKeys.createButton')}
        </Button>
      </div>

      <div className="space-y-4">
        {apiKeys?.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <Key className="h-10 w-10 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">{t('apiKeys.empty')}</p>
              <p className="text-sm text-muted-foreground">
                {t('apiKeys.emptyHint')}
              </p>
            </CardContent>
          </Card>
        ) : (
          apiKeys?.map(key => (
            <Card key={key.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Key className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <CardTitle className="text-base">{key.name}</CardTitle>
                      <CardDescription className="font-mono text-xs">
                        {key.key_prefix}...
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(key.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {key.scopes?.map(scope => (
                    <Badge key={scope} variant="secondary">
                      {scope}
                    </Badge>
                  ))}
                </div>
                <div className="mt-3 text-xs text-muted-foreground">
                  {t('apiKeys.created')}: {new Date(key.created_at).toLocaleDateString()}
                  {key.last_used_at && (
                    <> &bull; {t('apiKeys.lastUsed')}: {new Date(key.last_used_at).toLocaleDateString()}</>
                  )}
                  {key.expires_at && (
                    <> &bull; {t('apiKeys.expires')}: {new Date(key.expires_at).toLocaleDateString()}</>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={isCreateOpen} onOpenChange={handleCloseCreate}>
        <DialogContent className="sm:max-w-[500px]">
          {!createdKey ? (
            <>
              <DialogHeader>
                <DialogTitle>{t('apiKeys.createTitle')}</DialogTitle>
                <DialogDescription>
                  {t('apiKeys.createDescription')}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('apiKeys.nameLabel')}</Label>
                  <Input
                    id="name"
                    placeholder={t('apiKeys.namePlaceholder')}
                    value={newKeyName}
                    onChange={e => setNewKeyName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('apiKeys.permissionsLabel')}</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {availableScopes?.map(scope => (
                      <div key={scope.scope} className="flex items-center space-x-2">
                        <Checkbox
                          id={scope.scope}
                          checked={selectedScopes.includes(scope.scope)}
                          onCheckedChange={() => toggleScope(scope.scope)}
                        />
                        <label
                          htmlFor={scope.scope}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {scope.scope}
                          <span className="ml-2 text-muted-foreground font-normal">
                            - {scope.description}
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={handleCloseCreate}>
                  {t('common:cancel')}
                </Button>
                <Button
                  onClick={handleCreate}
                  disabled={!newKeyName || selectedScopes.length === 0 || createApiKey.isPending}
                >
                  {createApiKey.isPending ? t('apiKeys.creating') : t('common:create')}
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>{t('apiKeys.createdTitle')}</DialogTitle>
                <DialogDescription>
                  {t('apiKeys.createdDescription')}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>{t('apiKeys.keyLabel')}</Label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 relative">
                      <Input
                        readOnly
                        type={showSecret ? 'text' : 'password'}
                        value={createdKey.key}
                        className="font-mono pr-10"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => setShowSecret(!showSecret)}
                      >
                        {showSecret ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <Button variant="outline" size="icon" onClick={handleCopyKey}>
                      {copiedKey ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="rounded-md bg-yellow-500/10 border border-yellow-500/20 p-3">
                  <p className="text-sm text-yellow-500">
                    {t('apiKeys.keyWarning')}
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCloseCreate}>{t('common:done')}</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
