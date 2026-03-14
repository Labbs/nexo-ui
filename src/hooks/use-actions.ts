import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  actionList,
  actionGet,
  actionRuns,
  actionTriggers,
  actionSteps,
  actionCreate,
  actionUpdate,
  actionDelete,
} from '@/api/generated/actions/actions'
import type {
  ActionStep,
  ActionItem,
  GetActionResponse,
  RunItem,
  TriggerInfo,
  StepInfo,
  CreateActionRequest,
  UpdateActionRequest,
} from '@/api/generated/model'

// Re-export types for backward compatibility
export type Action = ActionItem
export type ActionDetail = GetActionResponse
export type ActionRun = RunItem
export type { ActionStep, TriggerInfo, StepInfo }

export function useActions() {
  return useQuery({
    queryKey: ['actions'],
    queryFn: () => actionList(),
    select: (data) => data.actions || [],
  })
}

export function useAction(actionId: string) {
  return useQuery({
    queryKey: ['actions', actionId],
    queryFn: () => actionGet(actionId),
    enabled: !!actionId,
  })
}

export function useActionRuns(actionId: string, limit = 20) {
  return useQuery({
    queryKey: ['actions', actionId, 'runs'],
    queryFn: () => actionRuns(actionId, { limit }),
    select: (data) => data.runs || [],
    enabled: !!actionId,
  })
}

export function useAvailableTriggers() {
  return useQuery({
    queryKey: ['actions', 'triggers'],
    queryFn: () => actionTriggers(),
    select: (data) => data.triggers || [],
    staleTime: Infinity, // Server-defined enum, never changes at runtime
  })
}

export function useAvailableSteps() {
  return useQuery({
    queryKey: ['actions', 'steps'],
    queryFn: () => actionSteps(),
    select: (data) => data.steps || [],
    staleTime: Infinity, // Server-defined enum, never changes at runtime
  })
}

export function useCreateAction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      name,
      description,
      triggerType,
      triggerConfig,
      steps,
      spaceId,
      databaseId,
    }: {
      name: string
      description?: string
      triggerType: string
      triggerConfig?: Record<string, unknown>
      steps: ActionStep[]
      spaceId?: string
      databaseId?: string
    }) => {
      return actionCreate({
        name,
        description,
        trigger_type: triggerType,
        trigger_config: triggerConfig,
        steps,
        space_id: spaceId,
        database_id: databaseId,
      } as CreateActionRequest)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actions'] })
    },
  })
}

export function useUpdateAction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      actionId,
      name,
      description,
      triggerType,
      triggerConfig,
      steps,
      active,
    }: {
      actionId: string
      name?: string
      description?: string
      triggerType?: string
      triggerConfig?: Record<string, unknown>
      steps?: ActionStep[]
      active?: boolean
    }) => {
      return actionUpdate(actionId, {
        name,
        description,
        trigger_type: triggerType,
        trigger_config: triggerConfig,
        steps,
        active,
      } as UpdateActionRequest)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['actions'] })
      queryClient.invalidateQueries({ queryKey: ['actions', variables.actionId] })
    },
  })
}

export function useDeleteAction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ actionId }: { actionId: string }) => {
      return actionDelete(actionId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actions'] })
    },
  })
}
