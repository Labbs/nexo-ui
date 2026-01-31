import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/api/client'

// Types
export interface DrawingItem {
  id: string
  document_id?: string
  name: string
  icon?: string
  thumbnail?: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface Drawing {
  id: string
  space_id: string
  document_id?: string
  name: string
  icon?: string
  elements: unknown[]
  app_state: Record<string, unknown>
  files: Record<string, unknown>
  thumbnail?: string
  created_by: string
  created_at: string
  updated_at: string
}

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
      const response = await apiClient.get<{ drawings: DrawingItem[] }>(
        `/drawings?space_id=${spaceId}`
      )
      return response.data.drawings || []
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
      const response = await apiClient.get<Drawing>(`/drawings/${drawingId}`)
      return response.data
    },
    enabled: !!drawingId,
  })
}

// Create a new drawing
export function useCreateDrawing() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateDrawingInput) => {
      const response = await apiClient.post<{ id: string; name: string; created_at: string }>(
        '/drawings',
        {
          space_id: input.spaceId,
          document_id: input.documentId,
          name: input.name,
          elements: input.elements || [],
          app_state: input.appState || {},
          files: input.files || {},
          thumbnail: input.thumbnail,
        }
      )
      return response.data
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
      const response = await apiClient.put<{ message: string }>(
        `/drawings/${input.drawingId}`,
        {
          name: input.name,
          icon: input.icon,
          elements: input.elements,
          app_state: input.appState,
          files: input.files,
          thumbnail: input.thumbnail,
        }
      )
      return response.data
    },
    onSuccess: (_, variables) => {
      // Only invalidate if name or icon changed (which affects the list display)
      // Don't invalidate on auto-save to avoid re-fetching and re-rendering
      if (variables.name !== undefined || variables.icon !== undefined) {
        queryClient.invalidateQueries({ queryKey: drawingKeys.detail(variables.drawingId) })
        queryClient.invalidateQueries({ queryKey: drawingKeys.all })
      }
    },
  })
}

// Move a drawing (change parent document)
export function useMoveDrawing() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ drawingId, documentId }: { drawingId: string; documentId?: string }) => {
      const response = await apiClient.patch<{ id: string; document_id?: string }>(
        `/drawings/${drawingId}/move`,
        { document_id: documentId || null }
      )
      return response.data
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
      const response = await apiClient.delete<{ message: string }>(`/drawings/${drawingId}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: drawingKeys.all })
    },
  })
}
