import { useCallback, useState, useMemo, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { GridCellKind } from '@glideapps/glide-data-grid'
import type {
  GridCell,
  GridColumn,
  Item,
  EditableGridCell,
  Rectangle,
  Theme,
} from '@glideapps/glide-data-grid'
import { useTheme } from 'next-themes'
import {
  useDatabase,
  useDatabaseRowsWithView,
  useUpdateDatabase,
  useCreateRow,
  useUpdateRow,
  useCreateView,
  useUpdateView,
  useDeleteView,
  type ViewConfig,
  type FilterConfig,
} from '@/hooks/use-database'
import { useSpaces } from '@/hooks/use-spaces'
import type { BreadcrumbItem } from '@/components/shared/content-header'
import {
  formatCurrency,
  evaluateFormula,
  evaluateConditionalStyle,
  selectOptionColors,
  getColumnIcon,
  schemaToColumn,
  columnToSchema,
  type ColumnType,
  type ColumnDef,
  type RowData,
  type SelectOption,
  type ConditionalRule,
} from '@/lib/database'

// Menu state types
export interface HeaderMenuState {
  col: number
  bounds: Rectangle
}

export interface AddColumnMenuState {
  bounds: Rectangle
}

export interface SelectCellEditorState {
  col: number
  row: number
  bounds: Rectangle
}

// Dark theme for Glide Data Grid
const darkTheme: Partial<Theme> = {
  accentColor: '#3b82f6',
  accentLight: 'rgba(59, 130, 246, 0.15)',
  textDark: '#e5e7eb',
  textMedium: '#9ca3af',
  textLight: '#6b7280',
  textBubble: '#e5e7eb',
  bgIconHeader: '#374151',
  fgIconHeader: '#9ca3af',
  textHeader: '#d1d5db',
  textGroupHeader: '#9ca3af',
  bgCell: '#1f2937',
  bgCellMedium: '#252f3f',
  bgHeader: '#111827',
  bgHeaderHasFocus: '#1e293b',
  bgHeaderHovered: '#1e293b',
  bgBubble: '#374151',
  bgBubbleSelected: '#4b5563',
  bgSearchResult: 'rgba(59, 130, 246, 0.3)',
  borderColor: '#374151',
  drilldownBorder: '#4b5563',
  linkColor: '#60a5fa',
  cellHorizontalPadding: 8,
  cellVerticalPadding: 5,
  headerFontStyle: '600 13px',
  baseFontStyle: '13px',
  fontFamily: 'Inter, system-ui, sans-serif',
  editorFontSize: '13px',
  lineHeight: 1.5,
}

// Light theme for Glide Data Grid
const lightTheme: Partial<Theme> = {
  accentColor: '#3b82f6',
  accentLight: 'rgba(59, 130, 246, 0.1)',
  textDark: '#1f2937',
  textMedium: '#6b7280',
  textLight: '#9ca3af',
  textBubble: '#1f2937',
  bgIconHeader: '#f3f4f6',
  fgIconHeader: '#6b7280',
  textHeader: '#374151',
  textGroupHeader: '#6b7280',
  bgCell: '#ffffff',
  bgCellMedium: '#f9fafb',
  bgHeader: '#f9fafb',
  bgHeaderHasFocus: '#f3f4f6',
  bgHeaderHovered: '#f3f4f6',
  bgBubble: '#e5e7eb',
  bgBubbleSelected: '#d1d5db',
  bgSearchResult: 'rgba(59, 130, 246, 0.15)',
  borderColor: '#e5e7eb',
  drilldownBorder: '#d1d5db',
  linkColor: '#2563eb',
  cellHorizontalPadding: 8,
  cellVerticalPadding: 5,
  headerFontStyle: '600 13px',
  baseFontStyle: '13px',
  fontFamily: 'Inter, system-ui, sans-serif',
  editorFontSize: '13px',
  lineHeight: 1.5,
}

/**
 * Hook that encapsulates all database page logic.
 * Returns state and actions for the UI to consume.
 */
export function useDatabasePage() {
  const { spaceId, databaseId } = useParams<{ spaceId: string; databaseId: string }>()
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'

  // View state - initialize from localStorage if available
  const [activeViewId, setActiveViewId] = useState<string>(() => {
    if (databaseId) {
      return localStorage.getItem(`nexo-active-view-${databaseId}`) || ''
    }
    return ''
  })

  // API hooks
  const { data: database, isLoading: isLoadingDatabase } = useDatabase(databaseId)
  const { data: rowsData, isLoading: isLoadingRows } = useDatabaseRowsWithView(databaseId, activeViewId || undefined)
  const { data: spaces = [] } = useSpaces()
  const updateDatabase = useUpdateDatabase()
  const createRow = useCreateRow()
  const updateRow = useUpdateRow()
  const createView = useCreateView()
  const updateView = useUpdateView()
  const deleteView = useDeleteView()

  // Get current space
  const space = useMemo(() => {
    return spaces.find((s) => s.id === spaceId)
  }, [spaces, spaceId])

  // Build breadcrumbs
  const breadcrumbs: BreadcrumbItem[] = useMemo(() => {
    const crumbs: BreadcrumbItem[] = []
    if (space) {
      crumbs.push({
        label: space.name || 'Space',
        href: `/space/${spaceId}`,
      })
    }
    crumbs.push({
      label: database?.name || 'Untitled Database',
    })
    return crumbs
  }, [space, spaceId, database?.name])

  // Update database icon
  const updateDatabaseIcon = useCallback((icon: string | null) => {
    if (!databaseId) return
    updateDatabase.mutate({
      databaseId,
      icon: icon || undefined,
    })
  }, [databaseId, updateDatabase])

  // Get views from database (map snake_case to camelCase)
  const views: ViewConfig[] = useMemo(() => {
    if (!database?.views) return []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (database.views as any[]).map(view => ({
      id: view.id as string,
      name: view.name as string,
      type: view.type as string,
      filter: view.filter as Record<string, unknown> | undefined,
      sort: view.sort as ViewConfig['sort'],
      columns: view.columns as string[] | undefined,
      hiddenColumns: (view.hidden_columns ?? view.hiddenColumns) as string[] | undefined,
    }))
  }, [database?.views])

  // Get active view
  const activeView = useMemo(() => {
    return views.find(v => v.id === activeViewId) || views[0]
  }, [views, activeViewId])

  // Set initial active view when database loads
  useEffect(() => {
    if (views.length > 0) {
      const isCurrentViewValid = activeViewId && views.some(v => v.id === activeViewId)
      if (!isCurrentViewValid) {
        const defaultViewId = database?.default_view
        const isValidViewId = defaultViewId && views.some(v => v.id === defaultViewId)
        const viewIdToUse = isValidViewId ? defaultViewId : views[0]?.id
        if (viewIdToUse) {
          setActiveViewId(viewIdToUse)
        }
      }
    }
  }, [views, activeViewId, database?.default_view])

  // Save active view to localStorage when it changes
  useEffect(() => {
    if (databaseId && activeViewId) {
      localStorage.setItem(`nexo-active-view-${databaseId}`, activeViewId)
    }
  }, [databaseId, activeViewId])

  // Local UI state
  const [databaseName, setDatabaseName] = useState('')
  const [isEditingName, setIsEditingName] = useState(false)
  const [headerMenuOpen, setHeaderMenuOpen] = useState<HeaderMenuState | null>(null)
  const [addColumnMenuOpen, setAddColumnMenuOpen] = useState<AddColumnMenuState | null>(null)
  const [editingColumnName, setEditingColumnName] = useState<string>('')
  const [isSettingsSidebarOpen, setIsSettingsSidebarOpen] = useState(false)
  const [showSortSubmenu, setShowSortSubmenu] = useState(false)
  const [editingOptionId, setEditingOptionId] = useState<string | null>(null)
  const [optionsMenuOpen, setOptionsMenuOpen] = useState<HeaderMenuState | null>(null)
  const [selectCellEditor, setSelectCellEditor] = useState<SelectCellEditorState | null>(null)
  const [draggingOptionId, setDraggingOptionId] = useState<string | null>(null)
  const [dragOverOptionId, setDragOverOptionId] = useState<string | null>(null)

  // Sync database name from API
  const currentName = database?.name || ''
  if (currentName && !databaseName && !isEditingName) {
    setDatabaseName(currentName)
  }

  // Convert schema to columns
  const allColumns: ColumnDef[] = useMemo(() => {
    if (!database?.schema) return []
    return database.schema.map(schemaToColumn)
  }, [database?.schema])

  // Get hidden columns from active view
  const hiddenColumnIds = useMemo(() => {
    return new Set(activeView?.hiddenColumns || [])
  }, [activeView?.hiddenColumns])

  // Filter visible columns based on view's hidden columns
  const columns: ColumnDef[] = useMemo(() => {
    return allColumns.filter(col => !hiddenColumnIds.has(col.id))
  }, [allColumns, hiddenColumnIds])

  // Convert rows from API format
  const rows: RowData[] = useMemo(() => {
    if (!rowsData?.rows) return []
    return rowsData.rows.map(row => ({
      id: row.id || '',
      properties: row.properties || {},
    }))
  }, [rowsData?.rows])

  const gridTheme = isDarkMode ? darkTheme : lightTheme

  // Convert our columns to Glide format (+ add column button as last column)
  const gridColumns: GridColumn[] = useMemo(() => [
    ...columns.map((col) => ({
      id: col.id,
      title: col.title,
      width: col.width,
      icon: getColumnIcon(col.type),
      hasMenu: true,
    })),
    {
      id: '__add_column__',
      title: '+',
      width: 40,
      hasMenu: false,
    },
  ], [columns])

  // Get cell content based on column type
  const getCellContent = useCallback(
    (cell: Item): GridCell => {
      const [colIndex, rowIndex] = cell

      if (colIndex === columns.length) {
        return {
          kind: GridCellKind.Text,
          data: '',
          displayData: '',
          allowOverlay: false,
          readonly: true,
        }
      }

      const column = columns[colIndex]
      const row = rows[rowIndex]

      if (!column || !row) {
        return {
          kind: GridCellKind.Text,
          data: '',
          displayData: '',
          allowOverlay: false,
        }
      }

      const value = row.properties[column.id]

      // Evaluate conditional styling
      const conditionalRules = column.options?.conditionalRules as ConditionalRule[] | undefined
      const conditionalStyle = evaluateConditionalStyle(value, conditionalRules)
      const themeOverride = conditionalStyle ? {
        bgCell: conditionalStyle.bgColor,
        textDark: conditionalStyle.textColor,
      } : undefined

      switch (column.type) {
        case 'title':
        case 'text':
        case 'email':
          return {
            kind: GridCellKind.Text,
            data: (value as string) || '',
            displayData: (value as string) || '',
            allowOverlay: true,
            readonly: false,
            themeOverride,
          }

        case 'number':
          return {
            kind: GridCellKind.Number,
            data: value as number | undefined,
            displayData: value != null ? String(value) : '',
            allowOverlay: true,
            readonly: false,
            themeOverride,
          }

        case 'currency':
          const numValue = typeof value === 'number' ? value : (value ? parseFloat(String(value)) : undefined)
          return {
            kind: GridCellKind.Number,
            data: numValue,
            displayData: formatCurrency(numValue, column.options),
            allowOverlay: true,
            readonly: false,
            themeOverride,
          }

        case 'image':
          const imageUrl = (value as string) || ''
          return {
            kind: GridCellKind.Image,
            data: imageUrl ? [imageUrl] : [],
            displayData: imageUrl ? [imageUrl] : [],
            allowOverlay: true,
            readonly: false,
            themeOverride,
          }

        case 'formula':
          const formulaStr = (column.options?.formula as string) || ''
          const result = evaluateFormula(formulaStr, row.properties, columns)
          const formulaConditionalStyle = evaluateConditionalStyle(result.value, conditionalRules)
          const formulaThemeOverride = formulaConditionalStyle ? {
            bgCell: formulaConditionalStyle.bgColor,
            textDark: formulaConditionalStyle.textColor,
          } : undefined
          return {
            kind: GridCellKind.Number,
            data: typeof result.value === 'number' ? result.value : undefined,
            displayData: result.error ? `#ERR: ${result.error}` : (result.value != null ? String(result.value) : ''),
            allowOverlay: false,
            readonly: true,
            themeOverride: formulaThemeOverride,
          }

        case 'checkbox':
          return {
            kind: GridCellKind.Boolean,
            data: !!value,
            allowOverlay: false,
            readonly: false,
            themeOverride,
          }

        case 'url':
          return {
            kind: GridCellKind.Uri,
            data: (value as string) || '',
            allowOverlay: true,
            readonly: false,
            themeOverride,
          }

        case 'date':
          const dateValue = value ? new Date(value as string) : undefined
          return {
            kind: GridCellKind.Text,
            data: dateValue?.toISOString().split('T')[0] || '',
            displayData: dateValue?.toLocaleDateString() || '',
            allowOverlay: true,
            readonly: false,
            themeOverride,
          }

        case 'select':
        case 'multi_select':
          const selectValue = value as string | string[] | undefined
          const selectOptions = column.options?.options as SelectOption[] | undefined
          const selectedValues = Array.isArray(selectValue)
            ? selectValue
            : (selectValue ? [selectValue] : [])
          const displayValues = selectedValues.map(v => {
            const opt = selectOptions?.find(o => o.id === v || o.name === v)
            return opt?.name || v
          })
          return {
            kind: GridCellKind.Bubble,
            data: displayValues,
            allowOverlay: false,
            themeOverride,
          }

        default:
          return {
            kind: GridCellKind.Text,
            data: String(value ?? ''),
            displayData: String(value ?? ''),
            allowOverlay: true,
            readonly: false,
            themeOverride,
          }
      }
    },
    [columns, rows]
  )

  // Handle cell edits
  const onCellEdited = useCallback(
    (cell: Item, newValue: EditableGridCell) => {
      const [colIndex, rowIndex] = cell
      const column = columns[colIndex]
      const row = rows[rowIndex]

      if (!column || !row || !databaseId) return

      let value: unknown
      switch (newValue.kind) {
        case GridCellKind.Text:
          value = newValue.data
          break
        case GridCellKind.Number:
          value = newValue.data
          break
        case GridCellKind.Boolean:
          value = newValue.data
          break
        case GridCellKind.Uri:
          value = newValue.data
          break
        case GridCellKind.Image:
          value = Array.isArray(newValue.data) && newValue.data.length > 0 ? newValue.data[0] : ''
          break
        default:
          return
      }

      updateRow.mutate({
        databaseId,
        rowId: row.id,
        properties: {
          ...row.properties,
          [column.id]: value,
        },
      })
    },
    [columns, rows, databaseId, updateRow]
  )

  // Handle adding a new row
  const onRowAppended = useCallback(() => {
    if (!databaseId) return

    const newProperties: Record<string, unknown> = {}
    columns.forEach(col => {
      switch (col.type) {
        case 'checkbox':
          newProperties[col.id] = false
          break
        case 'number':
        case 'currency':
          newProperties[col.id] = null
          break
        case 'image':
          newProperties[col.id] = ''
          break
        default:
          newProperties[col.id] = ''
      }
    })

    createRow.mutate({
      databaseId,
      properties: newProperties,
    })
  }, [columns, databaseId, createRow])

  // Add a new column with specific type
  const addColumnWithType = useCallback((type: ColumnType) => {
    if (!databaseId || !database?.schema) return

    let width = 150
    let options: Record<string, unknown> | undefined = undefined

    if (type === 'checkbox') width = 80
    else if (type === 'currency') {
      width = 120
      options = { currency: 'USD' }
    }
    else if (type === 'image') width = 100

    const newColumn: ColumnDef = {
      id: `col_${Date.now()}`,
      title: `New ${type}`,
      type: type,
      width,
      options,
    }

    const newSchema = [...database.schema, columnToSchema(newColumn)]

    updateDatabase.mutate({
      databaseId,
      schema: newSchema,
    })

    setAddColumnMenuOpen(null)
  }, [databaseId, database?.schema, updateDatabase])

  // Handle header menu click
  const onHeaderMenuClick = useCallback((col: number, bounds: Rectangle) => {
    if (col === columns.length) return
    setHeaderMenuOpen({ col, bounds })
    setEditingColumnName(columns[col]?.title || '')
  }, [columns])

  // Handle header click (for the "+" column)
  const onHeaderClicked = useCallback((col: number, event: { bounds: Rectangle }) => {
    if (col === columns.length) {
      setAddColumnMenuOpen({ bounds: event.bounds })
    }
  }, [columns.length])

  // Rename column
  const renameColumn = useCallback((colIndex: number, newName: string) => {
    if (!newName.trim() || !databaseId || !database?.schema) return

    const newSchema = [...database.schema]
    if (newSchema[colIndex]) {
      newSchema[colIndex] = { ...newSchema[colIndex], name: newName.trim() }
    }

    updateDatabase.mutate({
      databaseId,
      schema: newSchema,
    })
  }, [databaseId, database?.schema, updateDatabase])

  // Delete column
  const deleteColumn = useCallback((colIndex: number) => {
    if (!databaseId || !database?.schema) return

    const newSchema = database.schema.filter((_, i) => i !== colIndex)

    updateDatabase.mutate({
      databaseId,
      schema: newSchema,
    })

    setHeaderMenuOpen(null)
  }, [databaseId, database?.schema, updateDatabase])

  // Hide column (add to view's hiddenColumns)
  const hideColumn = useCallback((columnId: string) => {
    if (!databaseId || !activeViewId) return

    const currentHidden = activeView?.hiddenColumns || []
    const newHiddenColumns = [...currentHidden, columnId]

    updateView.mutate({
      databaseId,
      viewId: activeViewId,
      hiddenColumns: newHiddenColumns,
    })

    setHeaderMenuOpen(null)
  }, [databaseId, activeViewId, activeView?.hiddenColumns, updateView])

  // Show column (remove from view's hiddenColumns)
  const showColumn = useCallback((columnId: string) => {
    if (!databaseId || !activeViewId) return

    const currentHidden = activeView?.hiddenColumns || []
    const newHiddenColumns = currentHidden.filter(id => id !== columnId)

    updateView.mutate({
      databaseId,
      viewId: activeViewId,
      hiddenColumns: newHiddenColumns,
    })
  }, [databaseId, activeViewId, activeView?.hiddenColumns, updateView])

  // Show all columns
  const showAllColumns = useCallback(() => {
    if (!databaseId || !activeViewId) return

    updateView.mutate({
      databaseId,
      viewId: activeViewId,
      hiddenColumns: [],
    })
  }, [databaseId, activeViewId, updateView])

  // Sort by column
  const sortByColumn = useCallback((columnId: string, direction: 'asc' | 'desc') => {
    if (!databaseId || !activeViewId) return

    updateView.mutate({
      databaseId,
      viewId: activeViewId,
      sort: [{ property_id: columnId, direction }],
    })
  }, [databaseId, activeViewId, updateView])

  // Get select options for a column
  const getSelectOptions = useCallback((colIndex: number): SelectOption[] => {
    const column = columns[colIndex]
    if (!column) return []
    const options = column.options?.options as SelectOption[] | undefined
    return options || []
  }, [columns])

  // Add a new select option
  const addSelectOption = useCallback((colIndex: number) => {
    if (!databaseId || !database?.schema) return

    const newOption: SelectOption = {
      id: `opt_${Date.now()}`,
      name: '',
      color: 'default',
    }

    const newSchema = [...database.schema]
    const actualColIndex = allColumns.findIndex(c => c.id === columns[colIndex]?.id)
    if (actualColIndex === -1) return

    const currentOptions = (newSchema[actualColIndex].options?.options as SelectOption[]) || []
    newSchema[actualColIndex] = {
      ...newSchema[actualColIndex],
      options: {
        ...newSchema[actualColIndex].options,
        options: [...currentOptions, newOption],
      },
    }

    updateDatabase.mutate({ databaseId, schema: newSchema })
    setEditingOptionId(newOption.id)
  }, [databaseId, database?.schema, columns, allColumns, updateDatabase])

  // Update a select option
  const updateSelectOption = useCallback((colIndex: number, optionId: string, updates: Partial<SelectOption>) => {
    if (!databaseId || !database?.schema) return

    const newSchema = [...database.schema]
    const actualColIndex = allColumns.findIndex(c => c.id === columns[colIndex]?.id)
    if (actualColIndex === -1) return

    const currentOptions = (newSchema[actualColIndex].options?.options as SelectOption[]) || []
    const updatedOptions = currentOptions.map(opt =>
      opt.id === optionId ? { ...opt, ...updates } : opt
    )

    newSchema[actualColIndex] = {
      ...newSchema[actualColIndex],
      options: {
        ...newSchema[actualColIndex].options,
        options: updatedOptions,
      },
    }

    updateDatabase.mutate({ databaseId, schema: newSchema })
  }, [databaseId, database?.schema, columns, allColumns, updateDatabase])

  // Delete a select option
  const deleteSelectOption = useCallback((colIndex: number, optionId: string) => {
    if (!databaseId || !database?.schema) return

    const newSchema = [...database.schema]
    const actualColIndex = allColumns.findIndex(c => c.id === columns[colIndex]?.id)
    if (actualColIndex === -1) return

    const currentOptions = (newSchema[actualColIndex].options?.options as SelectOption[]) || []
    const updatedOptions = currentOptions.filter(opt => opt.id !== optionId)

    newSchema[actualColIndex] = {
      ...newSchema[actualColIndex],
      options: {
        ...newSchema[actualColIndex].options,
        options: updatedOptions,
      },
    }

    updateDatabase.mutate({ databaseId, schema: newSchema })
    setEditingOptionId(null)
  }, [databaseId, database?.schema, columns, allColumns, updateDatabase])

  // Reorder select options via drag and drop
  const reorderSelectOptions = useCallback((colIndex: number, fromOptionId: string, toOptionId: string) => {
    if (!databaseId || !database?.schema || fromOptionId === toOptionId) return

    const newSchema = [...database.schema]
    const actualColIndex = allColumns.findIndex(c => c.id === columns[colIndex]?.id)
    if (actualColIndex === -1) return

    const currentOptions = [...((newSchema[actualColIndex].options?.options as SelectOption[]) || [])]
    const fromIndex = currentOptions.findIndex(opt => opt.id === fromOptionId)
    const toIndex = currentOptions.findIndex(opt => opt.id === toOptionId)

    if (fromIndex === -1 || toIndex === -1) return

    const [movedOption] = currentOptions.splice(fromIndex, 1)
    currentOptions.splice(toIndex, 0, movedOption)

    newSchema[actualColIndex] = {
      ...newSchema[actualColIndex],
      options: {
        ...newSchema[actualColIndex].options,
        options: currentOptions,
      },
    }

    updateDatabase.mutate({ databaseId, schema: newSchema })
  }, [databaseId, database?.schema, columns, allColumns, updateDatabase])

  // Save database name (legacy, used by edit mode)
  const saveDatabaseName = useCallback(() => {
    if (!databaseId || !databaseName.trim()) return

    updateDatabase.mutate({
      databaseId,
      name: databaseName.trim(),
    })

    setIsEditingName(false)
  }, [databaseId, databaseName, updateDatabase])

  // Update database name directly (used by ContentHeader)
  const updateDatabaseName = useCallback((name: string) => {
    if (!databaseId) return
    const trimmedName = name.trim() || 'Untitled Database'
    updateDatabase.mutate({
      databaseId,
      name: trimmedName,
    })
  }, [databaseId, updateDatabase])

  // Update select cell value
  const updateSelectCellValue = useCallback((newValue: string | string[]) => {
    if (!selectCellEditor || !databaseId) return

    const column = columns[selectCellEditor.col]
    const row = rows[selectCellEditor.row]
    if (!column || !row) return

    updateRow.mutate({
      databaseId,
      rowId: row.id,
      properties: {
        ...row.properties,
        [column.id]: newValue,
      },
    })
  }, [selectCellEditor, columns, rows, databaseId, updateRow])

  // Column resize handler
  const onColumnResize = useCallback((column: GridColumn, newSize: number) => {
    if (!databaseId || !database?.schema) return
    const colIndex = columns.findIndex(c => c.id === column.id)
    if (colIndex === -1) return

    const newSchema = [...database.schema]
    if (newSchema[colIndex]) {
      newSchema[colIndex] = {
        ...newSchema[colIndex],
        options: { ...newSchema[colIndex].options, width: newSize }
      }
    }
    updateDatabase.mutate({ databaseId, schema: newSchema })
  }, [databaseId, database?.schema, columns, updateDatabase])

  // Cell click handler for select cells
  const onCellClicked = useCallback((cell: Item, event: { bounds: Rectangle }) => {
    const [colIndex, rowIndex] = cell
    const column = columns[colIndex]
    if (column && (column.type === 'select' || column.type === 'multi_select')) {
      setSelectCellEditor({
        col: colIndex,
        row: rowIndex,
        bounds: event.bounds,
      })
    }
  }, [columns])

  // View management actions
  const handleCreateView = useCallback((name: string, type?: string) => {
    if (!databaseId) return
    createView.mutate({
      databaseId,
      name,
      type: type || 'table',
    }, {
      onSuccess: (newView) => {
        setActiveViewId(newView.id)
      }
    })
  }, [databaseId, createView])

  const handleRenameView = useCallback((viewId: string, name: string) => {
    if (!databaseId) return
    updateView.mutate({ databaseId, viewId, name })
  }, [databaseId, updateView])

  const handleDuplicateView = useCallback((viewId: string) => {
    if (!databaseId) return
    const viewToDuplicate = views.find(v => v.id === viewId)
    if (!viewToDuplicate) return
    createView.mutate({
      databaseId,
      name: `${viewToDuplicate.name} (copy)`,
      type: viewToDuplicate.type,
      filter: viewToDuplicate.filter,
      sort: viewToDuplicate.sort,
      columns: viewToDuplicate.columns,
    }, {
      onSuccess: (newView) => {
        setActiveViewId(newView.id)
      }
    })
  }, [databaseId, views, createView])

  const handleDeleteView = useCallback((viewId: string) => {
    if (!databaseId) return
    deleteView.mutate({ databaseId, viewId })
    if (viewId === activeViewId && views.length > 1) {
      const nextView = views.find(v => v.id !== viewId)
      if (nextView) setActiveViewId(nextView.id)
    }
  }, [databaseId, deleteView, activeViewId, views])

  const handleFilterChange = useCallback((filter: FilterConfig | undefined) => {
    if (!databaseId || !activeViewId) return
    if (filter === undefined) {
      updateView.mutate({
        databaseId,
        viewId: activeViewId,
        clearFilter: true,
      })
    } else {
      updateView.mutate({
        databaseId,
        viewId: activeViewId,
        filter: filter as Record<string, unknown>,
      })
    }
  }, [databaseId, activeViewId, updateView])

  const handleSortChange = useCallback((sort: ViewConfig['sort']) => {
    if (!databaseId || !activeViewId) return
    if (!sort || sort.length === 0) {
      updateView.mutate({
        databaseId,
        viewId: activeViewId,
        clearSort: true,
      })
    } else {
      updateView.mutate({
        databaseId,
        viewId: activeViewId,
        sort,
      })
    }
  }, [databaseId, activeViewId, updateView])

  // Board view specific handlers
  const handleBoardCreateRow = useCallback((properties?: Record<string, unknown>) => {
    if (!databaseId) return
    const newProperties: Record<string, unknown> = { ...(properties || {}) }
    columns.forEach(col => {
      if (!(col.id in newProperties)) {
        switch (col.type) {
          case 'checkbox':
            newProperties[col.id] = false
            break
          case 'number':
          case 'currency':
            newProperties[col.id] = null
            break
          default:
            newProperties[col.id] = ''
        }
      }
    })
    createRow.mutate({ databaseId, properties: newProperties })
  }, [databaseId, columns, createRow])

  const handleBoardUpdateRow = useCallback((rowId: string, properties: Record<string, unknown>) => {
    if (!databaseId) return
    const row = rows.find(r => r.id === rowId)
    if (!row) return
    updateRow.mutate({
      databaseId,
      rowId,
      properties: { ...row.properties, ...properties },
    })
  }, [databaseId, rows, updateRow])

  return {
    // Core data
    databaseId,
    spaceId,
    database,
    space,
    isLoading: isLoadingDatabase || isLoadingRows,
    isDarkMode,

    // Header data
    breadcrumbs,
    updateDatabaseIcon,

    // Views
    views,
    activeView,
    activeViewId,
    setActiveViewId,

    // Columns & Rows
    columns,
    allColumns,
    hiddenColumnIds,
    rows,
    gridColumns,
    gridTheme,

    // Database name editing
    databaseName,
    setDatabaseName,
    isEditingName,
    setIsEditingName,
    saveDatabaseName,
    updateDatabaseName,

    // Menu states
    headerMenuOpen,
    setHeaderMenuOpen,
    addColumnMenuOpen,
    setAddColumnMenuOpen,
    editingColumnName,
    setEditingColumnName,
    showSortSubmenu,
    setShowSortSubmenu,
    optionsMenuOpen,
    setOptionsMenuOpen,
    editingOptionId,
    setEditingOptionId,
    selectCellEditor,
    setSelectCellEditor,
    draggingOptionId,
    setDraggingOptionId,
    dragOverOptionId,
    setDragOverOptionId,

    // Settings sidebar
    isSettingsSidebarOpen,
    setIsSettingsSidebarOpen,

    // Grid handlers
    getCellContent,
    onCellEdited,
    onRowAppended,
    onHeaderMenuClick,
    onHeaderClicked,
    onColumnResize,
    onCellClicked,

    // Column actions
    addColumnWithType,
    renameColumn,
    deleteColumn,
    hideColumn,
    showColumn,
    showAllColumns,
    sortByColumn,

    // Select option actions
    getSelectOptions,
    addSelectOption,
    updateSelectOption,
    deleteSelectOption,
    reorderSelectOptions,
    updateSelectCellValue,

    // View management
    handleCreateView,
    handleRenameView,
    handleDuplicateView,
    handleDeleteView,
    handleFilterChange,
    handleSortChange,

    // Board view handlers
    handleBoardCreateRow,
    handleBoardUpdateRow,

    // Utilities
    selectOptionColors,
  }
}
