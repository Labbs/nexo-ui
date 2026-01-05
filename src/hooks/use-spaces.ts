import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import type { components } from '@/api/types'

export function useSpaces() {
  return useQuery({
    queryKey: ['spaces'],
    queryFn: async () => {
      const response = await apiClient.get<components['schemas']['GetMySpacesResponse']>('/user/my-spaces')
      return response.data.spaces || []
    },
  })
}

export function useCreateSpace() {
  const createSpace = async (
    name: string,
    icon?: string,
    iconColor?: string
  ): Promise<string> => {
    const response = await apiClient.post<components['schemas']['CreateSpaceResponse']>(
      '/space',
      { name, icon, icon_color: iconColor }
    )
    return (response.data as any).space_id || ''
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
      const response = await apiClient.put<{ space?: components['schemas']['Space'] }>(
        `/space/${spaceId}`,
        { name, icon, icon_color: iconColor }
      )
      return response.data.space
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
      await apiClient.delete(`/space/${spaceId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spaces'] })
    },
  })
}
