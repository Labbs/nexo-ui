import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreateDocument } from '@/hooks/use-documents'
import type { Document } from '@/api/generated/model'
import { useCreateDrawing } from '@/hooks/use-drawings'
import { useCreateDatabase, type DatabaseType } from '@/hooks/use-database'
import { useToast } from '@/components/ui/toaster'

export function useCreateContent(spaceId: string | undefined) {
  const navigate = useNavigate()
  const { mutateAsync: createDocument } = useCreateDocument()
  const { mutateAsync: createDrawing } = useCreateDrawing()
  const { mutateAsync: createDatabase } = useCreateDatabase()
  const { show } = useToast()

  const handleCreateDocument = useCallback(async (parentId?: string) => {
    if (!spaceId) return
    try {
      const doc = await createDocument({ spaceId, parentId })
      const slug = (doc as Document & { slug?: string }).slug
      if (slug) navigate(`/space/${spaceId}/${slug}`)
    } catch {
      show({ title: 'Failed to create page', variant: 'destructive' })
    }
  }, [spaceId, createDocument, navigate, show])

  const handleCreateDrawing = useCallback(async (documentId?: string) => {
    if (!spaceId) return
    try {
      const result = await createDrawing({
        spaceId,
        documentId,
        name: 'Untitled Drawing',
        elements: [],
        appState: {},
        files: {},
      })
      if (result.id) navigate(`/space/${spaceId}/drawing/${result.id}`)
    } catch {
      show({ title: 'Failed to create drawing', variant: 'destructive' })
    }
  }, [spaceId, createDrawing, navigate, show])

  const handleCreateDatabase = useCallback(async (_type: DatabaseType, documentId?: string) => {
    if (!spaceId) return
    try {
      const result = await createDatabase({
        spaceId,
        documentId,
        name: 'Untitled Database',
        icon: '📚',
        schema: [{ id: 'title', name: 'Title', type: 'title' }],
        type: 'document',
      })
      if (result.id) navigate(`/space/${spaceId}/database/${result.id}`)
    } catch {
      show({ title: 'Failed to create database', variant: 'destructive' })
    }
  }, [spaceId, createDatabase, navigate, show])

  return {
    handleCreateDocument,
    handleCreateDrawing,
    handleCreateDatabase,
  }
}
