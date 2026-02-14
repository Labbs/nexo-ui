import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/api/client'

export interface VersionItem {
  id: string
  version: number
  name: string
  description?: string
  user_id: string
  user_name: string
  created_at: string
}

export interface VersionDetail {
  id: string
  version: number
  document_id: string
  name: string
  content: any[]
  config: {
    full_width: boolean
    icon?: string
    lock: boolean
    header_background?: string
  }
  description?: string
  user_id: string
  user_name: string
  created_at: string
}

export interface ListVersionsResponse {
  versions: VersionItem[]
  total_count: number
}

export function useVersions(spaceId?: string, documentId?: string, options?: { enabled?: boolean; limit?: number; offset?: number }) {
  const { enabled = true, limit = 20, offset = 0 } = options || {}

  return useQuery({
    queryKey: ['versions', spaceId, documentId, limit, offset],
    queryFn: async () => {
      if (!spaceId || !documentId) return { versions: [], total_count: 0 }

      const response = await apiClient.get<ListVersionsResponse>(
        `/document/space/${spaceId}/${documentId}/versions?limit=${limit}&offset=${offset}`
      )
      return response.data
    },
    enabled: enabled && !!spaceId && !!documentId,
  })
}

export function useVersion(spaceId?: string, documentId?: string, versionId?: string) {
  return useQuery({
    queryKey: ['version', spaceId, documentId, versionId],
    queryFn: async () => {
      if (!spaceId || !documentId || !versionId) return null

      const response = await apiClient.get<VersionDetail>(
        `/document/space/${spaceId}/${documentId}/versions/${versionId}`
      )
      return response.data
    },
    enabled: !!spaceId && !!documentId && !!versionId,
<<<<<<< HEAD
=======
    staleTime: Infinity, // Versions are immutable once created
>>>>>>> d4609d4 (feat: add hooks for managing spaces, users, versions, and webhooks)
  })
}

export function useCreateVersion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      spaceId,
      documentId,
      description,
    }: {
      spaceId: string
      documentId: string
      description?: string
    }) => {
      const response = await apiClient.post<{ version_id: string; version: number }>(
        `/document/space/${spaceId}/${documentId}/versions`,
        { description }
      )
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['versions', variables.spaceId, variables.documentId] })
    },
  })
}

export function useRestoreVersion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      spaceId,
      documentId,
      versionId,
    }: {
      spaceId: string
      documentId: string
      versionId: string
    }) => {
      await apiClient.post(`/document/space/${spaceId}/${documentId}/versions/${versionId}/restore`)
    },
    onSuccess: (_, variables) => {
<<<<<<< HEAD
      // Invalidate both the document and versions
      queryClient.invalidateQueries({ queryKey: ['document', variables.spaceId] })
=======
      // Invalidate only the specific document, not all documents in the space
      queryClient.invalidateQueries({ queryKey: ['document', variables.spaceId, variables.documentId] })
>>>>>>> d4609d4 (feat: add hooks for managing spaces, users, versions, and webhooks)
      queryClient.invalidateQueries({ queryKey: ['versions', variables.spaceId, variables.documentId] })
    },
  })
}
