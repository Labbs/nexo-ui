import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/api/client'

export interface ApiKey {
  id: string
  name: string
  key_prefix: string
  scopes: string[]
  last_used_at?: string
  expires_at?: string
  created_at: string
}

export interface CreateApiKeyResponse {
  id: string
  name: string
  key: string
  key_prefix: string
  scopes: string[]
  expires_at?: string
  created_at: string
}

export interface ScopeInfo {
  scope: string
  description: string
}

export function useApiKeys() {
  return useQuery({
    queryKey: ['api-keys'],
    queryFn: async () => {
      const response = await apiClient.get<{ api_keys: ApiKey[] }>('/apikeys')
      return response.data.api_keys || []
    },
  })
}

export function useAvailableScopes() {
  return useQuery({
    queryKey: ['api-keys', 'scopes'],
    queryFn: async () => {
      const response = await apiClient.get<{ scopes: ScopeInfo[] }>('/apikeys/scopes')
      return response.data.scopes || []
    },
  })
}

export function useCreateApiKey() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      name,
      scopes,
      expiresAt,
    }: {
      name: string
      scopes: string[]
      expiresAt?: string
    }) => {
      const response = await apiClient.post<CreateApiKeyResponse>('/apikeys', {
        name,
        scopes,
        expires_at: expiresAt,
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] })
    },
  })
}

export function useUpdateApiKey() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      apiKeyId,
      name,
      scopes,
    }: {
      apiKeyId: string
      name?: string
      scopes?: string[]
    }) => {
      await apiClient.put(`/apikeys/${apiKeyId}`, { name, scopes })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] })
    },
  })
}

export function useDeleteApiKey() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ apiKeyId }: { apiKeyId: string }) => {
      await apiClient.delete(`/apikeys/${apiKeyId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] })
    },
  })
}
