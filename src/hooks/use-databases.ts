import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/api/client'

export interface PropertySchema {
  id: string
  name: string
  type: string
  options?: Record<string, unknown>
}

export interface ViewConfig {
  id: string
  name: string
  type: string
  filter?: Record<string, unknown>
  sort?: { property_id: string; direction: string }[]
  columns?: string[]
}

export interface Database {
  id: string
  document_id?: string
  name: string
  description: string
  icon: string
  row_count: number
  created_by: string
  created_at: string
  updated_at: string
}

export interface DatabaseDetail extends Database {
  space_id: string
  document_id?: string
  schema: PropertySchema[]
  views: ViewConfig[]
  default_view: string
}

export interface DatabaseRow {
  id: string
  properties: Record<string, unknown>
  created_by: string
  created_at: string
  updated_at: string
}

export interface DatabaseRowDetail extends DatabaseRow {
  database_id: string
  content?: Record<string, unknown>
}

export interface TypeInfo {
  type: string
  description: string
}

export function useDatabases(spaceId: string) {
  return useQuery({
    queryKey: ['databases', spaceId],
    queryFn: async () => {
      const response = await apiClient.get<{ databases: Database[] }>(
        `/databases?space_id=${spaceId}`
      )
      return response.data.databases || []
    },
    enabled: !!spaceId,
  })
}

export function useDatabase(databaseId: string) {
  return useQuery({
    queryKey: ['databases', 'detail', databaseId],
    queryFn: async () => {
      const response = await apiClient.get<DatabaseDetail>(`/databases/${databaseId}`)
      return response.data
    },
    enabled: !!databaseId,
  })
}

export function useAvailablePropertyTypes() {
  return useQuery({
    queryKey: ['databases', 'types'],
    queryFn: async () => {
      const response = await apiClient.get<{ types: TypeInfo[] }>('/databases/types')
      return response.data.types || []
    },
  })
}

// Default schema for new databases
const defaultSchema: PropertySchema[] = [
  { id: 'title', name: 'Name', type: 'title' },
]

export function useCreateDatabase() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      spaceId,
      name = 'Untitled Database',
      description,
      icon,
      schema = defaultSchema,
      documentId,
    }: {
      spaceId: string
      name?: string
      description?: string
      icon?: string
      schema?: PropertySchema[]
      documentId?: string
    }) => {
      const response = await apiClient.post<{
        id: string
        name: string
        description: string
        icon: string
        schema: PropertySchema[]
        default_view: string
        created_at: string
      }>('/databases', {
        space_id: spaceId,
        name,
        description,
        icon,
        schema,
        document_id: documentId,
      })
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['databases', variables.spaceId] })
    },
  })
}

export function useUpdateDatabase() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      databaseId,
      name,
      description,
      icon,
      schema,
      defaultView,
    }: {
      databaseId: string
      name?: string
      description?: string
      icon?: string
      schema?: PropertySchema[]
      defaultView?: string
    }) => {
      await apiClient.put(`/databases/${databaseId}`, {
        name,
        description,
        icon,
        schema,
        default_view: defaultView,
      })
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['databases'] })
      queryClient.invalidateQueries({ queryKey: ['databases', 'detail', variables.databaseId] })
    },
  })
}

export function useDeleteDatabase() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ databaseId }: { databaseId: string }) => {
      await apiClient.delete(`/databases/${databaseId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['databases'] })
    },
  })
}

// Row operations
export function useDatabaseRows(databaseId: string, limit = 50, offset = 0) {
  return useQuery({
    queryKey: ['databases', databaseId, 'rows', { limit, offset }],
    queryFn: async () => {
      const response = await apiClient.get<{ rows: DatabaseRow[]; total_count: number }>(
        `/databases/${databaseId}/rows?limit=${limit}&offset=${offset}`
      )
      return response.data
    },
    enabled: !!databaseId,
  })
}

export function useDatabaseRow(databaseId: string, rowId: string) {
  return useQuery({
    queryKey: ['databases', databaseId, 'rows', rowId],
    queryFn: async () => {
      const response = await apiClient.get<DatabaseRowDetail>(
        `/databases/${databaseId}/rows/${rowId}`
      )
      return response.data
    },
    enabled: !!databaseId && !!rowId,
  })
}

export function useCreateDatabaseRow() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      databaseId,
      properties,
      content,
    }: {
      databaseId: string
      properties: Record<string, unknown>
      content?: Record<string, unknown>
    }) => {
      const response = await apiClient.post<{
        id: string
        properties: Record<string, unknown>
        created_at: string
      }>(`/databases/${databaseId}/rows`, { properties, content })
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['databases', variables.databaseId, 'rows'] })
    },
  })
}

export function useUpdateDatabaseRow() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      databaseId,
      rowId,
      properties,
      content,
    }: {
      databaseId: string
      rowId: string
      properties?: Record<string, unknown>
      content?: Record<string, unknown>
    }) => {
      await apiClient.put(`/databases/${databaseId}/rows/${rowId}`, { properties, content })
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['databases', variables.databaseId, 'rows'] })
    },
  })
}

export function useDeleteDatabaseRow() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ databaseId, rowId }: { databaseId: string; rowId: string }) => {
      await apiClient.delete(`/databases/${databaseId}/rows/${rowId}`)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['databases', variables.databaseId, 'rows'] })
    },
  })
}

export function useBulkDeleteDatabaseRows() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ databaseId, rowIds }: { databaseId: string; rowIds: string[] }) => {
      await apiClient.delete(`/databases/${databaseId}/rows`, { data: { row_ids: rowIds } })
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['databases', variables.databaseId, 'rows'] })
    },
  })
}
