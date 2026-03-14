import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  documentListVersions,
  documentGetVersion,
  documentCreateVersion,
  documentRestoreVersion,
} from '@/api/generated/document/document'
import type {
  VersionItem,
  GetVersionResponse,
  ListVersionsResponse,
} from '@/api/generated/model'

// Re-export types for backward compatibility
export type { VersionItem, ListVersionsResponse }
export type VersionDetail = GetVersionResponse

export function useVersions(spaceId?: string, documentId?: string, options?: { enabled?: boolean; limit?: number; offset?: number }) {
  const { enabled = true, limit = 20, offset = 0 } = options || {}

  return useQuery({
    queryKey: ['versions', spaceId, documentId, limit, offset],
    queryFn: () => {
      if (!spaceId || !documentId) return { versions: [], total_count: 0 } as ListVersionsResponse
      return documentListVersions(spaceId, documentId, { limit, offset })
    },
    enabled: enabled && !!spaceId && !!documentId,
  })
}

export function useVersion(spaceId?: string, documentId?: string, versionId?: string) {
  return useQuery({
    queryKey: ['version', spaceId, documentId, versionId],
    queryFn: () => {
      if (!spaceId || !documentId || !versionId) return null
      return documentGetVersion(spaceId, documentId, versionId)
    },
    enabled: !!spaceId && !!documentId && !!versionId,
    staleTime: Infinity, // Versions are immutable once created
  })
}

export function useCreateVersion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      spaceId,
      documentId,
      description,
    }: {
      spaceId: string
      documentId: string
      description?: string
    }) => {
      return documentCreateVersion(spaceId, documentId, { description })
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['versions', variables.spaceId, variables.documentId] })
    },
  })
}

export function useRestoreVersion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      spaceId,
      documentId,
      versionId,
    }: {
      spaceId: string
      documentId: string
      versionId: string
    }) => {
      return documentRestoreVersion(spaceId, documentId, versionId, {})
    },
    onSuccess: (_, variables) => {
      // Invalidate only the specific document, not all documents in the space
      queryClient.invalidateQueries({ queryKey: ['document', variables.spaceId, variables.documentId] })
      queryClient.invalidateQueries({ queryKey: ['versions', variables.spaceId, variables.documentId] })
    },
  })
}
