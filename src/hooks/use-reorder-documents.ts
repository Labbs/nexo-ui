import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/api/client'

interface ReorderItem {
  id: string
  position: number
}

export function useReorderDocuments() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ spaceId, items }: { spaceId: string; items: ReorderItem[] }) => {
      await apiClient.patch(`/document/space/${spaceId}/reorder`, { items })
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['documents', variables.spaceId] })
    },
  })
}
