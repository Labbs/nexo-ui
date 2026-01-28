import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/api/client'

// Simplified user type for person picker
export interface UserListItem {
  id: string
  username: string
  avatar_url?: string
}

interface ListUsersResponse {
  users: UserListItem[]
  total_count: number
}

/**
 * Hook to fetch list of users (simplified - just id, username, avatar)
 * This is a non-admin endpoint accessible to all authenticated users
 */
export function useUsers(limit = 100, offset = 0) {
  return useQuery({
    queryKey: ['users', 'list', limit, offset],
    queryFn: async () => {
      const response = await apiClient.get<ListUsersResponse>(
        `/user/list?limit=${limit}&offset=${offset}`
      )
      return response.data
    },
  })
}
