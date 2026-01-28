import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Zap, Plus, Trash2, Play, CheckCircle, AlertCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  useActions,
  useAction,
  useActionRuns,
  useAvailableTriggers,
  useAvailableSteps,
  useCreateAction,
  useUpdateAction,
  useDeleteAction,
  type Action,
  type ActionStep,
} from '@/hooks/use-actions'

export function ActionsSettings() {
  const { t } = useTranslation('settings')
  const { data: actions, isLoading } = useActions()
  const { data: availableTriggers } = useAvailableTriggers()
  const { data: availableSteps } = useAvailableSteps()
  const createAction = useCreateAction()
  const updateAction = useUpdateAction()
  const deleteAction = useDeleteAction()

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedAction, setSelectedAction] = useState<Action | null>(null)
  const [newActionName, setNewActionName] = useState('')
  const [newActionDescription, setNewActionDescription] = useState('')
  const [selectedTrigger, setSelectedTrigger] = useState('')
  const [steps, setSteps] = useState<ActionStep[]>([])

  const handleCreate = async () => {
    if (!newActionName || !selectedTrigger) return

    await createAction.mutateAsync({
      name: newActionName,
      description: newActionDescription,
      triggerType: selectedTrigger,
      steps: steps,
    })

    handleCloseCreate()
  }

  const handleCloseCreate = () => {
    setIsCreateOpen(false)
    setNewActionName('')
    setNewActionDescription('')
    setSelectedTrigger('')
    setSteps([])
  }

  const handleToggleActive = async (action: Action) => {
    await updateAction.mutateAsync({
      actionId: action.id,
      active: !action.active,
    })
  }

  const handleDelete = async (actionId: string) => {
    if (confirm(t('actions.deleteConfirm'))) {
      await deleteAction.mutateAsync({ actionId })
    }
  }

  const addStep = () => {
    setSteps([...steps, { type: '', config: {} }])
  }

  const updateStep = (index: number, type: string) => {
    const newSteps = [...steps]
    newSteps[index] = { type, config: {} }
    setSteps(newSteps)
  }

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index))
  }

  if (isLoading) {
    return <div className="p-4">{t('common:loading')}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">{t('actions.title')}</h3>
          <p className="text-sm text-muted-foreground">
            {t('actions.description')}
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t('actions.createButton')}
        </Button>
      </div>

      <div className="space-y-4">
        {actions?.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <Zap className="h-10 w-10 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">{t('actions.empty')}</p>
              <p className="text-sm text-muted-foreground">
                {t('actions.emptyHint')}
              </p>
            </CardContent>
          </Card>
        ) : (
          actions?.map(action => (
            <ActionCard
              key={action.id}
              action={action}
              onToggleActive={handleToggleActive}
              onDelete={handleDelete}
              onSelect={() => setSelectedAction(action)}
            />
          ))
        )}
      </div>

      {/* Create Action Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={handleCloseCreate}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{t('actions.createTitle')}</DialogTitle>
            <DialogDescription>
              {t('actions.createDescription')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="name">{t('actions.nameLabel')}</Label>
              <Input
                id="name"
                placeholder={t('actions.namePlaceholder')}
                value={newActionName}
                onChange={e => setNewActionName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">{t('actions.descriptionLabel')}</Label>
              <Input
                id="description"
                placeholder={t('actions.descriptionPlaceholder')}
                value={newActionDescription}
                onChange={e => setNewActionDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('actions.triggerLabel')}</Label>
              <Select value={selectedTrigger} onValueChange={setSelectedTrigger}>
                <SelectTrigger>
                  <SelectValue placeholder={t('actions.triggerPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  {availableTriggers?.map(trigger => (
                    <SelectItem key={trigger.type} value={trigger.type}>
                      <div className="flex flex-col">
                        <span>{trigger.type}</span>
                        <span className="text-xs text-muted-foreground">{trigger.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>{t('actions.stepsLabel')}</Label>
                <Button variant="outline" size="sm" onClick={addStep}>
                  <Plus className="mr-1 h-3 w-3" />
                  {t('actions.addStep')}
                </Button>
              </div>
              {steps.length === 0 ? (
                <div className="text-sm text-muted-foreground p-4 border rounded-md text-center">
                  {t('actions.noSteps')}
                </div>
              ) : (
                <div className="space-y-2">
                  {steps.map((step, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 border rounded-md">
                      <span className="text-sm text-muted-foreground w-6">{index + 1}.</span>
                      <Select
                        value={step.type}
                        onValueChange={(value: string) => updateStep(index, value)}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder={t('actions.stepTypePlaceholder')} />
                        </SelectTrigger>
                        <SelectContent>
                          {availableSteps?.map(s => (
                            <SelectItem key={s.type} value={s.type}>
                              {s.type} - {s.description}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeStep(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseCreate}>
              {t('common:cancel')}
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!newActionName || !selectedTrigger || createAction.isPending}
            >
              {createAction.isPending ? t('actions.creating') : t('common:create')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Action Details Dialog */}
      {selectedAction && (
        <ActionDetailsDialog
          action={selectedAction}
          onClose={() => setSelectedAction(null)}
        />
      )}
    </div>
  )
}

function ActionCard({
  action,
  onToggleActive,
  onDelete,
  onSelect,
}: {
  action: Action
  onToggleActive: (action: Action) => void
  onDelete: (id: string) => void
  onSelect: () => void
}) {
  const { t } = useTranslation('settings')
  const successRate = action.run_count > 0
    ? Math.round((action.success_count / action.run_count) * 100)
    : 0

  return (
    <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={onSelect}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className={`h-5 w-5 ${action.active ? 'text-yellow-500' : 'text-muted-foreground'}`} />
            <div>
              <CardTitle className="text-base">{action.name}</CardTitle>
              {action.description && (
                <CardDescription className="text-xs">
                  {action.description}
                </CardDescription>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
            <Switch
              checked={action.active}
              onCheckedChange={() => onToggleActive(action)}
            />
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive"
              onClick={() => onDelete(action.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <Badge variant="secondary">{action.trigger_type}</Badge>
          {action.space_name && (
            <Badge variant="outline">{action.space_name}</Badge>
          )}
        </div>
        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Play className="h-3 w-3" />
            {t('actions.runCount', { count: action.run_count })}
          </span>
          {action.run_count > 0 && (
            <span className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-green-500" />
              {t('actions.successRate', { rate: successRate })}
            </span>
          )}
          {action.last_run_at && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {t('actions.lastRun')} {new Date(action.last_run_at).toLocaleDateString()}
            </span>
          )}
        </div>
        {action.last_error && (
          <div className="mt-2 p-2 rounded-md bg-destructive/10 text-destructive text-xs">
            {action.last_error}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function ActionDetailsDialog({
  action,
  onClose,
}: {
  action: Action
  onClose: () => void
}) {
  const { t } = useTranslation('settings')
  const { data: actionDetail } = useAction(action.id)
  const { data: runs, isLoading } = useActionRuns(action.id)

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{action.name}</DialogTitle>
          {action.description && (
            <DialogDescription>{action.description}</DialogDescription>
          )}
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <h4 className="text-sm font-medium mb-2">{t('actions.detailsTrigger')}</h4>
            <Badge variant="secondary">{action.trigger_type}</Badge>
          </div>
          {actionDetail?.steps && actionDetail.steps.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">{t('actions.detailsSteps')}</h4>
              <div className="space-y-2">
                {actionDetail.steps.map((step, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                    <span className="text-sm text-muted-foreground">{index + 1}.</span>
                    <Badge variant="outline">{step.type}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div>
            <h4 className="text-sm font-medium mb-2">{t('actions.recentRuns')}</h4>
            {isLoading ? (
              <div className="text-sm text-muted-foreground">{t('common:loading')}</div>
            ) : runs?.length === 0 ? (
              <div className="text-sm text-muted-foreground">{t('actions.noRuns')}</div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {runs?.map(run => (
                  <div
                    key={run.id}
                    className="flex items-center justify-between p-2 rounded-md bg-muted/50"
                  >
                    <div className="flex items-center gap-2">
                      {run.success ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-destructive" />
                      )}
                      <span className="text-sm">
                        {run.success ? t('actions.runSuccess') : t('actions.runFailed')}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {run.duration_ms}ms
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(run.created_at).toLocaleString()}
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
