import { useQuery } from '@tanstack/react-query'
import { userListUsers } from '@/api/generated/user/user'
import type { UserListItem } from '@/api/generated/model'

// Re-export type for backward compatibility
export type { UserListItem }

/**
 * Hook to fetch list of users (simplified - just id, username, avatar)
 * This is a non-admin endpoint accessible to all authenticated users
 */
export function useUsers(limit = 100, offset = 0) {
  return useQuery({
    queryKey: ['users', 'list', limit, offset],
    queryFn: () => userListUsers({ limit, offset }),
    staleTime: 2 * 60_000, // User list is nearly static, 2 min
  })
}
