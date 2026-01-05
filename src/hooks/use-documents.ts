import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import type { components } from '@/api/types'

export function useDocuments(spaceId?: string, parentId?: string) {
  return useQuery({
    queryKey: ['documents', spaceId, parentId],
    queryFn: async () => {
      if (!spaceId) return []

      const params = parentId ? `?parent_id=${parentId}` : ''
      const response = await apiClient.get<components['schemas']['GetDocumentsFromSpaceResponse']>(
        `/document/space/${spaceId}${params}`
      )
      return response.data.documents || []
    },
    enabled: !!spaceId,
  })
}

export function useDocument(spaceId?: string, identifier?: string) {
  return useQuery({
    queryKey: ['document', spaceId, identifier],
    queryFn: async () => {
      if (!spaceId || !identifier) return null

      const response = await apiClient.get<components['schemas']['GetDocumentResponse']>(
        `/document/space/${spaceId}/${identifier}`
      )
      // The API now returns the document fields directly, not wrapped in { Document: {...} }
      return response.data || null
    },
    enabled: !!spaceId && !!identifier,
  })
}

export function useCreateDocument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ spaceId, parentId }: { spaceId: string; parentId?: string }) => {
      const response = await apiClient.post<components['schemas']['CreateDocumentResponse']>(
        `/document/space/${spaceId}`,
        { parent_id: parentId }
      )
      // Backend returns flattened document fields
      return response.data as unknown as components['schemas']['Document']
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['documents', variables.spaceId] })
    },
  })
}

export function useUpdateDocument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      spaceId,
      id,
      slug: _slug,
      content,
      name,
      parentId,
      config,
      metadata,
    }: {
      spaceId: string
      id: string
      slug?: string
      content?: string
      name?: string
      parentId?: string
      config?: components['schemas']['DocumentConfig']
      metadata?: Record<string, unknown>
    }) => {
      const response = await apiClient.put<components['schemas']['UpdateDocumentResponse']>(
        `/document/space/${spaceId}/${id}`,
        { content, name, parent_id: parentId, config, metadata }
      )
      // Backend returns flattened document fields
      return response.data as unknown as components['schemas']['Document']
    },
    onSuccess: (_data, variables) => {
      // Invalidate by ID
      queryClient.invalidateQueries({ queryKey: ['document', variables.spaceId, variables.id] })
      // Also invalidate by slug if provided (used for route-based queries)
      if (variables.slug) {
        queryClient.invalidateQueries({ queryKey: ['document', variables.spaceId, variables.slug] })
      }
      // Invalidate documents list
      queryClient.invalidateQueries({ queryKey: ['documents', variables.spaceId] })
    },
  })
}

export function useDeleteDocument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ spaceId, identifier }: { spaceId: string; identifier: string }) => {
      await apiClient.delete(`/document/space/${spaceId}/${identifier}`)
    },
    onSuccess: (_, variables) => {
      // Invalidate documents list
      queryClient.invalidateQueries({ queryKey: ['documents', variables.spaceId] })
      // Remove the deleted document from cache
      queryClient.removeQueries({ queryKey: ['document', variables.spaceId, variables.identifier] })
    },
  })
}

export function useMoveDocument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ spaceId, id, parentId }: { spaceId: string; id: string; parentId?: string }) => {
      const response = await apiClient.patch<components['schemas']['Document']>(
        `/document/space/${spaceId}/${id}/move`,
        { parent_id: parentId }
      )
      return response.data
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['document', variables.spaceId, variables.id] })
      queryClient.invalidateQueries({ queryKey: ['documents', variables.spaceId] })
    },
  })
}
