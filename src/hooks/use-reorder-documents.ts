import { useMutation, useQueryClient } from '@tanstack/react-query'
import { documentReorderDocuments } from '@/api/generated/document/document'
import type { ReorderItem } from '@/api/generated/model'

export function useReorderDocuments() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ spaceId, items }: { spaceId: string; items: ReorderItem[] }) => {
      return documentReorderDocuments(spaceId, { items })
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['documents', variables.spaceId] })
    },
  })
}
