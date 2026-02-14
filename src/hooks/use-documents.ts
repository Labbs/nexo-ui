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
    onMutate: async (variables) => {
      const { spaceId, parentId } = variables

      await queryClient.cancelQueries({ queryKey: ['documents', spaceId, parentId] })
      // Also cancel the root list if creating under a parent
      if (parentId) {
        await queryClient.cancelQueries({ queryKey: ['documents', spaceId, undefined] })
      }

      const previousDocs = queryClient.getQueryData(['documents', spaceId, parentId])

      // Create a temporary optimistic document
      const tempId = `temp-${Date.now()}`
      const optimisticDoc = {
        id: tempId,
        document: tempId,
        name: '',
        slug: tempId,
        parent_id: parentId || null,
        config: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      queryClient.setQueryData(
        ['documents', spaceId, parentId],
        (old: any[] | undefined) => [...(old || []), optimisticDoc]
      )

      return { previousDocs, parentId }
    },
    onError: (_err, variables, context) => {
      if (!context) return
      queryClient.setQueryData(
        ['documents', variables.spaceId, context.parentId],
        context.previousDocs
      )
    },
    onSettled: (_, _err, variables) => {
      // Refetch to replace optimistic entry with real server data
      queryClient.invalidateQueries({ queryKey: ['documents', variables.spaceId] })
    },
  })
}

type UpdateDocumentVariables = {
  spaceId: string
  id: string
  slug?: string
  content?: string
  name?: string
  parentId?: string
  config?: components['schemas']['DocumentConfig']
  metadata?: Record<string, unknown>
}

export function useUpdateDocument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      spaceId,
      id,
      content,
      name,
      parentId,
      config,
      metadata,
    }: UpdateDocumentVariables) => {
      const response = await apiClient.put<components['schemas']['UpdateDocumentResponse']>(
        `/document/space/${spaceId}/${id}`,
        { content, name, parent_id: parentId, config, metadata }
      )
      // Backend returns flattened document fields
      return response.data as unknown as components['schemas']['Document']
    },
    onMutate: async (variables) => {
      const { spaceId, id, slug, name, config } = variables

      // Only optimistically update for name/config changes (visible in sidebar/favorites)
      // Content changes are local-state driven and don't need optimistic cache updates
      if (name === undefined && config === undefined) return

      // Cancel outgoing refetches so they don't overwrite our optimistic update
      const queriesToCancel = [
        ['document', spaceId, id],
        ['documents', spaceId],
      ]
      if (slug) queriesToCancel.push(['document', spaceId, slug])
      if (name !== undefined || config !== undefined) queriesToCancel.push(['favorites'])

      await Promise.all(queriesToCancel.map(key => queryClient.cancelQueries({ queryKey: key })))

      // Snapshot previous values for rollback
      const previousDoc = queryClient.getQueryData(['document', spaceId, id])
      const previousDocBySlug = slug ? queryClient.getQueryData(['document', spaceId, slug]) : undefined
      const previousDocsList = queryClient.getQueriesData({ queryKey: ['documents', spaceId] })
      const previousFavorites = queryClient.getQueryData(['favorites'])

      // Helper to apply partial updates to a document object
      const applyUpdate = (doc: any) => {
        if (!doc) return doc
        const updated = { ...doc }
        if (name !== undefined) updated.name = name
        if (config !== undefined) updated.config = { ...(doc.config || {}), ...config }
        return updated
      }

      // Optimistically update the single document cache (by ID)
      if (previousDoc) {
        queryClient.setQueryData(['document', spaceId, id], applyUpdate(previousDoc))
      }

      // Optimistically update by slug
      if (slug && previousDocBySlug) {
        queryClient.setQueryData(['document', spaceId, slug], applyUpdate(previousDocBySlug))
      }

      // Optimistically update the documents list(s)
      for (const [queryKey, data] of previousDocsList) {
        if (!Array.isArray(data)) continue
        queryClient.setQueryData(queryKey, data.map((doc: any) => {
          const docId = doc.id || doc.document
          return docId === id ? applyUpdate(doc) : doc
        }))
      }

      // Optimistically update favorites
      if ((name !== undefined || config !== undefined) && Array.isArray(previousFavorites)) {
        queryClient.setQueryData(['favorites'], (previousFavorites as any[]).map((fav: any) => {
          const favDocId = fav?.document?.id
          if (favDocId !== id) return fav
          return { ...fav, document: applyUpdate(fav.document) }
        }))
      }

      return { previousDoc, previousDocBySlug, previousDocsList, previousFavorites }
    },
    onError: (_err, variables, context) => {
      if (!context) return
      const { spaceId, id, slug } = variables

      // Rollback all caches to previous state
      if (context.previousDoc) {
        queryClient.setQueryData(['document', spaceId, id], context.previousDoc)
      }
      if (slug && context.previousDocBySlug) {
        queryClient.setQueryData(['document', spaceId, slug], context.previousDocBySlug)
      }
      if (context.previousDocsList) {
        for (const [queryKey, data] of context.previousDocsList) {
          queryClient.setQueryData(queryKey, data)
        }
      }
      if (context.previousFavorites) {
        queryClient.setQueryData(['favorites'], context.previousFavorites)
      }
    },
    onSettled: (_data, _err, variables) => {
      // Always refetch the individual document after mutation settles
      queryClient.invalidateQueries({ queryKey: ['document', variables.spaceId, variables.id] })
      if (variables.slug) {
        queryClient.invalidateQueries({ queryKey: ['document', variables.spaceId, variables.slug] })
      }
      // Only invalidate the documents list and favorites when name/config/parent changed
      // Content-only saves don't need to refetch the sidebar tree
      if (variables.name !== undefined || variables.config !== undefined || variables.parentId !== undefined) {
        queryClient.invalidateQueries({ queryKey: ['documents', variables.spaceId] })
      }
      if (variables.name !== undefined || variables.config !== undefined) {
        queryClient.invalidateQueries({ queryKey: ['favorites'] })
      }
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
      // Invalidate favorites in case the deleted document was favorited
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
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
