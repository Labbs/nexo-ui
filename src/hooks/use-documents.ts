import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { documentGetDocumentsFromSpace, documentGetDocument, documentCreateDocument, documentUpdateDocument, documentDeleteDocument, documentMoveDocument } from '@/api/generated/document/document'
import type { DocumentConfig, Document } from '@/api/generated/model'

export function useDocuments(spaceId?: string, parentId?: string) {
  return useQuery({
    queryKey: ['documents', spaceId, parentId],
    queryFn: async () => {
      if (!spaceId) return []

      const response = await documentGetDocumentsFromSpace(
        spaceId,
        parentId ? { parent_id: parentId } : undefined
      )
      return response.documents || []
    },
    enabled: !!spaceId,
  })
}

export function useDocument(spaceId?: string, identifier?: string) {
  return useQuery({
    queryKey: ['document', spaceId, identifier],
    queryFn: async () => {
      if (!spaceId || !identifier) return null

      const response = await documentGetDocument(spaceId, identifier)
      // The API now returns the document fields directly, not wrapped in { Document: {...} }
      return response || null
    },
    enabled: !!spaceId && !!identifier,
  })
}

export function useCreateDocument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ spaceId, parentId }: { spaceId: string; parentId?: string }) => {
      const response = await documentCreateDocument(spaceId, { parent_id: parentId })
      // Backend returns flattened document fields
      return response as unknown as Document
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
        (old: Document[] | undefined) => [...(old || []), optimisticDoc]
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
  config?: DocumentConfig
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
      const response = await documentUpdateDocument(spaceId, id, {
        content: content as unknown as import('@/api/generated/model').Block[],
        name,
        parent_id: parentId,
        config,
        metadata,
      })
      // Backend returns flattened document fields
      return response as unknown as Document
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
      const applyUpdate = (doc: Record<string, unknown>) => {
        if (!doc) return doc
        const updated = { ...doc }
        if (name !== undefined) updated.name = name
        if (config !== undefined) updated.config = { ...((doc.config as Record<string, unknown>) || {}), ...config }
        return updated
      }

      // Optimistically update the single document cache (by ID)
      if (previousDoc) {
        queryClient.setQueryData(['document', spaceId, id], applyUpdate(previousDoc as Record<string, unknown>))
      }

      // Optimistically update by slug
      if (slug && previousDocBySlug) {
        queryClient.setQueryData(['document', spaceId, slug], applyUpdate(previousDocBySlug as Record<string, unknown>))
      }

      // Optimistically update the documents list(s)
      for (const [queryKey, data] of previousDocsList) {
        if (!Array.isArray(data)) continue
        queryClient.setQueryData(queryKey, data.map((doc: Record<string, unknown>) => {
          const docId = doc.id || doc.document
          return docId === id ? applyUpdate(doc) : doc
        }))
      }

      // Optimistically update favorites
      if ((name !== undefined || config !== undefined) && Array.isArray(previousFavorites)) {
        queryClient.setQueryData(['favorites'], (previousFavorites as Record<string, unknown>[]).map((fav) => {
          const favDoc = fav?.document as Record<string, unknown> | undefined
          const favDocId = favDoc?.id
          if (favDocId !== id) return fav
          return { ...fav, document: applyUpdate(favDoc!) }
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
      const isContentOnly = variables.content !== undefined
        && variables.name === undefined
        && variables.config === undefined
        && variables.parentId === undefined
        && variables.metadata === undefined

      // Content-only saves: the page already holds the latest content in local state,
      // so skip refetching the document to avoid a full-page re-render flash.
      if (!isContentOnly) {
        queryClient.invalidateQueries({ queryKey: ['document', variables.spaceId, variables.id] })
        if (variables.slug) {
          queryClient.invalidateQueries({ queryKey: ['document', variables.spaceId, variables.slug] })
        }
      }
      // Only invalidate the documents list and favorites when name/config/parent changed
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
      await documentDeleteDocument(spaceId, identifier)
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
      const response = await documentMoveDocument(spaceId, id, { parent_id: parentId })
      return response
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['document', variables.spaceId, variables.id] })
      queryClient.invalidateQueries({ queryKey: ['documents', variables.spaceId] })
    },
  })
}
