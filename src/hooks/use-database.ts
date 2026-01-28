import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import type { components } from '@/api/types'

// Types
export type PropertySchema = components['schemas']['PropertySchema']
export type DatabaseItem = components['schemas']['DatabaseItem']
export type RowItem = components['schemas']['RowItem']
export type GetDatabaseResponse = components['schemas']['GetDatabaseResponse']
export type ListRowsResponse = components['schemas']['ListRowsResponse']

// View types
export interface ViewConfig {
  id: string
  name: string
  type: string
  filter?: Record<string, unknown>
  sort?: SortConfig[]
  columns?: string[]
  hiddenColumns?: string[]
  groupBy?: string
}

export interface SortConfig {
  property_id: string
  direction: 'asc' | 'desc'
}

export interface FilterRule {
  property: string
  condition: string
  value?: unknown
}

export interface FilterConfig {
  and?: FilterRule[]
  or?: FilterRule[]
}

// Query keys factory
export const databaseKeys = {
  all: ['databases'] as const,
  list: (spaceId: string) => [...databaseKeys.all, 'list', spaceId] as const,
  detail: (id: string) => [...databaseKeys.all, 'detail', id] as const,
  rows: (id: string) => [...databaseKeys.all, 'rows', id] as const,
  rowsWithView: (id: string, viewId: string) => [...databaseKeys.all, 'rows', id, 'view', viewId] as const,
  row: (databaseId: string, rowId: string) => [...databaseKeys.all, 'row', databaseId, rowId] as const,
}

// List databases for a space
export function useDatabases(spaceId?: string) {
  return useQuery({
    queryKey: databaseKeys.list(spaceId || ''),
    queryFn: async () => {
      if (!spaceId) return []
      const response = await apiClient.get<components['schemas']['ListDatabasesResponse']>(
        `/databases?space_id=${spaceId}`
      )
      return response.data.databases || []
    },
    enabled: !!spaceId,
  })
}

// Get a single database with schema
export function useDatabase(databaseId?: string) {
  return useQuery({
    queryKey: databaseKeys.detail(databaseId || ''),
    queryFn: async () => {
      if (!databaseId) return null
      const response = await apiClient.get<GetDatabaseResponse>(
        `/databases/${databaseId}`
      )
      return response.data
    },
    enabled: !!databaseId,
  })
}

// Get rows for a database
export function useDatabaseRows(databaseId?: string, limit = 100, offset = 0) {
  return useQuery({
    queryKey: [...databaseKeys.rows(databaseId || ''), limit, offset],
    queryFn: async () => {
      if (!databaseId) return { rows: [], total_count: 0 }
      const response = await apiClient.get<ListRowsResponse>(
        `/databases/${databaseId}/rows?limit=${limit}&offset=${offset}`
      )
      return response.data
    },
    enabled: !!databaseId,
  })
}

// Get rows for a database with view filter/sort
export function useDatabaseRowsWithView(
  databaseId?: string,
  viewId?: string,
  limit = 100,
  offset = 0
) {
  return useQuery({
    queryKey: viewId
      ? [...databaseKeys.rowsWithView(databaseId || '', viewId), limit, offset]
      : [...databaseKeys.rows(databaseId || ''), limit, offset],
    queryFn: async () => {
      if (!databaseId) return { rows: [], total_count: 0 }
      const url = viewId
        ? `/databases/${databaseId}/rows?view_id=${viewId}&limit=${limit}&offset=${offset}`
        : `/databases/${databaseId}/rows?limit=${limit}&offset=${offset}`
      const response = await apiClient.get<ListRowsResponse>(url)
      return response.data
    },
    enabled: !!databaseId,
  })
}

// Get a single row with content
export interface GetRowResponse {
  id: string
  database_id: string
  properties: Record<string, unknown>
  content?: Record<string, unknown>
  show_in_sidebar: boolean
  created_by: string
  created_at: string
  updated_at: string
}

export function useRow(databaseId?: string, rowId?: string) {
  return useQuery({
    queryKey: databaseKeys.row(databaseId || '', rowId || ''),
    queryFn: async () => {
      if (!databaseId || !rowId) return null
      const response = await apiClient.get<GetRowResponse>(
        `/databases/${databaseId}/rows/${rowId}`
      )
      return response.data
    },
    enabled: !!databaseId && !!rowId,
  })
}

// Database type (keeping 'spreadsheet' for backward compatibility)
export type DatabaseType = 'document' | 'spreadsheet'

// Create a new database
export function useCreateDatabase() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      spaceId,
      name,
      description,
      icon,
      schema,
      documentId,
      type,
    }: {
      spaceId: string
      name: string
      description?: string
      icon?: string
      schema: PropertySchema[]
      documentId?: string
      type?: DatabaseType
    }) => {
      const response = await apiClient.post<components['schemas']['CreateDatabaseResponse']>(
        '/databases',
        {
          space_id: spaceId,
          name,
          description,
          icon,
          schema,
          document_id: documentId,
          type: type || 'document',
        }
      )
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: databaseKeys.list(variables.spaceId) })
    },
  })
}

// Update a database (name, description, icon, schema)
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
      const response = await apiClient.put<components['schemas']['MessageResponse']>(
        `/databases/${databaseId}`,
        { name, description, icon, schema, default_view: defaultView }
      )
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: databaseKeys.detail(variables.databaseId) })
      queryClient.invalidateQueries({ queryKey: databaseKeys.all })
    },
  })
}

// Delete a database
export function useDeleteDatabase() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ databaseId }: { databaseId: string }) => {
      await apiClient.delete(`/databases/${databaseId}`)
      return { databaseId }
    },
    onSuccess: (_, { databaseId }) => {
      // Remove the deleted database from cache to prevent refetch attempts
      queryClient.removeQueries({ queryKey: databaseKeys.detail(databaseId) })
      queryClient.removeQueries({ queryKey: databaseKeys.rows(databaseId) })
      // Invalidate the list to refresh it
      queryClient.invalidateQueries({ queryKey: databaseKeys.all })
    },
  })
}

// Create a new row
export function useCreateRow() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      databaseId,
      properties,
      content,
      showInSidebar,
    }: {
      databaseId: string
      properties: Record<string, unknown>
      content?: Record<string, unknown>
      showInSidebar?: boolean
    }) => {
      const response = await apiClient.post<components['schemas']['CreateRowResponse']>(
        `/databases/${databaseId}/rows`,
        { properties, content, show_in_sidebar: showInSidebar }
      )
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: databaseKeys.rows(variables.databaseId) })
    },
  })
}

// Update a row
export function useUpdateRow() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      databaseId,
      rowId,
      properties,
      content,
      showInSidebar,
    }: {
      databaseId: string
      rowId: string
      properties?: Record<string, unknown>
      content?: Record<string, unknown>
      showInSidebar?: boolean
    }) => {
      const response = await apiClient.put<components['schemas']['MessageResponse']>(
        `/databases/${databaseId}/rows/${rowId}`,
        { properties, content, show_in_sidebar: showInSidebar }
      )
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: databaseKeys.rows(variables.databaseId) })
      queryClient.invalidateQueries({ queryKey: databaseKeys.row(variables.databaseId, variables.rowId) })
    },
  })
}

// Delete a row
export function useDeleteRow() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ databaseId, rowId }: { databaseId: string; rowId: string }) => {
      await apiClient.delete(`/databases/${databaseId}/rows/${rowId}`)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: databaseKeys.rows(variables.databaseId) })
    },
  })
}

// Bulk delete rows
export function useBulkDeleteRows() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ databaseId, rowIds }: { databaseId: string; rowIds: string[] }) => {
      await apiClient.delete(`/databases/${databaseId}/rows`, { data: { row_ids: rowIds } })
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: databaseKeys.rows(variables.databaseId) })
    },
  })
}

// Get available property types
export function useAvailablePropertyTypes() {
  return useQuery({
    queryKey: ['database-types'],
    queryFn: async () => {
      const response = await apiClient.get<components['schemas']['AvailableTypesResponse']>(
        '/databases/types'
      )
      return response.data.types || []
    },
    staleTime: Infinity, // Types don't change
  })
}

// Create a view
export function useCreateView() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      databaseId,
      name,
      type,
      filter,
      sort,
      columns,
    }: {
      databaseId: string
      name: string
      type: string
      filter?: Record<string, unknown>
      sort?: SortConfig[]
      columns?: string[]
    }) => {
      const response = await apiClient.post<ViewConfig>(
        `/databases/${databaseId}/views`,
        { name, type, filter, sort, columns }
      )
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: databaseKeys.detail(variables.databaseId) })
    },
  })
}

// Update a view
export function useUpdateView() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      databaseId,
      viewId,
      name,
      type,
      filter,
      sort,
      columns,
      hiddenColumns,
      groupBy,
      clearFilter,
      clearSort,
    }: {
      databaseId: string
      viewId: string
      name?: string
      type?: string
      filter?: Record<string, unknown>
      sort?: SortConfig[]
      columns?: string[]
      hiddenColumns?: string[]
      groupBy?: string
      clearFilter?: boolean
      clearSort?: boolean
    }) => {
      // Build payload - send empty object/array to clear, undefined to not change
      const payload: Record<string, unknown> = {}
      if (name !== undefined) payload.name = name
      if (type !== undefined) payload.type = type
      if (columns !== undefined) payload.columns = columns
      if (hiddenColumns !== undefined) payload.hidden_columns = hiddenColumns
      if (groupBy !== undefined) payload.group_by = groupBy

      // Handle filter: clearFilter=true sends empty object to clear
      if (clearFilter) {
        payload.filter = {}
      } else if (filter !== undefined) {
        payload.filter = filter
      }

      // Handle sort: clearSort=true sends empty array to clear
      if (clearSort) {
        payload.sort = []
      } else if (sort !== undefined) {
        payload.sort = sort
      }

      const response = await apiClient.put<components['schemas']['MessageResponse']>(
        `/databases/${databaseId}/views/${viewId}`,
        payload
      )
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: databaseKeys.detail(variables.databaseId) })
      // Also invalidate rows that might be affected by view changes
      queryClient.invalidateQueries({
        queryKey: databaseKeys.rowsWithView(variables.databaseId, variables.viewId),
      })
    },
  })
}

// Delete a view
export function useDeleteView() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ databaseId, viewId }: { databaseId: string; viewId: string }) => {
      await apiClient.delete(`/databases/${databaseId}/views/${viewId}`)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: databaseKeys.detail(variables.databaseId) })
    },
  })
}
