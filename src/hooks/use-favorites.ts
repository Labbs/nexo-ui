import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import type { components } from '@/api/types'

export function useFavorites() {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const response = await apiClient.get<components['schemas']['GetMyFavoritesResponse']>('/user/my-favorites')
      return response.data.favorites || []
    },
  })
}

export function useAddFavorite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ spaceId, documentId }: { spaceId: string; documentId: string }) => {
      const response = await apiClient.post<components['schemas']['AddFavoriteResponse']>(
        `/user/favorite/${spaceId}/${documentId}`,
        { SpaceId: spaceId, DocumentId: documentId }
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
    },
  })
}

export function useRemoveFavorite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (favoriteId: string) => {
      const response = await apiClient.delete<components['schemas']['RemoveFavoriteResponse']>(
        `/user/favorite/${favoriteId}`
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
    },
  })
}

export function useUpdateFavoritePosition() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ favoriteId, position }: { favoriteId: string; position: number }) => {
      const response = await apiClient.put<{ message?: string }>(
        `/user/favorite/${favoriteId}/position`,
        { position }
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
    },
  })
}
