import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import { useAuth } from '@/contexts/auth-context'

export function useSpaceOrder() {
  const { user } = useAuth()
  const spaceOrder: string[] = (user as any)?.preferences?.space_order || []
  return spaceOrder
}

export function useUpdateSpaceOrder() {
  const { refreshProfile } = useAuth()

  return useMutation({
    mutationFn: async ({ spaceIds }: { spaceIds: string[] }) => {
      const response = await apiClient.put<{ space_ids: string[] }>(
        '/user/preferences/space-order',
        { space_ids: spaceIds }
      )
      return response.data
    },
    onSuccess: () => {
      // Refresh profile to get updated preferences (including space_order)
      refreshProfile()
    },
  })
}
