import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apikeyList, apikeyScopes, apikeyCreate, apikeyUpdate, apikeyDelete } from '@/api/generated/api-keys/api-keys'
import type { ApiKeyItem, ScopeInfo, CreateApiKeyResponse as GenCreateApiKeyResponse, CreateApiKeyRequest, UpdateApiKeyRequest } from '@/api/generated/model'

// Re-export types for backward compatibility
export type ApiKey = ApiKeyItem
export type CreateApiKeyResponse = GenCreateApiKeyResponse
export type { ScopeInfo }

export function useApiKeys() {
  return useQuery({
    queryKey: ['api-keys'],
    queryFn: () => apikeyList(),
    select: (data) => data.api_keys || [],
  })
}

export function useAvailableScopes() {
  return useQuery({
    queryKey: ['api-keys', 'scopes'],
    queryFn: () => apikeyScopes(),
    select: (data) => data.scopes || [],
    staleTime: Infinity, // Server-defined enum, never changes at runtime
  })
}

export function useCreateApiKey() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      name,
      scopes,
      expiresAt,
    }: {
      name: string
      scopes: string[]
      expiresAt?: string
    }) => {
      return apikeyCreate({
        name,
        scopes,
        expires_at: expiresAt,
      } as CreateApiKeyRequest)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] })
    },
  })
}

export function useUpdateApiKey() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      apiKeyId,
      name,
      scopes,
    }: {
      apiKeyId: string
      name?: string
      scopes?: string[]
    }) => {
      return apikeyUpdate(apiKeyId, { name, scopes } as UpdateApiKeyRequest)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] })
    },
  })
}

export function useDeleteApiKey() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ apiKeyId }: { apiKeyId: string }) => {
      return apikeyDelete(apiKeyId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] })
    },
  })
}
