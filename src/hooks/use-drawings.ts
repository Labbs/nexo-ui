import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { drawingList, drawingGet, drawingCreate, drawingUpdate, drawingMove, drawingDelete } from '@/api/generated/drawings/drawings'
import type { DrawingItem, GetDrawingResponse } from '@/api/generated/model'

// Re-export model types for consumers
export type { DrawingItem }
export type Drawing = GetDrawingResponse

export interface CreateDrawingInput {
  spaceId: string
  documentId?: string
  name: string
  elements?: unknown[]
  appState?: Record<string, unknown>
  files?: Record<string, unknown>
  thumbnail?: string
}

export interface UpdateDrawingInput {
  drawingId: string
  name?: string
  icon?: string
  elements?: unknown[]
  appState?: Record<string, unknown>
  files?: Record<string, unknown>
  thumbnail?: string
}

// Query keys factory
export const drawingKeys = {
  all: ['drawings'] as const,
  list: (spaceId: string) => [...drawingKeys.all, 'list', spaceId] as const,
  detail: (id: string) => [...drawingKeys.all, 'detail', id] as const,
}

// List drawings for a space
export function useDrawings(spaceId?: string) {
  return useQuery({
    queryKey: drawingKeys.list(spaceId || ''),
    queryFn: async () => {
      if (!spaceId) return []
      const response = await drawingList({ space_id: spaceId })
      return response.drawings || []
    },
    enabled: !!spaceId,
  })
}

// Get a single drawing
export function useDrawing(drawingId?: string) {
  return useQuery({
    queryKey: drawingKeys.detail(drawingId || ''),
    queryFn: async () => {
      if (!drawingId) return null
      const response = await drawingGet(drawingId)
      return response
    },
    enabled: !!drawingId,
  })
}

// Create a new drawing
export function useCreateDrawing() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateDrawingInput) => {
      const response = await drawingCreate({
        space_id: input.spaceId,
        document_id: input.documentId,
        name: input.name,
        elements: input.elements || [],
        app_state: input.appState || {},
        files: input.files || {},
        thumbnail: input.thumbnail,
      })
      return response
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: drawingKeys.list(variables.spaceId) })
    },
  })
}

// Update a drawing
export function useUpdateDrawing() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: UpdateDrawingInput) => {
      const response = await drawingUpdate(input.drawingId, {
        name: input.name,
        icon: input.icon,
        elements: input.elements,
        app_state: input.appState,
        files: input.files,
        thumbnail: input.thumbnail,
      })
      return response
    },
    onMutate: async (variables) => {
      const { drawingId, name, icon } = variables

      // Only optimistically update for name/icon changes (visible in sidebar)
      // Auto-save of canvas elements doesn't need optimistic cache updates
      if (name === undefined && icon === undefined) return

      await queryClient.cancelQueries({ queryKey: drawingKeys.detail(drawingId) })
      await queryClient.cancelQueries({ queryKey: drawingKeys.all })

      // Snapshot for rollback
      const previousDetail = queryClient.getQueryData(drawingKeys.detail(drawingId))
      const previousLists = queryClient.getQueriesData({ queryKey: drawingKeys.all })

      const applyUpdate = (drawing: Record<string, unknown>) => {
        if (!drawing) return drawing
        const updated = { ...drawing }
        if (name !== undefined) updated.name = name
        if (icon !== undefined) updated.icon = icon
        return updated
      }

      // Optimistically update the detail cache
      if (previousDetail) {
        queryClient.setQueryData(drawingKeys.detail(drawingId), applyUpdate(previousDetail as Record<string, unknown>))
      }

      // Optimistically update all list caches that contain this drawing
      for (const [queryKey, data] of previousLists) {
        if (!Array.isArray(data)) continue
        queryClient.setQueryData(queryKey, data.map((d: Record<string, unknown>) =>
          d.id === drawingId ? applyUpdate(d) : d
        ))
      }

      return { previousDetail, previousLists }
    },
    onError: (_err, variables, context) => {
      if (!context) return
      const { drawingId } = variables

      if (context.previousDetail) {
        queryClient.setQueryData(drawingKeys.detail(drawingId), context.previousDetail)
      }
      if (context.previousLists) {
        for (const [queryKey, data] of context.previousLists) {
          queryClient.setQueryData(queryKey, data)
        }
      }
    },
    onSettled: (_, _err, variables) => {
      if (variables.name !== undefined || variables.icon !== undefined) {
        // Name/icon changed — refetch detail and lists
        queryClient.invalidateQueries({ queryKey: drawingKeys.detail(variables.drawingId) })
        queryClient.invalidateQueries({ queryKey: drawingKeys.all })
      } else if (variables.elements !== undefined) {
        // Canvas auto-save — update cache directly without refetch
        // so navigating away and back shows the latest data
        queryClient.setQueryData(
          drawingKeys.detail(variables.drawingId),
          (old: Record<string, unknown> | undefined) => {
            if (!old) return old
            return {
              ...old,
              elements: variables.elements,
              app_state: variables.appState ?? (old as Record<string, unknown>).app_state,
              files: variables.files ?? (old as Record<string, unknown>).files,
            }
          }
        )
      }
    },
  })
}

// Move a drawing (change parent document)
export function useMoveDrawing() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ drawingId, documentId }: { drawingId: string; documentId?: string }) => {
      const response = await drawingMove(drawingId, { document_id: documentId || undefined })
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: drawingKeys.all })
    },
  })
}

// Delete a drawing
export function useDeleteDrawing() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (drawingId: string) => {
      const response = await drawingDelete(drawingId)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: drawingKeys.all })
    },
  })
}
