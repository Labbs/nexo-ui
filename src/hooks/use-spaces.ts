import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/contexts/auth-context'
import { userGetMySpaces } from '@/api/generated/user/user'
import { spaceCreateSpace, spaceUpdateSpace, spaceDeleteSpace } from '@/api/generated/space/space'
import type { CreateSpaceRequestType } from '@/api/generated/model'

export function useSpaces() {
  const { token } = useAuth()

  return useQuery({
    queryKey: ['spaces'],
    queryFn: async () => {
      const response = await userGetMySpaces()
      return response.spaces || []
    },
    enabled: !!token,
    staleTime: 60_000, // Spaces rarely change, 1 min
  })
}

export function useCreateSpace() {
  const createSpace = async (
    name: string,
    icon?: string,
    iconColor?: string,
    type?: 'public' | 'private'
  ): Promise<string> => {
    const response = await spaceCreateSpace({
      name,
      icon,
      icon_color: iconColor,
      type: type as CreateSpaceRequestType | undefined,
    })
    return response.space_id || ''
  }

  return { createSpace }
}

export function useUpdateSpace() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      spaceId,
      name,
      icon,
      iconColor,
    }: {
      spaceId: string
      name?: string
      icon?: string
      iconColor?: string
    }) => {
      const response = await spaceUpdateSpace(spaceId, {
        name,
        icon,
        icon_color: iconColor,
      })
      return response.space
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spaces'] })
    },
  })
}

export function useDeleteSpace() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ spaceId }: { spaceId: string }) => {
      await spaceDeleteSpace(spaceId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spaces'] })
    },
  })
}
