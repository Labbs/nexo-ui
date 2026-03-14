import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  spaceListPermissions,
  spaceUpsertUserPermission,
  spaceDeleteUserPermission,
} from '@/api/generated/space/space'
import type { SpacePermission as GenSpacePermission, UpsertSpaceUserPermissionRequest } from '@/api/generated/model'

// Re-export type for backward compatibility
export type SpacePermission = GenSpacePermission

export function useSpacePermissions(spaceId?: string | null) {
  return useQuery({
    queryKey: ['space', spaceId, 'permissions'],
    queryFn: () => spaceListPermissions(spaceId!),
    enabled: !!spaceId,
  })
}

export function useUpsertSpaceUserPermission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      spaceId,
      userId,
      role,
    }: {
      spaceId: string
      userId: string
      role: string
    }) => {
      return spaceUpsertUserPermission(spaceId, {
        user_id: userId,
        role,
      } as UpsertSpaceUserPermissionRequest)
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
    mutationFn: ({
      spaceId,
      userId,
    }: {
      spaceId: string
      userId: string
    }) => {
      return spaceDeleteUserPermission(spaceId, userId)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['space', variables.spaceId, 'permissions'],
      })
    },
  })
}
