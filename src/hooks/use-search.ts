import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import type { components } from '@/api/types'

export interface DatabaseSearchResultItem {
  id: string
  name: string
  description: string
  icon?: string
  type: string
  space_id: string
  space_name: string
  updated_at: string
}

interface DatabaseSearchResponse {
  results: DatabaseSearchResultItem[]
}

export function useSearchDocuments(query: string) {
  return useQuery({
    queryKey: ['search', 'documents', query],
    queryFn: async () => {
      const response = await apiClient.get<components['schemas']['SearchResponse']>(
        `/document/search`,
        { params: { q: query, limit: 20 } }
      )
      return response.data.results || []
    },
    enabled: query.length >= 2,
    staleTime: 30_000,
  })
}

export function useSearchDatabases(query: string) {
  return useQuery({
    queryKey: ['search', 'databases', query],
    queryFn: async () => {
      const response = await apiClient.get<DatabaseSearchResponse>(
        `/databases/search`,
        { params: { q: query, limit: 20 } }
      )
      return response.data.results || []
    },
    enabled: query.length >= 2,
    staleTime: 30_000,
  })
}
