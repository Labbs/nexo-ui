import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/api/client'

export interface DocumentPermission {
  id: string
  user_id?: string
  username?: string
  group_id?: string
  group_name?: string
  role: 'owner' | 'editor' | 'viewer' | 'denied'
}

export function useDocumentPermissions(spaceId?: string, documentId?: string) {
  return useQuery({
    queryKey: ['document', spaceId, documentId, 'permissions'],
    queryFn: async () => {
      const response = await apiClient.get<{ permissions: DocumentPermission[] }>(
        `/document/space/${spaceId}/${documentId}/permissions`
      )
      return response.data.permissions || []
    },
    enabled: !!spaceId && !!documentId,
  })
}

export function useUpsertDocumentPermission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      spaceId,
      documentId,
      userId,
      role,
    }: {
      spaceId: string
      documentId: string
      userId: string
      role: 'owner' | 'editor' | 'viewer' | 'denied'
    }) => {
      await apiClient.put(`/document/space/${spaceId}/${documentId}/permissions`, {
        user_id: userId,
        role,
      })
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['document', variables.spaceId, variables.documentId, 'permissions'],
      })
    },
  })
}

export function useDeleteDocumentPermission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      spaceId,
      documentId,
      userId,
    }: {
      spaceId: string
      documentId: string
      userId: string
    }) => {
      await apiClient.delete(`/document/space/${spaceId}/${documentId}/permissions/${userId}`)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['document', variables.spaceId, variables.documentId, 'permissions'],
      })
    },
  })
}
