import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/api/client'

export interface ActionStep {
  type: string
  config: Record<string, unknown>
}

export interface Action {
  id: string
  name: string
  description: string
  space_id?: string
  space_name?: string
  database_id?: string
  trigger_type: string
  active: boolean
  last_run_at?: string
  last_error?: string
  run_count: number
  success_count: number
  failure_count: number
  created_at: string
}

export interface ActionDetail extends Action {
  trigger_config?: Record<string, unknown>
  steps: ActionStep[]
  updated_at: string
}

export interface ActionRun {
  id: string
  success: boolean
  error?: string
  duration_ms: number
  created_at: string
}

export interface TriggerInfo {
  type: string
  description: string
  category: string
}

export interface StepInfo {
  type: string
  description: string
  category: string
}

export function useActions() {
  return useQuery({
    queryKey: ['actions'],
    queryFn: async () => {
      const response = await apiClient.get<{ actions: Action[] }>('/actions')
      return response.data.actions || []
    },
  })
}

export function useAction(actionId: string) {
  return useQuery({
    queryKey: ['actions', actionId],
    queryFn: async () => {
      const response = await apiClient.get<ActionDetail>(`/actions/${actionId}`)
      return response.data
    },
    enabled: !!actionId,
  })
}

export function useActionRuns(actionId: string, limit = 20) {
  return useQuery({
    queryKey: ['actions', actionId, 'runs'],
    queryFn: async () => {
      const response = await apiClient.get<{ runs: ActionRun[] }>(
        `/actions/${actionId}/runs?limit=${limit}`
      )
      return response.data.runs || []
    },
    enabled: !!actionId,
  })
}

export function useAvailableTriggers() {
  return useQuery({
    queryKey: ['actions', 'triggers'],
    queryFn: async () => {
      const response = await apiClient.get<{ triggers: TriggerInfo[] }>('/actions/triggers')
      return response.data.triggers || []
    },
  })
}

export function useAvailableSteps() {
  return useQuery({
    queryKey: ['actions', 'steps'],
    queryFn: async () => {
      const response = await apiClient.get<{ steps: StepInfo[] }>('/actions/steps')
      return response.data.steps || []
    },
  })
}

export function useCreateAction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
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
      const response = await apiClient.post<{
        id: string
        name: string
        description: string
        trigger_type: string
        active: boolean
        created_at: string
      }>('/actions', {
        name,
        description,
        trigger_type: triggerType,
        trigger_config: triggerConfig,
        steps,
        space_id: spaceId,
        database_id: databaseId,
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actions'] })
    },
  })
}

export function useUpdateAction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
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
      await apiClient.put(`/actions/${actionId}`, {
        name,
        description,
        trigger_type: triggerType,
        trigger_config: triggerConfig,
        steps,
        active,
      })
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
    mutationFn: async ({ actionId }: { actionId: string }) => {
      await apiClient.delete(`/actions/${actionId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actions'] })
    },
  })
}
