import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/api/client'

export interface TemplateItem {
  id: string
  name: string
  slug: string
  template_category: string
  config: {
    icon?: string
    full_width?: boolean
    header_background?: string
  }
  space_id: string
  space_name: string
}

export function useTemplates(spaceId?: string) {
  return useQuery({
    queryKey: ['templates', spaceId],
    queryFn: async () => {
      const params = spaceId ? `?space_id=${spaceId}` : ''
      const res = await apiClient.get<{ templates: TemplateItem[] }>(`/document/templates${params}`)
      return res.data.templates ?? []
    },
  })
}

export function useToggleTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      spaceId,
      documentId,
      isTemplate,
      category,
    }: {
      spaceId: string
      documentId: string
      isTemplate: boolean
      category?: string
    }) => {
      const res = await apiClient.patch(
        `/document/space/${spaceId}/${documentId}/template`,
        { is_template: isTemplate, category: category ?? '' }
      )
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] })
    },
  })
}

export function useCreateDocumentFromTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      spaceId,
      templateId,
      parentId,
    }: {
      spaceId: string
      templateId: string
      parentId?: string
    }) => {
      const res = await apiClient.post(`/document/space/${spaceId}`, {
        template_id: templateId,
        parent_id: parentId,
      })
      return res.data as { id: string; slug: string; name: string }
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['documents', variables.spaceId] })
    },
  })
}
