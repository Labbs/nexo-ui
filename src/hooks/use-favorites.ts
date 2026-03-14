import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  userGetMyFavorites,
  userAddFavorite,
  userRemoveFavorite,
  userUpdateFavoritePosition,
} from '@/api/generated/user/user'

export function useFavorites() {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: () => userGetMyFavorites(),
    select: (data) => data.favorites || [],
  })
}

export function useAddFavorite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ spaceId, documentId }: { spaceId: string; documentId: string }) => {
      return userAddFavorite(spaceId, documentId, {})
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
    },
  })
}

export function useRemoveFavorite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (favoriteId: string) => {
      return userRemoveFavorite(favoriteId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
    },
  })
}

export function useUpdateFavoritePosition() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ favoriteId, position }: { favoriteId: string; position: number }) => {
      return userUpdateFavoritePosition(favoriteId, { position })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
    },
  })
}
