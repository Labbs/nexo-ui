import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/api/client'

export interface Webhook {
  id: string
  name: string
  url: string
  space_id?: string
  space_name?: string
  events: string[]
  active: boolean
  last_error?: string
  last_error_at?: string
  last_triggered_at?: string
  success_count: number
  failure_count: number
  created_at: string
}

export interface WebhookDetail extends Webhook {
  secret: string
  updated_at: string
}

export interface WebhookDelivery {
  id: string
  event: string
  status_code: number
  success: boolean
  duration_ms: number
  created_at: string
}

export interface EventInfo {
  event: string
  description: string
}

export function useWebhooks() {
  return useQuery({
    queryKey: ['webhooks'],
    queryFn: async () => {
      const response = await apiClient.get<{ webhooks: Webhook[] }>('/webhooks')
      return response.data.webhooks || []
    },
  })
}

export function useWebhook(webhookId: string) {
  return useQuery({
    queryKey: ['webhooks', webhookId],
    queryFn: async () => {
      const response = await apiClient.get<WebhookDetail>(`/webhooks/${webhookId}`)
      return response.data
    },
    enabled: !!webhookId,
  })
}

export function useWebhookDeliveries(webhookId: string, limit = 20) {
  return useQuery({
    queryKey: ['webhooks', webhookId, 'deliveries'],
    queryFn: async () => {
      const response = await apiClient.get<{ deliveries: WebhookDelivery[] }>(
        `/webhooks/${webhookId}/deliveries?limit=${limit}`
      )
      return response.data.deliveries || []
    },
    enabled: !!webhookId,
  })
}

export function useAvailableEvents() {
  return useQuery({
    queryKey: ['webhooks', 'events'],
    queryFn: async () => {
      const response = await apiClient.get<{ events: EventInfo[] }>('/webhooks/events')
      return response.data.events || []
    },
<<<<<<< HEAD
=======
    staleTime: Infinity, // Server-defined enum, never changes at runtime
>>>>>>> d4609d4 (feat: add hooks for managing spaces, users, versions, and webhooks)
  })
}

export function useCreateWebhook() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      name,
      url,
      events,
      spaceId,
    }: {
      name: string
      url: string
      events: string[]
      spaceId?: string
    }) => {
      const response = await apiClient.post<{
        id: string
        name: string
        url: string
        secret: string
        events: string[]
        active: boolean
      }>('/webhooks', {
        name,
        url,
        events,
        space_id: spaceId,
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] })
    },
  })
}

export function useUpdateWebhook() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      webhookId,
      name,
      url,
      events,
      active,
    }: {
      webhookId: string
      name?: string
      url?: string
      events?: string[]
      active?: boolean
    }) => {
      await apiClient.put(`/webhooks/${webhookId}`, { name, url, events, active })
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] })
      queryClient.invalidateQueries({ queryKey: ['webhooks', variables.webhookId] })
    },
  })
}

export function useDeleteWebhook() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ webhookId }: { webhookId: string }) => {
      await apiClient.delete(`/webhooks/${webhookId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] })
    },
  })
}
