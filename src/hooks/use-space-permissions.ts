import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/api/client'

export interface SpacePermission {
  id: string
  user_id?: string
  username?: string
  group_id?: string
  group_name?: string
  role: string
  created_at?: string
}

interface ListSpacePermissionsResponse {
  permissions: SpacePermission[]
}

export function useSpacePermissions(spaceId?: string | null) {
  return useQuery({
    queryKey: ['space', spaceId, 'permissions'],
    queryFn: async () => {
      const response = await apiClient.get<ListSpacePermissionsResponse>(
        `/space/${spaceId}/permissions`
      )
      return response.data
    },
    enabled: !!spaceId,
  })
}

export function useUpsertSpaceUserPermission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      spaceId,
      userId,
      role,
    }: {
      spaceId: string
      userId: string
      role: string
    }) => {
      await apiClient.put(`/space/${spaceId}/permissions`, {
        user_id: userId,
        role,
      })
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['space', variables.spaceId, 'permissions'],
      })
    },
  })
}

export function useDeleteSpaceUserPermission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      spaceId,
      userId,
    }: {
      spaceId: string
      userId: string
    }) => {
      await apiClient.delete(`/space/${spaceId}/permissions/${userId}`)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['space', variables.spaceId, 'permissions'],
      })
    },
  })
}
