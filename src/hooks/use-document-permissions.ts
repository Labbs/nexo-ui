import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  documentListPermissions,
  documentUpsertUserPermission,
  documentDeleteUserPermission,
} from '@/api/generated/document/document'
import type { DocumentPermission as GenDocumentPermission, UpsertDocumentUserPermissionRequest } from '@/api/generated/model'

// Re-export type for backward compatibility
export type DocumentPermission = GenDocumentPermission

export function useDocumentPermissions(spaceId?: string, documentId?: string) {
  return useQuery({
    queryKey: ['document', spaceId, documentId, 'permissions'],
    queryFn: () => documentListPermissions(spaceId!, documentId!),
    select: (data) => data.permissions || [],
    enabled: !!spaceId && !!documentId,
  })
}

export function useUpsertDocumentPermission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      spaceId,
      documentId,
      userId,
      role,
    }: {
      spaceId: string
      documentId: string
      userId: string
      role: 'owner' | 'editor' | 'viewer' | 'denied'
    }) => {
      return documentUpsertUserPermission(spaceId, documentId, {
        user_id: userId,
        role,
      } as UpsertDocumentUserPermissionRequest)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['document', variables.spaceId, variables.documentId, 'permissions'],
      })
    },
  })
}

export function useDeleteDocumentPermission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      spaceId,
      documentId,
      userId,
    }: {
      spaceId: string
      documentId: string
      userId: string
    }) => {
      return documentDeleteUserPermission(spaceId, documentId, userId)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['document', variables.spaceId, variables.documentId, 'permissions'],
      })
    },
  })
}
