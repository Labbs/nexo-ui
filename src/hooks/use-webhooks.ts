import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  webhookList,
  webhookGet,
  webhookDeliveries,
  webhookEvents,
  webhookCreate,
  webhookUpdate,
  webhookDelete,
} from '@/api/generated/webhooks/webhooks'
import type {
  WebhookItem,
  GetWebhookResponse,
  DeliveryItem,
  EventInfo,
  CreateWebhookRequest,
  UpdateWebhookRequest,
} from '@/api/generated/model'

// Re-export types for backward compatibility
export type Webhook = WebhookItem
export type WebhookDetail = GetWebhookResponse
export type WebhookDelivery = DeliveryItem
export type { EventInfo }

export function useWebhooks() {
  return useQuery({
    queryKey: ['webhooks'],
    queryFn: () => webhookList(),
    select: (data) => data.webhooks || [],
  })
}

export function useWebhook(webhookId: string) {
  return useQuery({
    queryKey: ['webhooks', webhookId],
    queryFn: () => webhookGet(webhookId),
    enabled: !!webhookId,
  })
}

export function useWebhookDeliveries(webhookId: string, limit = 20) {
  return useQuery({
    queryKey: ['webhooks', webhookId, 'deliveries'],
    queryFn: () => webhookDeliveries(webhookId, { limit }),
    select: (data) => data.deliveries || [],
    enabled: !!webhookId,
  })
}

export function useAvailableEvents() {
  return useQuery({
    queryKey: ['webhooks', 'events'],
    queryFn: () => webhookEvents(),
    select: (data) => data.events || [],
    staleTime: Infinity, // Server-defined enum, never changes at runtime
  })
}

export function useCreateWebhook() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
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
      return webhookCreate({
        name,
        url,
        events,
        space_id: spaceId,
      } as CreateWebhookRequest)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] })
    },
  })
}

export function useUpdateWebhook() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
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
      return webhookUpdate(webhookId, { name, url, events, active } as UpdateWebhookRequest)
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
    mutationFn: ({ webhookId }: { webhookId: string }) => {
      return webhookDelete(webhookId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] })
    },
  })
}
