import { useMutation } from '@tanstack/react-query'
import { useAuth } from '@/contexts/auth-context'
import { userUpdateSpaceOrder } from '@/api/generated/user/user'

export function useSpaceOrder() {
  const { user } = useAuth()
  const spaceOrder: string[] = (user as Record<string, Record<string, string[]>> | null)?.preferences?.space_order || []
  return spaceOrder
}

export function useUpdateSpaceOrder() {
  const { refreshProfile } = useAuth()

  return useMutation({
    mutationFn: async ({ spaceIds }: { spaceIds: string[] }) => {
      const response = await userUpdateSpaceOrder({ space_ids: spaceIds })
      return response
    },
    onSuccess: () => {
      // Refresh profile to get updated preferences (including space_order)
      refreshProfile()
    },
  })
}
