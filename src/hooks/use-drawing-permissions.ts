import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/api/client'

export interface DrawingPermission {
  id: string
  user_id?: string
  username?: string
  group_id?: string
  group_name?: string
  role: 'owner' | 'editor' | 'viewer' | 'denied'
}

export function useDrawingPermissions(drawingId?: string) {
  return useQuery({
    queryKey: ['drawing', drawingId, 'permissions'],
    queryFn: async () => {
      const response = await apiClient.get<{ permissions: DrawingPermission[] }>(
        `/drawings/${drawingId}/permissions`
      )
      return response.data.permissions || []
    },
    enabled: !!drawingId,
  })
}

export function useUpsertDrawingPermission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      drawingId,
      userId,
      role,
    }: {
      drawingId: string
      userId: string
      role: 'owner' | 'editor' | 'viewer' | 'denied'
    }) => {
      await apiClient.put(`/drawings/${drawingId}/permissions/user`, {
        user_id: userId,
        role,
      })
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['drawing', variables.drawingId, 'permissions'],
      })
    },
  })
}

export function useDeleteDrawingPermission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      drawingId,
      userId,
    }: {
      drawingId: string
      userId: string
    }) => {
      await apiClient.delete(`/drawings/${drawingId}/permissions/user/${userId}`)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['drawing', variables.drawingId, 'permissions'],
      })
    },
  })
}
