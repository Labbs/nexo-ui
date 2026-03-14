import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  drawingPermissionsList,
  drawingPermissionsUpsertUser,
  drawingPermissionsDeleteUser,
} from '@/api/generated/drawings/drawings'
import type { DrawingPermission as GenDrawingPermission, UpsertDrawingUserPermissionRequest } from '@/api/generated/model'

// Re-export type for backward compatibility
export type DrawingPermission = GenDrawingPermission

export function useDrawingPermissions(drawingId?: string) {
  return useQuery({
    queryKey: ['drawing', drawingId, 'permissions'],
    queryFn: () => drawingPermissionsList(drawingId!),
    select: (data) => data.permissions || [],
    enabled: !!drawingId,
  })
}

export function useUpsertDrawingPermission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      drawingId,
      userId,
      role,
    }: {
      drawingId: string
      userId: string
      role: 'owner' | 'editor' | 'viewer' | 'denied'
    }) => {
      return drawingPermissionsUpsertUser(drawingId, {
        user_id: userId,
        role,
      } as UpsertDrawingUserPermissionRequest)
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
    mutationFn: ({
      drawingId,
      userId,
    }: {
      drawingId: string
      userId: string
    }) => {
      return drawingPermissionsDeleteUser(drawingId, userId)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['drawing', variables.drawingId, 'permissions'],
      })
    },
  })
}
