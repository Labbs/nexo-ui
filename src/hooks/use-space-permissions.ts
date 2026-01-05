import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/api/client'

export interface SpacePermission {
  id: string
  user_id?: string
  username?: string
  group_id?: string
  group_name?: string
  role: string
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
