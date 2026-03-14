import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Webhook, Plus, Trash2, Copy, Check, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  useWebhooks,
  useWebhookDeliveries,
  useAvailableEvents,
  useCreateWebhook,
  useUpdateWebhook,
  useDeleteWebhook,
  type Webhook as WebhookType,
} from '@/hooks/use-webhooks'

export function WebhooksSettings() {
  const { t } = useTranslation('settings')
  const { data: webhooks, isLoading } = useWebhooks()
  const { data: availableEvents } = useAvailableEvents()
  const createWebhook = useCreateWebhook()
  const updateWebhook = useUpdateWebhook()
  const deleteWebhook = useDeleteWebhook()

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedWebhook, setSelectedWebhook] = useState<WebhookType | null>(null)
  const [newWebhookName, setNewWebhookName] = useState('')
  const [newWebhookUrl, setNewWebhookUrl] = useState('')
  const [selectedEvents, setSelectedEvents] = useState<string[]>([])
  const [createdSecret, setCreatedSecret] = useState<string | null>(null)
  const [copiedSecret, setCopiedSecret] = useState(false)

  const handleCreate = async () => {
    if (!newWebhookName || !newWebhookUrl || selectedEvents.length === 0) return

    const result = await createWebhook.mutateAsync({
      name: newWebhookName,
      url: newWebhookUrl,
      events: selectedEvents,
    })

    setCreatedSecret(result.secret ?? null)
  }

  const handleCloseCreate = () => {
    setIsCreateOpen(false)
    setNewWebhookName('')
    setNewWebhookUrl('')
    setSelectedEvents([])
    setCreatedSecret(null)
    setCopiedSecret(false)
  }

  const handleCopySecret = async () => {
    if (createdSecret) {
      await navigator.clipboard.writeText(createdSecret)
      setCopiedSecret(true)
      setTimeout(() => setCopiedSecret(false), 2000)
    }
  }

  const handleToggleActive = async (webhook: WebhookType) => {
    await updateWebhook.mutateAsync({
      webhookId: webhook.id ?? '',
      active: !webhook.active,
    })
  }

  const handleDelete = async (webhookId: string) => {
    if (confirm(t('webhooks.deleteConfirm'))) {
      await deleteWebhook.mutateAsync({ webhookId })
    }
  }

  const toggleEvent = (event: string) => {
    setSelectedEvents(prev =>
      prev.includes(event) ? prev.filter(e => e !== event) : [...prev, event]
    )
  }

  if (isLoading) {
    return <div className="p-4">{t('common:loading')}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">{t('webhooks.title')}</h3>
          <p className="text-sm text-muted-foreground">
            {t('webhooks.description')}
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t('webhooks.createButton')}
        </Button>
      </div>

      <div className="space-y-4">
        {webhooks?.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <Webhook className="h-10 w-10 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">{t('webhooks.empty')}</p>
              <p className="text-sm text-muted-foreground">
                {t('webhooks.emptyHint')}
              </p>
            </CardContent>
          </Card>
        ) : (
          webhooks?.map(webhook => (
            <WebhookCard
              key={webhook.id}
              webhook={webhook}
              onToggleActive={handleToggleActive}
              onDelete={handleDelete}
              onSelect={() => setSelectedWebhook(webhook)}
            />
          ))
        )}
      </div>

      {/* Create Webhook Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={handleCloseCreate}>
        <DialogContent className="sm:max-w-[500px]">
          {!createdSecret ? (
            <>
              <DialogHeader>
                <DialogTitle>{t('webhooks.createTitle')}</DialogTitle>
                <DialogDescription>
                  {t('webhooks.createDescription')}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('webhooks.nameLabel')}</Label>
                  <Input
                    id="name"
                    placeholder={t('webhooks.namePlaceholder')}
                    value={newWebhookName}
                    onChange={e => setNewWebhookName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="url">{t('webhooks.urlLabel')}</Label>
                  <Input
                    id="url"
                    type="url"
                    placeholder={t('webhooks.urlPlaceholder')}
                    value={newWebhookUrl}
                    onChange={e => setNewWebhookUrl(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('webhooks.eventsLabel')}</Label>
                  <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                    {availableEvents?.map(event => (
                      <div key={event.event} className="flex items-center space-x-2">
                        <Checkbox
                          id={event.event}
                          checked={selectedEvents.includes(event.event ?? '')}
                          onCheckedChange={() => toggleEvent(event.event ?? '')}
                        />
                        <label
                          htmlFor={event.event}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {event.event}
                          <span className="ml-2 text-muted-foreground font-normal">
                            - {event.description}
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
                  disabled={!newWebhookName || !newWebhookUrl || selectedEvents.length === 0 || createWebhook.isPending}
                >
                  {createWebhook.isPending ? t('webhooks.creating') : t('common:create')}
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>{t('webhooks.createdTitle')}</DialogTitle>
                <DialogDescription>
                  {t('webhooks.createdDescription')}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>{t('webhooks.secretLabel')}</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      readOnly
                      type="text"
                      value={createdSecret}
                      className="font-mono"
                    />
                    <Button variant="outline" size="icon" onClick={handleCopySecret}>
                      {copiedSecret ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="rounded-md bg-yellow-500/10 border border-yellow-500/20 p-3">
                  <p className="text-sm text-yellow-500">
                    {t('webhooks.secretWarning')}
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

      {/* Webhook Details Dialog */}
      {selectedWebhook && (
        <WebhookDetailsDialog
          webhook={selectedWebhook}
          onClose={() => setSelectedWebhook(null)}
        />
      )}
    </div>
  )
}

function WebhookCard({
  webhook,
  onToggleActive,
  onDelete,
  onSelect,
}: {
  webhook: WebhookType
  onToggleActive: (webhook: WebhookType) => void
  onDelete: (id: string) => void
  onSelect: () => void
}) {
  const { t } = useTranslation('settings')

  return (
    <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={onSelect}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Webhook className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle className="text-base">{webhook.name}</CardTitle>
              <CardDescription className="font-mono text-xs truncate max-w-md">
                {webhook.url}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
            <Switch
              checked={webhook.active ?? false}
              onCheckedChange={() => onToggleActive(webhook)}
            />
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive"
              onClick={() => onDelete(webhook.id ?? '')}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {webhook.events?.map(event => (
            <Badge key={event} variant="secondary">
              {event}
            </Badge>
          ))}
        </div>
        <div className="mt-3 text-xs text-muted-foreground">
          {t('webhooks.created')}: {new Date(webhook.created_at ?? '').toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  )
}

function WebhookDetailsDialog({
  webhook,
  onClose,
}: {
  webhook: WebhookType
  onClose: () => void
}) {
  const { t } = useTranslation('settings')
  const { data: deliveries, isLoading } = useWebhookDeliveries(webhook.id ?? '')

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{webhook.name}</DialogTitle>
          <DialogDescription className="font-mono text-xs">
            {webhook.url}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <h4 className="text-sm font-medium mb-2">{t('webhooks.eventsHeading')}</h4>
            <div className="flex flex-wrap gap-2">
              {webhook.events?.map(event => (
                <Badge key={event} variant="secondary">
                  {event}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">{t('webhooks.recentDeliveries')}</h4>
            {isLoading ? (
              <div className="text-sm text-muted-foreground">{t('common:loading')}</div>
            ) : deliveries?.length === 0 ? (
              <div className="text-sm text-muted-foreground">{t('webhooks.noDeliveries')}</div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {deliveries?.map(delivery => (
                  <div
                    key={delivery.id}
                    className="flex items-center justify-between p-2 rounded-md bg-muted/50"
                  >
                    <div className="flex items-center gap-2">
                      {delivery.success ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-destructive" />
                      )}
                      <span className="text-sm font-medium">{delivery.event}</span>
                      <Badge variant="outline">{delivery.status_code}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(delivery.created_at ?? '').toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>{t('common:close')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
