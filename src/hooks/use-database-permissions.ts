import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/api/client'

export interface DatabasePermission {
  id: string
  user_id?: string
  username?: string
  group_id?: string
  group_name?: string
  role: 'editor' | 'viewer' | 'denied'
}

export function useDatabasePermissions(databaseId?: string) {
  return useQuery({
    queryKey: ['databases', databaseId, 'permissions'],
    queryFn: async () => {
      const response = await apiClient.get<{ permissions: DatabasePermission[] }>(
        `/databases/${databaseId}/permissions`
      )
      return response.data.permissions || []
    },
    enabled: !!databaseId,
  })
}

export function useUpsertDatabasePermission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      databaseId,
      userId,
      groupId,
      role,
    }: {
      databaseId: string
      userId?: string
      groupId?: string
      role: 'editor' | 'viewer' | 'denied'
    }) => {
      await apiClient.post(`/databases/${databaseId}/permissions`, {
        user_id: userId,
        group_id: groupId,
        role,
      })
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['databases', variables.databaseId, 'permissions'] })
    },
  })
}

export function useDeleteDatabasePermission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      databaseId,
      userId,
      groupId,
    }: {
      databaseId: string
      userId?: string
      groupId?: string
    }) => {
      const params = new URLSearchParams()
      if (userId) params.set('user_id', userId)
      if (groupId) params.set('group_id', groupId)
      await apiClient.delete(`/databases/${databaseId}/permissions?${params.toString()}`)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['databases', variables.databaseId, 'permissions'] })
    },
  })
}
