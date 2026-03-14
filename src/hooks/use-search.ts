import { useQuery } from '@tanstack/react-query'
import { documentSearch } from '@/api/generated/document/document'
import { databaseSearch } from '@/api/generated/databases/databases'
import type { SearchDatabaseResultItem } from '@/api/generated/model'

// Re-export type for backward compatibility
export type { SearchDatabaseResultItem }

export function useSearchDocuments(query: string) {
  return useQuery({
    queryKey: ['search', 'documents', query],
    queryFn: () => documentSearch({ q: query, limit: 20 }),
    select: (data) => data.results || [],
    enabled: query.length >= 2,
    staleTime: 30_000,
  })
}

export function useSearchDatabases(query: string) {
  return useQuery({
    queryKey: ['search', 'databases', query],
    queryFn: () => databaseSearch({ q: query, limit: 20 }),
    select: (data) => data.results || [],
    enabled: query.length >= 2,
    staleTime: 30_000,
  })
}
