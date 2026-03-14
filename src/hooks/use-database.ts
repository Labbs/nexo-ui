import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { databaseList, databaseGet, databaseCreate, databaseUpdate, databaseMove, databaseDelete, databaseTypes } from '@/api/generated/databases/databases'
import { databaseRowList, databaseRowGet, databaseRowCreate, databaseRowUpdate, databaseRowDelete } from '@/api/generated/database-rows/database-rows'
import { databaseViewCreate, databaseViewUpdate, databaseViewDelete } from '@/api/generated/database-views/database-views'
import type {
  PropertySchema,
  DatabaseItem,
  RowItem,
  GetDatabaseResponse,
  ListRowsResponse,
  GetRowResponse,
  CreateViewRequestType,
} from '@/api/generated/model'

// Re-export model types
export type { PropertySchema, DatabaseItem, RowItem, GetDatabaseResponse, ListRowsResponse, GetRowResponse }

/** @deprecated Use GetDatabaseResponse instead — kept for backward compat */
export type DatabaseDetail = GetDatabaseResponse

// View types (not in OpenAPI spec — kept as local types)
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

// Database type (keeping 'spreadsheet' for backward compatibility)
export type DatabaseType = 'document' | 'spreadsheet'

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
      const response = await databaseList({ space_id: spaceId })
      return response.databases || []
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
      const response = await databaseGet(databaseId)
      return response
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
      const response = await databaseRowList(databaseId, { limit, offset })
      return response
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
      const response = await databaseRowList(databaseId, {
        view_id: viewId,
        limit,
        offset,
      })
      return response
    },
    enabled: !!databaseId,
  })
}

// Get a single row with content
export function useRow(databaseId?: string, rowId?: string) {
  return useQuery({
    queryKey: databaseKeys.row(databaseId || '', rowId || ''),
    queryFn: async () => {
      if (!databaseId || !rowId) return null
      const response = await databaseRowGet(databaseId, rowId)
      return response
    },
    enabled: !!databaseId && !!rowId,
  })
}

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
      const response = await databaseCreate({
        space_id: spaceId,
        name,
        description,
        icon,
        schema,
        document_id: documentId,
        type: type || 'document',
      })
      return response
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: databaseKeys.list(variables.spaceId) })
    },
  })
}

// Update a database (name, description, icon, schema)
type UpdateDatabaseVariables = {
  databaseId: string
  name?: string
  description?: string
  icon?: string
  schema?: PropertySchema[]
  defaultView?: string
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
    }: UpdateDatabaseVariables) => {
      const response = await databaseUpdate(databaseId, {
        name,
        description,
        icon,
        schema,
        default_view: defaultView,
      })
      return response
    },
    onMutate: async (variables) => {
      const { databaseId, name, icon } = variables

      // Only optimistically update for name/icon changes (visible in sidebar)
      if (name === undefined && icon === undefined) return

      await queryClient.cancelQueries({ queryKey: databaseKeys.detail(databaseId) })
      await queryClient.cancelQueries({ queryKey: databaseKeys.all })

      // Snapshot for rollback
      const previousDetail = queryClient.getQueryData(databaseKeys.detail(databaseId))
      const previousLists = queryClient.getQueriesData({ queryKey: databaseKeys.all })

      const applyUpdate = (db: Record<string, unknown>) => {
        if (!db) return db
        const updated = { ...db }
        if (name !== undefined) updated.name = name
        if (icon !== undefined) updated.icon = icon
        return updated
      }

      // Optimistically update the detail cache
      if (previousDetail) {
        queryClient.setQueryData(databaseKeys.detail(databaseId), applyUpdate(previousDetail as Record<string, unknown>))
      }

      // Optimistically update all list caches that contain this database
      for (const [queryKey, data] of previousLists) {
        if (!Array.isArray(data)) continue
        queryClient.setQueryData(queryKey, data.map((db: Record<string, unknown>) =>
          db.id === databaseId ? applyUpdate(db) : db
        ))
      }

      return { previousDetail, previousLists }
    },
    onError: (_err, variables, context) => {
      if (!context) return
      const { databaseId } = variables

      if (context.previousDetail) {
        queryClient.setQueryData(databaseKeys.detail(databaseId), context.previousDetail)
      }
      if (context.previousLists) {
        for (const [queryKey, data] of context.previousLists) {
          queryClient.setQueryData(queryKey, data)
        }
      }
    },
    onSettled: (_, _err, variables) => {
      queryClient.invalidateQueries({ queryKey: databaseKeys.detail(variables.databaseId) })
      // Only invalidate list queries, not rows/permissions/types
      queryClient.invalidateQueries({ queryKey: ['databases', 'list'] })
    },
  })
}

// Move a database (change parent document)
export function useMoveDatabase() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ databaseId, documentId }: { databaseId: string; documentId?: string }) => {
      const response = await databaseMove(databaseId, { document_id: documentId || undefined })
      return response
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: databaseKeys.detail(variables.databaseId) })
      queryClient.invalidateQueries({ queryKey: ['databases', 'list'] })
    },
  })
}

// Delete a database
export function useDeleteDatabase() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ databaseId }: { databaseId: string }) => {
      await databaseDelete(databaseId)
      return { databaseId }
    },
    onSuccess: (_, { databaseId }) => {
      // Remove the deleted database from cache to prevent refetch attempts
      queryClient.removeQueries({ queryKey: databaseKeys.detail(databaseId) })
      queryClient.removeQueries({ queryKey: databaseKeys.rows(databaseId) })
      // Only invalidate list queries
      queryClient.invalidateQueries({ queryKey: ['databases', 'list'] })
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
      const response = await databaseRowCreate(databaseId, {
        properties,
        content,
        show_in_sidebar: showInSidebar,
      })
      return response
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
      const response = await databaseRowUpdate(databaseId, rowId, {
        properties,
        content,
        show_in_sidebar: showInSidebar,
      })
      return response
    },
    onMutate: async (variables) => {
      const { databaseId, rowId, properties, content } = variables

      await queryClient.cancelQueries({ queryKey: databaseKeys.rows(databaseId) })
      await queryClient.cancelQueries({ queryKey: databaseKeys.row(databaseId, rowId) })

      // Snapshot for rollback
      const previousRow = queryClient.getQueryData(databaseKeys.row(databaseId, rowId))
      const previousRows = queryClient.getQueriesData({ queryKey: databaseKeys.rows(databaseId) })

      const applyUpdate = (row: Record<string, unknown>) => {
        if (!row) return row
        const updated = { ...row }
        if (properties !== undefined) updated.properties = { ...((row.properties as Record<string, unknown>) || {}), ...properties }
        if (content !== undefined) updated.content = { ...((row.content as Record<string, unknown>) || {}), ...content }
        return updated
      }

      // Optimistically update the single row cache
      if (previousRow) {
        queryClient.setQueryData(databaseKeys.row(databaseId, rowId), applyUpdate(previousRow as Record<string, unknown>))
      }

      // Optimistically update row lists (which contain row items)
      for (const [queryKey, data] of previousRows) {
        if (!data || typeof data !== 'object') continue
        const rowsData = data as Record<string, unknown>
        if (Array.isArray(rowsData.rows)) {
          queryClient.setQueryData(queryKey, {
            ...rowsData,
            rows: (rowsData.rows as Record<string, unknown>[]).map((r) => r.id === rowId ? applyUpdate(r) : r),
          })
        }
      }

      return { previousRow, previousRows }
    },
    onError: (_err, variables, context) => {
      if (!context) return
      const { databaseId, rowId } = variables

      if (context.previousRow) {
        queryClient.setQueryData(databaseKeys.row(databaseId, rowId), context.previousRow)
      }
      if (context.previousRows) {
        for (const [queryKey, data] of context.previousRows) {
          queryClient.setQueryData(queryKey, data)
        }
      }
    },
    onSettled: (_, _err, variables) => {
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
      await databaseRowDelete(databaseId, rowId)
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
      // The generated bulk delete doesn't accept a body with row_ids,
      // so we fall back to deleting rows individually
      await Promise.all(rowIds.map(rowId => databaseRowDelete(databaseId, rowId)))
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
      const response = await databaseTypes()
      return response.types || []
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
      const response = await databaseViewCreate(databaseId, {
        name,
        type: type as CreateViewRequestType,
        filter,
        sort,
        columns,
      })
      return response
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

      const response = await databaseViewUpdate(databaseId, viewId, payload as import('@/api/generated/model').UpdateViewRequest)
      return response
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
      await databaseViewDelete(databaseId, viewId)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: databaseKeys.detail(variables.databaseId) })
    },
  })
}
