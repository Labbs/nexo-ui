import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  databasePermissionList,
  databasePermissionUpsert,
  databasePermissionDelete,
} from '@/api/generated/database-permissions/database-permissions'
import type { DatabasePermissionItem, UpsertDatabasePermissionRequest } from '@/api/generated/model'

// Re-export type for backward compatibility
export type DatabasePermission = DatabasePermissionItem

export function useDatabasePermissions(databaseId?: string) {
  return useQuery({
    queryKey: ['databases', databaseId, 'permissions'],
    queryFn: () => databasePermissionList(databaseId!),
    select: (data) => data.permissions || [],
    enabled: !!databaseId,
  })
}

export function useUpsertDatabasePermission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
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
      return databasePermissionUpsert(databaseId, {
        user_id: userId,
        group_id: groupId,
        role,
      } as UpsertDatabasePermissionRequest)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['databases', variables.databaseId, 'permissions'] })
    },
  })
}

export function useDeleteDatabasePermission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      databaseId,
      userId,
      groupId,
    }: {
      databaseId: string
      userId?: string
      groupId?: string
    }) => {
      return databasePermissionDelete(databaseId, {
        user_id: userId,
        group_id: groupId,
      })
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['databases', variables.databaseId, 'permissions'] })
    },
  })
}
