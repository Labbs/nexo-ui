import { useCallback, useState, useRef, useLayoutEffect, useMemo, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import DataEditor, { GridCellKind, type DrawCellCallback } from '@glideapps/glide-data-grid'
import type {
  GridCell,
  GridColumn,
  Item,
  EditableGridCell,
  Rectangle,
  Theme,
} from '@glideapps/glide-data-grid'
import '@glideapps/glide-data-grid/dist/index.css'
import { MainLayout } from '@/components/layout/main-layout'
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
  type PropertySchema,
  type ViewConfig,
} from '@/hooks/use-database'
import {
  Loader2,
  Settings,
  Type,
  AlignLeft,
  Hash,
  DollarSign,
  CheckSquare,
  AtSign,
  Link,
  Calendar,
  Sigma,
  CircleDot,
  List,
  Paperclip,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  WrapText,
  PanelLeftClose,
  PanelRightClose,
  EyeOff,
  Trash2,
  Search,
  Plus,
  GripVertical,
  ChevronRight,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DatabaseSettingsSidebar } from '@/components/database/common/database-settings-sidebar'
import { ViewTabs } from '@/components/database/common/view-tabs'
import { ListView, GalleryView, BoardView } from '@/components/database/spreadsheet/views'
import { DocumentDatabaseView } from '@/components/database/document'

// Column types we support (mapped from backend)
type ColumnType = 'title' | 'text' | 'number' | 'currency' | 'checkbox' | 'url' | 'email' | 'date' | 'select' | 'multi_select' | 'image' | 'formula'

// Column definition with type
interface ColumnDef {
  id: string
  title: string
  type: ColumnType
  width: number
  options?: Record<string, unknown>
}

// Row data is a map of column id to value
type RowData = {
  id: string
  properties: Record<string, unknown>
}

// Select option colors (matching Notion's color palette - vibrant pastels)
const selectOptionColors = [
  { name: 'Default', bg: 'bg-slate-100 dark:bg-slate-600', text: 'text-slate-700 dark:text-slate-100', value: 'default', hex: '#e2e8f0', hexDark: '#475569', textHex: '#334155', textHexDark: '#f1f5f9' },
  { name: 'Gray', bg: 'bg-gray-200 dark:bg-gray-500', text: 'text-gray-700 dark:text-gray-100', value: 'gray', hex: '#d1d5db', hexDark: '#6b7280', textHex: '#374151', textHexDark: '#f3f4f6' },
  { name: 'Brown', bg: 'bg-amber-200 dark:bg-amber-700', text: 'text-amber-900 dark:text-amber-100', value: 'brown', hex: '#fde68a', hexDark: '#b45309', textHex: '#78350f', textHexDark: '#fef3c7' },
  { name: 'Orange', bg: 'bg-orange-200 dark:bg-orange-600', text: 'text-orange-800 dark:text-orange-100', value: 'orange', hex: '#fed7aa', hexDark: '#ea580c', textHex: '#9a3412', textHexDark: '#ffedd5' },
  { name: 'Yellow', bg: 'bg-yellow-200 dark:bg-yellow-600', text: 'text-yellow-800 dark:text-yellow-100', value: 'yellow', hex: '#fef08a', hexDark: '#ca8a04', textHex: '#854d0e', textHexDark: '#fef9c3' },
  { name: 'Green', bg: 'bg-emerald-200 dark:bg-emerald-600', text: 'text-emerald-800 dark:text-emerald-100', value: 'green', hex: '#a7f3d0', hexDark: '#059669', textHex: '#065f46', textHexDark: '#d1fae5' },
  { name: 'Blue', bg: 'bg-sky-200 dark:bg-sky-600', text: 'text-sky-800 dark:text-sky-100', value: 'blue', hex: '#bae6fd', hexDark: '#0284c7', textHex: '#075985', textHexDark: '#e0f2fe' },
  { name: 'Purple', bg: 'bg-violet-200 dark:bg-violet-600', text: 'text-violet-800 dark:text-violet-100', value: 'purple', hex: '#ddd6fe', hexDark: '#7c3aed', textHex: '#5b21b6', textHexDark: '#ede9fe' },
  { name: 'Pink', bg: 'bg-pink-200 dark:bg-pink-600', text: 'text-pink-800 dark:text-pink-100', value: 'pink', hex: '#fbcfe8', hexDark: '#db2777', textHex: '#9d174d', textHexDark: '#fce7f3' },
  { name: 'Red', bg: 'bg-rose-200 dark:bg-rose-600', text: 'text-rose-800 dark:text-rose-100', value: 'red', hex: '#fecdd3', hexDark: '#e11d48', textHex: '#9f1239', textHexDark: '#ffe4e6' },
]

// Select option type
interface SelectOption {
  id: string
  name: string
  color: string
}

// Currency options
const currencyOptions = [
  { code: 'USD', symbol: '$', locale: 'en-US' },
  { code: 'EUR', symbol: '€', locale: 'fr-FR' },
  { code: 'GBP', symbol: '£', locale: 'en-GB' },
  { code: 'JPY', symbol: '¥', locale: 'ja-JP' },
  { code: 'CAD', symbol: 'CA$', locale: 'en-CA' },
  { code: 'CHF', symbol: 'CHF', locale: 'de-CH' },
]

// Format currency value
function formatCurrency(value: number | null | undefined, options?: Record<string, unknown>): string {
  if (value == null) return ''
  const currency = (options?.currency as string) || 'USD'
  const currencyInfo = currencyOptions.find(c => c.code === currency) || currencyOptions[0]
  try {
    return new Intl.NumberFormat(currencyInfo.locale, {
      style: 'currency',
      currency: currencyInfo.code,
    }).format(value)
  } catch {
    return `${currencyInfo.symbol}${value.toFixed(2)}`
  }
}

// Column type options for the dropdown
const columnTypes: { value: ColumnType; label: string; icon: LucideIcon }[] = [
  { value: 'text', label: 'Text', icon: AlignLeft },
  { value: 'number', label: 'Number', icon: Hash },
  { value: 'select', label: 'Select', icon: CircleDot },
  { value: 'multi_select', label: 'Multi-select', icon: List },
  { value: 'date', label: 'Date', icon: Calendar },
  { value: 'checkbox', label: 'Checkbox', icon: CheckSquare },
  { value: 'url', label: 'URL', icon: Link },
  { value: 'email', label: 'Email', icon: AtSign },
  { value: 'currency', label: 'Currency', icon: DollarSign },
  { value: 'image', label: 'Files & media', icon: Paperclip },
  { value: 'formula', label: 'Formula', icon: Sigma },
  { value: 'title', label: 'Title', icon: Type },
]

// Evaluate a formula expression
// Supports: column references (prop("column_id")), basic math (+, -, *, /), and functions
function evaluateFormula(
  formula: string,
  row: Record<string, unknown>,
  columns: ColumnDef[]
): { value: number | string | null; error?: string } {
  if (!formula) return { value: null }

  try {
    // Replace prop("column_id") or prop("column_name") with actual values
    let expression = formula.replace(/prop\s*\(\s*["']([^"']+)["']\s*\)/g, (_, ref) => {
      // Try to find column by id first, then by name
      const col = columns.find(c => c.id === ref || c.title === ref)
      if (!col) return '0'
      const val = row[col.id]
      if (val == null) return '0'
      if (typeof val === 'number') return String(val)
      if (typeof val === 'boolean') return val ? '1' : '0'
      const num = parseFloat(String(val))
      return isNaN(num) ? '0' : String(num)
    })

    // Handle built-in functions
    // IF(condition, then, else)
    expression = expression.replace(
      /IF\s*\(\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^)]+)\s*\)/gi,
      (_, cond, thenVal, elseVal) => {
        try {
          // Simple condition evaluation (supports >, <, >=, <=, ==, !=)
          const condResult = Function('"use strict"; return (' + cond + ')')()
          return condResult ? thenVal : elseVal
        } catch {
          return '0'
        }
      }
    )

    // ABS(value)
    expression = expression.replace(/ABS\s*\(\s*([^)]+)\s*\)/gi, (_, val) => {
      try {
        const num = Function('"use strict"; return (' + val + ')')()
        return String(Math.abs(num))
      } catch {
        return '0'
      }
    })

    // ROUND(value, decimals)
    expression = expression.replace(/ROUND\s*\(\s*([^,]+)\s*,?\s*([^)]*)\s*\)/gi, (_, val, dec) => {
      try {
        const num = Function('"use strict"; return (' + val + ')')()
        const decimals = dec ? parseInt(dec) : 0
        return String(Number(num.toFixed(decimals)))
      } catch {
        return '0'
      }
    })

    // MIN(a, b, ...)
    expression = expression.replace(/MIN\s*\(\s*([^)]+)\s*\)/gi, (_, args) => {
      try {
        const values = args.split(',').map((v: string) => Function('"use strict"; return (' + v.trim() + ')')())
        return String(Math.min(...values))
      } catch {
        return '0'
      }
    })

    // MAX(a, b, ...)
    expression = expression.replace(/MAX\s*\(\s*([^)]+)\s*\)/gi, (_, args) => {
      try {
        const values = args.split(',').map((v: string) => Function('"use strict"; return (' + v.trim() + ')')())
        return String(Math.max(...values))
      } catch {
        return '0'
      }
    })

    // Evaluate the final expression (basic math only)
    // Security: only allow numbers, operators, parentheses, and whitespace
    if (!/^[\d\s+\-*/.()]+$/.test(expression)) {
      return { value: null, error: 'Invalid formula' }
    }

    const result = Function('"use strict"; return (' + expression + ')')()
    if (typeof result === 'number' && !isNaN(result)) {
      return { value: result }
    }
    return { value: null, error: 'Invalid result' }
  } catch (e) {
    return { value: null, error: String(e) }
  }
}

// Conditional styling rule type
interface ConditionalRule {
  condition: 'gt' | 'lt' | 'eq' | 'neq' | 'gte' | 'lte' | 'contains' | 'empty' | 'not_empty'
  value?: string | number
  bgColor?: string
  textColor?: string
}

// Evaluate conditional rules for a cell
function evaluateConditionalStyle(
  value: unknown,
  rules: ConditionalRule[] | undefined
): { bgColor?: string; textColor?: string } | null {
  if (!rules || rules.length === 0) return null

  for (const rule of rules) {
    let matches = false

    switch (rule.condition) {
      case 'gt':
        matches = typeof value === 'number' && value > Number(rule.value)
        break
      case 'lt':
        matches = typeof value === 'number' && value < Number(rule.value)
        break
      case 'gte':
        matches = typeof value === 'number' && value >= Number(rule.value)
        break
      case 'lte':
        matches = typeof value === 'number' && value <= Number(rule.value)
        break
      case 'eq':
        matches = String(value) === String(rule.value)
        break
      case 'neq':
        matches = String(value) !== String(rule.value)
        break
      case 'contains':
        matches = String(value).toLowerCase().includes(String(rule.value).toLowerCase())
        break
      case 'empty':
        matches = value == null || value === '' || (typeof value === 'number' && isNaN(value))
        break
      case 'not_empty':
        matches = value != null && value !== '' && !(typeof value === 'number' && isNaN(value))
        break
    }

    if (matches) {
      return { bgColor: rule.bgColor, textColor: rule.textColor }
    }
  }

  return null
}

// Hook to get container dimensions
function useContainerSize(ref: React.RefObject<HTMLDivElement | null>) {
  const [size, setSize] = useState({ width: 0, height: 0 })

  useLayoutEffect(() => {
    let mounted = true
    let resizeObserver: ResizeObserver | null = null
    let timeoutId: ReturnType<typeof setTimeout> | null = null

    const measure = () => {
      const element = ref.current
      if (!element || !mounted) return

      const newWidth = element.clientWidth
      const newHeight = element.clientHeight
      if (newWidth > 0 && newHeight > 0) {
        setSize({ width: newWidth, height: newHeight })
      }
    }

    // Try to measure immediately
    measure()

    // Also set up observer for when element becomes available
    const checkAndObserve = () => {
      const element = ref.current
      if (element && mounted) {
        measure()
        resizeObserver = new ResizeObserver(measure)
        resizeObserver.observe(element)
      } else if (mounted) {
        // Element not ready yet, try again
        timeoutId = setTimeout(checkAndObserve, 50)
      }
    }

    checkAndObserve()

    return () => {
      mounted = false
      if (timeoutId) clearTimeout(timeoutId)
      if (resizeObserver) resizeObserver.disconnect()
    }
  }, [ref])

  return size
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

// Get default width for a column type
function getDefaultWidth(type: ColumnType): number {
  if (type === 'checkbox') return 80
  if (type === 'title') return 200
  if (type === 'email' || type === 'url') return 200
  if (type === 'number') return 100
  if (type === 'currency') return 120
  if (type === 'image') return 100
  return 150
}

// Convert backend PropertySchema to ColumnDef
function schemaToColumn(schema: PropertySchema): ColumnDef {
  const type = (schema.type || 'text') as ColumnType
  // Width is stored in options, fallback to default
  const width = (schema.options?.width as number) || getDefaultWidth(type)

  return {
    id: schema.id || '',
    title: schema.name || '',
    type,
    width,
    options: schema.options,
  }
}

// Convert ColumnDef back to PropertySchema
function columnToSchema(column: ColumnDef): PropertySchema {
  return {
    id: column.id,
    name: column.title,
    type: column.type,
    options: column.options,
  }
}

export function DatabasePage() {
  const { databaseId } = useParams<{ spaceId: string; databaseId: string }>()
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'
  const containerRef = useRef<HTMLDivElement>(null)
  const { width } = useContainerSize(containerRef)

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
  const updateDatabase = useUpdateDatabase()
  const createRow = useCreateRow()
  const updateRow = useUpdateRow()
  const createView = useCreateView()
  const updateView = useUpdateView()
  const deleteView = useDeleteView()

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
      // Check if current activeViewId is valid
      const isCurrentViewValid = activeViewId && views.some(v => v.id === activeViewId)

      if (!isCurrentViewValid) {
        // Check if default_view is a valid view ID, otherwise use first view
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

  // Local state
  const [databaseName, setDatabaseName] = useState('')
  const [isEditingName, setIsEditingName] = useState(false)
  const [headerMenuOpen, setHeaderMenuOpen] = useState<{ col: number; bounds: Rectangle } | null>(null)
  const [addColumnMenuOpen, setAddColumnMenuOpen] = useState<{ bounds: Rectangle } | null>(null)
  const [editingColumnName, setEditingColumnName] = useState<string>('')
  const [isSettingsSidebarOpen, setIsSettingsSidebarOpen] = useState(false)
  const [showSortSubmenu, setShowSortSubmenu] = useState(false)
  const [editingOptionId, setEditingOptionId] = useState<string | null>(null)
  const [optionsMenuOpen, setOptionsMenuOpen] = useState<{ col: number; bounds: Rectangle } | null>(null)
  const [selectCellEditor, setSelectCellEditor] = useState<{ col: number; row: number; bounds: Rectangle } | null>(null)
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

  function getColumnIcon(type: ColumnType): string {
    switch (type) {
      case 'title':
      case 'text': return 'headerString'
      case 'number': return 'headerNumber'
      case 'currency': return 'headerNumber'
      case 'formula': return 'headerMath'
      case 'checkbox': return 'headerBoolean'
      case 'email': return 'headerString'
      case 'url': return 'headerUri'
      case 'date': return 'headerDate'
      case 'image': return 'headerImage'
      default: return 'headerString'
    }
  }

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
          // For formula, evaluate conditional style on the computed result
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
          // For select types, display as bubble/tag
          const selectValue = value as string | string[] | undefined
          const selectOptions = column.options?.options as SelectOption[] | undefined

          // For multi_select, value can be an array
          const selectedValues = Array.isArray(selectValue)
            ? selectValue
            : (selectValue ? [selectValue] : [])

          // Map values to display names
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

  // Custom cell drawing for select cells with colors
  const drawCell: DrawCellCallback = useCallback(
    (args, drawContent) => {
      const { cell, rect, ctx, col } = args
      const column = columns[col]

      // Only custom draw for select/multi_select cells with bubble data
      if (!column || (column.type !== 'select' && column.type !== 'multi_select')) {
        drawContent() // Use default drawing
        return
      }

      if (cell.kind !== GridCellKind.Bubble) {
        drawContent()
        return
      }

      const bubbleData = cell.data as string[]
      if (!bubbleData || bubbleData.length === 0) {
        // Empty cell - use default drawing
        drawContent()
        return
      }

      const selectOptions = column.options?.options as SelectOption[] | undefined
      const padding = 8
      const tagHeight = 20
      const tagRadius = 4
      const tagGap = 4
      const fontSize = 12

      // Draw each tag with its color
      let x = rect.x + padding
      const y = rect.y + (rect.height - tagHeight) / 2

      ctx.font = `${fontSize}px Inter, system-ui, sans-serif`
      ctx.textBaseline = 'middle'

      for (const displayValue of bubbleData) {
        // Find the matching option to get its color
        const option = selectOptions?.find(o => o.name === displayValue)
        const colorValue = option?.color || 'default'
        const colorDef = selectOptionColors.find(c => c.value === colorValue) || selectOptionColors[0]

        // Measure text
        const textWidth = ctx.measureText(displayValue).width
        const tagWidth = textWidth + 12

        // Check if we have space for this tag
        if (x + tagWidth > rect.x + rect.width - padding) {
          break
        }

        // Draw tag background with rounded corners
        ctx.fillStyle = isDarkMode ? colorDef.hexDark : colorDef.hex
        ctx.beginPath()
        ctx.roundRect(x, y, tagWidth, tagHeight, tagRadius)
        ctx.fill()

        // Draw text
        ctx.fillStyle = isDarkMode ? colorDef.textHexDark : colorDef.textHex
        ctx.fillText(displayValue, x + 6, y + tagHeight / 2 + 1)

        x += tagWidth + tagGap
      }
    },
    [columns, isDarkMode]
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
          // Store the first image URL
          value = Array.isArray(newValue.data) && newValue.data.length > 0 ? newValue.data[0] : ''
          break
        default:
          return
      }

      // Update row via API
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

    // Remove the dragged item and insert it at the new position
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

  // Save database name
  const saveDatabaseName = useCallback(() => {
    if (!databaseId || !databaseName.trim()) return

    updateDatabase.mutate({
      databaseId,
      name: databaseName.trim(),
    })

    setIsEditingName(false)
  }, [databaseId, databaseName, updateDatabase])

  // Loading state
  if (isLoadingDatabase || isLoadingRows) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </MainLayout>
    )
  }

  // Not found state
  if (!database) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Database not found</p>
        </div>
      </MainLayout>
    )
  }

  // Document database type - render DocumentDatabaseView
  if ((database as { type?: string }).type === 'document') {
    return <DocumentDatabaseView />
  }

  // Spreadsheet database type (default)
  return (
    <MainLayout>
      <div className="flex flex-col h-full">
        {/* Simple header with database name */}
        <div className="px-12 py-6 flex items-center justify-center relative">
          <div className="text-center">
            {isEditingName ? (
              <input
                type="text"
                value={databaseName}
                onChange={(e) => setDatabaseName(e.target.value)}
                onBlur={saveDatabaseName}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    saveDatabaseName()
                  }
                  if (e.key === 'Escape') {
                    setDatabaseName(database.name || '')
                    setIsEditingName(false)
                  }
                }}
                className="text-3xl font-bold bg-transparent border-none outline-none text-center"
                autoFocus
              />
            ) : (
              <h1
                className="text-3xl font-bold cursor-pointer hover:bg-muted/50 rounded px-2 inline-block"
                onClick={() => setIsEditingName(true)}
              >
                {database.name || 'Untitled Database'}
              </h1>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSettingsSidebarOpen(true)}
            title="Database settings"
            className="absolute right-12"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        {/* View tabs with filter/sort */}
        {views.length > 0 && (
          <ViewTabs
            views={views}
            activeViewId={activeViewId}
            activeView={activeView}
            columns={database?.schema || []}
            allColumns={database?.schema || []}
            hiddenColumnIds={hiddenColumnIds}
            onViewChange={setActiveViewId}
            onCreateView={(name, type) => {
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
            }}
            onRenameView={(viewId, name) => {
              if (!databaseId) return
              updateView.mutate({ databaseId, viewId, name })
            }}
            onDuplicateView={(viewId) => {
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
            }}
            onDeleteView={(viewId) => {
              if (!databaseId) return
              deleteView.mutate({ databaseId, viewId })
              // Switch to first view if deleting active view
              if (viewId === activeViewId && views.length > 1) {
                const nextView = views.find(v => v.id !== viewId)
                if (nextView) setActiveViewId(nextView.id)
              }
            }}
            onFilterChange={(filter) => {
              if (!databaseId || !activeViewId) return
              // If filter is undefined, we want to clear the filter
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
            }}
            onSortChange={(sort) => {
              if (!databaseId || !activeViewId) return
              // If sort is empty array, we want to clear the sort
              if (sort.length === 0) {
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
            }}
            onShowColumn={showColumn}
            onHideColumn={hideColumn}
            onShowAllColumns={showAllColumns}
            canDeleteView={views.length > 1}
          />
        )}

        {/* Database view content */}
        <div className="flex-1 min-h-0 overflow-auto">
          {/* List View */}
          {activeView?.type === 'list' && (
            <div className="px-12 py-4">
              <ListView
                rows={rows}
                columns={database?.schema || []}
                onRowClick={(rowId) => {
                  // TODO: Open row detail
                  console.log('Open row:', rowId)
                }}
                onCreateRow={onRowAppended}
              />
            </div>
          )}

          {/* Gallery View */}
          {activeView?.type === 'gallery' && (
            <GalleryView
              rows={rows}
              columns={database?.schema || []}
              onRowClick={(rowId) => {
                // TODO: Open row detail
                console.log('Open row:', rowId)
              }}
              onCreateRow={onRowAppended}
            />
          )}

          {/* Board View */}
          {activeView?.type === 'board' && (
            <BoardView
              rows={rows}
              columns={database?.schema || []}
              onRowClick={(rowId) => {
                // TODO: Open row detail
                console.log('Open row:', rowId)
              }}
              onCreateRow={(properties) => {
                if (!databaseId) return
                const newProperties: Record<string, unknown> = { ...properties }
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
              }}
              onUpdateRow={(rowId, properties) => {
                if (!databaseId) return
                const row = rows.find(r => r.id === rowId)
                if (!row) return
                updateRow.mutate({
                  databaseId,
                  rowId,
                  properties: { ...row.properties, ...properties },
                })
              }}
            />
          )}

          {/* Table View (default) */}
          {(!activeView?.type || activeView?.type === 'table') && (
            <div className="px-12 py-4">
              <div
                ref={containerRef}
                className="w-full"
                style={{ position: 'relative' }}
              >
                {width > 0 && (
                  <DataEditor
                    columns={gridColumns}
                    rows={rows.length}
                    getCellContent={getCellContent}
                    drawCell={drawCell}
                    onCellEdited={onCellEdited}
                    onHeaderMenuClick={onHeaderMenuClick}
                    onHeaderClicked={onHeaderClicked}
                    theme={gridTheme}
                    width={width}
                    height={36 + rows.length * 36 + 1}
                    rowMarkers="number"
                    smoothScrollX
                    rowHeight={36}
                    headerHeight={36}
                    getCellsForSelection={true}
                    keybindings={{
                      search: true,
                      selectAll: true,
                      selectColumn: true,
                      selectRow: true,
                      copy: true,
                      paste: true,
                      delete: true,
                      downFill: true,
                      rightFill: true,
                    }}
                    onColumnResize={(column, newSize) => {
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
                    }}
                    onCellClicked={(cell, event) => {
                      const [colIndex, rowIndex] = cell
                      const column = columns[colIndex]
                      if (column && (column.type === 'select' || column.type === 'multi_select')) {
                        // Open select editor for this cell
                        setSelectCellEditor({
                          col: colIndex,
                          row: rowIndex,
                          bounds: event.bounds,
                        })
                      }
                    }}
                  />
                )}
                {/* Add row button */}
                <button
                  onClick={onRowAppended}
                  className="w-full py-2 text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors text-left pl-10"
                >
                  + New
                </button>

            {/* Header Menu Dropdown - Column Configuration */}
            {headerMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-[999]"
                  onClick={() => {
                    setHeaderMenuOpen(null)
                    setShowSortSubmenu(false)
                    setEditingOptionId(null)
                  }}
                />
                <div
                  className="fixed rounded-lg shadow-lg z-[1000] w-[280px] py-2"
                  style={{
                    left: headerMenuOpen.bounds.x,
                    top: headerMenuOpen.bounds.y + headerMenuOpen.bounds.height,
                    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                    border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                  }}
                >
                  {/* Column name input with type icon */}
                  <div className="px-3 pb-2">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-muted/30">
                      {(() => {
                        const IconComponent = columnTypes.find(t => t.value === columns[headerMenuOpen.col]?.type)?.icon || AlignLeft
                        return <IconComponent className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      })()}
                      <input
                        type="text"
                        value={editingColumnName}
                        onChange={(e) => setEditingColumnName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            renameColumn(headerMenuOpen.col, editingColumnName)
                            setHeaderMenuOpen(null)
                          }
                          if (e.key === 'Escape') {
                            setHeaderMenuOpen(null)
                          }
                        }}
                        onBlur={() => {
                          renameColumn(headerMenuOpen.col, editingColumnName)
                        }}
                        className="flex-1 bg-transparent text-sm outline-none min-w-0"
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>

                  {/* Filter option */}
                  <div
                    onClick={() => {
                      // TODO: Add filter for this column
                      setHeaderMenuOpen(null)
                    }}
                    className="mx-2 px-3 py-1.5 cursor-pointer flex items-center gap-3 text-sm hover:bg-muted rounded-md"
                  >
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <span>Filter</span>
                  </div>

                  {/* Sort option with submenu */}
                  <div
                    className="relative"
                    onMouseEnter={() => setShowSortSubmenu(true)}
                    onMouseLeave={() => setShowSortSubmenu(false)}
                  >
                    <div
                      className="mx-2 px-3 py-1.5 cursor-pointer flex items-center gap-3 text-sm hover:bg-muted rounded-md"
                    >
                      <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                      <span>Sort</span>
                      <span className="text-muted-foreground text-xs ml-auto">›</span>
                    </div>
                    {/* Sort submenu */}
                    {showSortSubmenu && (
                      <div
                        className="absolute left-full top-0 ml-1 rounded-lg shadow-lg w-[160px] py-1"
                        style={{
                          backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                          border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                        }}
                      >
                        <div
                          onClick={() => {
                            const columnId = columns[headerMenuOpen.col]?.id
                            if (columnId) {
                              sortByColumn(columnId, 'asc')
                              setHeaderMenuOpen(null)
                              setShowSortSubmenu(false)
                            }
                          }}
                          className="mx-1 px-3 py-1.5 cursor-pointer flex items-center gap-3 text-sm hover:bg-muted rounded-md"
                        >
                          <ArrowUp className="w-4 h-4 text-muted-foreground" />
                          <span>Ascending</span>
                        </div>
                        <div
                          onClick={() => {
                            const columnId = columns[headerMenuOpen.col]?.id
                            if (columnId) {
                              sortByColumn(columnId, 'desc')
                              setHeaderMenuOpen(null)
                              setShowSortSubmenu(false)
                            }
                          }}
                          className="mx-1 px-3 py-1.5 cursor-pointer flex items-center gap-3 text-sm hover:bg-muted rounded-md"
                        >
                          <ArrowDown className="w-4 h-4 text-muted-foreground" />
                          <span>Descending</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Wrap content toggle */}
                  <div
                    onClick={() => {
                      if (!databaseId || !database?.schema) return
                      const newSchema = [...database.schema]
                      if (newSchema[headerMenuOpen.col]) {
                        const currentWrap = newSchema[headerMenuOpen.col].options?.wrap as boolean
                        newSchema[headerMenuOpen.col] = {
                          ...newSchema[headerMenuOpen.col],
                          options: { ...newSchema[headerMenuOpen.col].options, wrap: !currentWrap }
                        }
                      }
                      updateDatabase.mutate({ databaseId, schema: newSchema })
                    }}
                    className="mx-2 px-3 py-1.5 cursor-pointer flex items-center gap-3 text-sm hover:bg-muted rounded-md"
                  >
                    <WrapText className="w-4 h-4 text-muted-foreground" />
                    <span className="flex-1">Wrap content</span>
                    {(columns[headerMenuOpen.col]?.options?.wrap as boolean) && (
                      <span className="text-primary">✓</span>
                    )}
                  </div>

                  {/* Insert left */}
                  <div
                    onClick={() => {
                      if (!databaseId || !database?.schema) return
                      const newColumn: PropertySchema = {
                        id: `col_${Date.now()}`,
                        name: 'New column',
                        type: 'text',
                      }
                      const newSchema = [...database.schema]
                      newSchema.splice(headerMenuOpen.col, 0, newColumn)
                      updateDatabase.mutate({ databaseId, schema: newSchema })
                      setHeaderMenuOpen(null)
                    }}
                    className="mx-2 px-3 py-1.5 cursor-pointer flex items-center gap-3 text-sm hover:bg-muted rounded-md"
                  >
                    <PanelLeftClose className="w-4 h-4 text-muted-foreground" />
                    <span>Insert left</span>
                  </div>

                  {/* Insert right */}
                  <div
                    onClick={() => {
                      if (!databaseId || !database?.schema) return
                      const newColumn: PropertySchema = {
                        id: `col_${Date.now()}`,
                        name: 'New column',
                        type: 'text',
                      }
                      const newSchema = [...database.schema]
                      newSchema.splice(headerMenuOpen.col + 1, 0, newColumn)
                      updateDatabase.mutate({ databaseId, schema: newSchema })
                      setHeaderMenuOpen(null)
                    }}
                    className="mx-2 px-3 py-1.5 cursor-pointer flex items-center gap-3 text-sm hover:bg-muted rounded-md"
                  >
                    <PanelRightClose className="w-4 h-4 text-muted-foreground" />
                    <span>Insert right</span>
                  </div>

                  {/* Edit property button for select/multi_select columns */}
                  {(columns[headerMenuOpen.col]?.type === 'select' || columns[headerMenuOpen.col]?.type === 'multi_select') && (
                    <div
                      className="relative"
                      onMouseEnter={() => setOptionsMenuOpen({ col: headerMenuOpen.col, bounds: headerMenuOpen.bounds })}
                      onMouseLeave={() => {
                        setOptionsMenuOpen(null)
                        setEditingOptionId(null)
                      }}
                    >
                      <div className="mx-2 px-3 py-1.5 cursor-pointer flex items-center gap-3 text-sm hover:bg-muted rounded-md">
                        <CircleDot className="w-4 h-4 text-muted-foreground" />
                        <span>Edit property</span>
                        <span className="text-muted-foreground text-xs ml-auto">›</span>
                      </div>

                      {/* Options submenu */}
                      {optionsMenuOpen && (
                        <div
                          className="absolute left-full top-0 -ml-1 pl-2 z-[1001]"
                          onMouseEnter={() => setOptionsMenuOpen({ col: headerMenuOpen.col, bounds: headerMenuOpen.bounds })}
                          onMouseLeave={() => {
                            setOptionsMenuOpen(null)
                            setEditingOptionId(null)
                          }}
                        >
                          <div
                            className="rounded-lg shadow-lg w-[280px]"
                            style={{
                              backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                              border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                            }}
                          >
                          {/* Header */}
                          <div className="px-3 py-2 border-b border-border">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Edit property</span>
                              <span className="text-xs text-muted-foreground">
                                {columns[optionsMenuOpen.col]?.type === 'multi_select' ? 'Multi-select' : 'Select'}
                              </span>
                            </div>
                          </div>

                          {/* Options section */}
                          <div className="p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-medium text-muted-foreground">Options</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  addSelectOption(optionsMenuOpen.col)
                                }}
                                className="p-1 hover:bg-muted rounded"
                              >
                                <Plus className="w-4 h-4 text-muted-foreground" />
                              </button>
                            </div>

                            <div className="space-y-1 max-h-64 overflow-y-auto">
                              {getSelectOptions(optionsMenuOpen.col).map((option) => {
                                const colorInfo = selectOptionColors.find(c => c.value === option.color) || selectOptionColors[0]
                                return (
                                  <div
                                    key={option.id}
                                    draggable
                                    onDragStart={(e) => {
                                      e.stopPropagation()
                                      setDraggingOptionId(option.id)
                                      e.dataTransfer.effectAllowed = 'move'
                                    }}
                                    onDragOver={(e) => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      if (draggingOptionId && draggingOptionId !== option.id) {
                                        setDragOverOptionId(option.id)
                                      }
                                    }}
                                    onDragLeave={(e) => {
                                      e.stopPropagation()
                                      setDragOverOptionId(null)
                                    }}
                                    onDrop={(e) => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      if (draggingOptionId && draggingOptionId !== option.id) {
                                        reorderSelectOptions(optionsMenuOpen.col, draggingOptionId, option.id)
                                      }
                                      setDraggingOptionId(null)
                                      setDragOverOptionId(null)
                                    }}
                                    onDragEnd={() => {
                                      setDraggingOptionId(null)
                                      setDragOverOptionId(null)
                                    }}
                                    className={dragOverOptionId === option.id ? 'border-t-2 border-primary' : ''}
                                  >
                                    <div
                                      className={`flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted group cursor-pointer ${
                                        draggingOptionId === option.id ? 'opacity-50' : ''
                                      }`}
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setEditingOptionId(editingOptionId === option.id ? null : option.id)
                                      }}
                                    >
                                      <GripVertical className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 flex-shrink-0 cursor-grab active:cursor-grabbing" />
                                      <span className={`px-2 py-0.5 rounded text-xs ${colorInfo.bg} ${colorInfo.text}`}>
                                        {option.name || 'Unnamed'}
                                      </span>
                                      <ChevronRight className={`w-3.5 h-3.5 text-muted-foreground ml-auto transition-transform ${editingOptionId === option.id ? 'rotate-90' : ''}`} />
                                    </div>

                                    {/* Expanded option editor */}
                                    {editingOptionId === option.id && (
                                      <div
                                        className="ml-6 mt-2 mb-3 p-2 rounded-md bg-muted/30 border border-border"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        {/* Option name input */}
                                        <input
                                          type="text"
                                          value={option.name}
                                          onChange={(e) => updateSelectOption(optionsMenuOpen.col, option.id, { name: e.target.value })}
                                          placeholder="Option name"
                                          className="w-full px-2 py-1.5 text-sm border border-border rounded bg-background outline-none focus:border-primary mb-2"
                                          autoFocus
                                          onClick={(e) => e.stopPropagation()}
                                        />

                                        {/* Color picker */}
                                        <div className="mb-2">
                                          <span className="text-xs text-muted-foreground">Color</span>
                                          <div className="grid grid-cols-5 gap-1 mt-1">
                                            {selectOptionColors.map((color) => (
                                              <button
                                                key={color.value}
                                                onClick={(e) => {
                                                  e.stopPropagation()
                                                  updateSelectOption(optionsMenuOpen.col, option.id, { color: color.value })
                                                }}
                                                className={`w-6 h-6 rounded flex items-center justify-center ${color.bg} ${
                                                  option.color === color.value ? 'ring-2 ring-primary ring-offset-1' : ''
                                                }`}
                                                title={color.name}
                                              >
                                                {option.color === color.value && (
                                                  <span className={`text-xs ${color.text}`}>✓</span>
                                                )}
                                              </button>
                                            ))}
                                          </div>
                                        </div>

                                        {/* Delete button */}
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            deleteSelectOption(optionsMenuOpen.col, option.id)
                                          }}
                                          className="flex items-center gap-2 text-xs text-destructive hover:text-destructive/80"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                          <span>Delete option</span>
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                )
                              })}

                              {getSelectOptions(optionsMenuOpen.col).length === 0 && (
                                <div className="text-xs text-muted-foreground text-center py-4">
                                  No options yet. Click + to add one.
                                </div>
                              )}
                            </div>
                          </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="h-px bg-border mx-3 my-1" />

                  {/* Hide in view */}
                  <div
                    onClick={() => {
                      const columnId = columns[headerMenuOpen.col]?.id
                      if (columnId) hideColumn(columnId)
                    }}
                    className="mx-2 px-3 py-1.5 cursor-pointer flex items-center gap-3 text-sm hover:bg-muted rounded-md"
                  >
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                    <span>Hide in view</span>
                  </div>

                  {/* Delete column */}
                  <div
                    onClick={() => deleteColumn(headerMenuOpen.col)}
                    className="mx-2 px-3 py-1.5 cursor-pointer flex items-center gap-3 text-sm text-destructive hover:bg-destructive/10 rounded-md"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete column</span>
                  </div>
                </div>
              </>
            )}

            {/* Add Column Menu */}
            {addColumnMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-[999]"
                  onClick={() => setAddColumnMenuOpen(null)}
                />
                <div
                  className="fixed rounded-lg shadow-lg z-[1000] w-[320px]"
                  style={{
                    left: addColumnMenuOpen.bounds.x,
                    top: addColumnMenuOpen.bounds.y + addColumnMenuOpen.bounds.height,
                    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                    border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                  }}
                >
                  {/* Search input */}
                  <div className="p-2">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-muted/30">
                      <Search className="w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Select type"
                        className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground"
                        autoFocus
                      />
                    </div>
                  </div>
                  {/* 2-column grid of types */}
                  <div className="px-2 pb-2 grid grid-cols-2 gap-1">
                    {columnTypes.map((type) => {
                      const IconComponent = type.icon
                      return (
                        <div
                          key={type.value}
                          onClick={() => addColumnWithType(type.value)}
                          className="px-3 py-2 cursor-pointer flex items-center gap-2.5 text-sm hover:bg-muted rounded-md"
                        >
                          <IconComponent className="w-4 h-4 text-muted-foreground" />
                          <span>{type.label}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </>
            )}

            {/* Select Cell Editor Popover */}
            {selectCellEditor && (
              <>
                <div
                  className="fixed inset-0 z-[999]"
                  onClick={() => setSelectCellEditor(null)}
                />
                <div
                  className="fixed rounded-lg shadow-lg z-[1000] w-[220px] py-2"
                  style={{
                    left: selectCellEditor.bounds.x,
                    top: selectCellEditor.bounds.y + selectCellEditor.bounds.height,
                    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                    border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                  }}
                >
                  <div className="px-2 pb-2">
                    <span className="text-xs text-muted-foreground px-2">Select an option</span>
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {(() => {
                      const column = columns[selectCellEditor.col]
                      const row = rows[selectCellEditor.row]
                      const selectOptions = column?.options?.options as SelectOption[] | undefined
                      const currentValue = row?.properties[column?.id || ''] as string | string[] | undefined
                      const currentValues = Array.isArray(currentValue) ? currentValue : (currentValue ? [currentValue] : [])

                      if (!selectOptions || selectOptions.length === 0) {
                        return (
                          <div className="text-xs text-muted-foreground text-center py-4 px-2">
                            No options available. Edit the column to add options.
                          </div>
                        )
                      }

                      return selectOptions.map((option) => {
                        const colorInfo = selectOptionColors.find(c => c.value === option.color) || selectOptionColors[0]
                        const isSelected = currentValues.includes(option.id) || currentValues.includes(option.name)

                        return (
                          <div
                            key={option.id}
                            onClick={() => {
                              if (!databaseId || !row || !column) return

                              let newValue: string | string[]
                              if (column.type === 'multi_select') {
                                // Toggle selection for multi_select
                                if (isSelected) {
                                  newValue = currentValues.filter(v => v !== option.id && v !== option.name)
                                } else {
                                  newValue = [...currentValues, option.name]
                                }
                              } else {
                                // Single select - just set the value
                                newValue = option.name
                                setSelectCellEditor(null)
                              }

                              updateRow.mutate({
                                databaseId,
                                rowId: row.id,
                                properties: {
                                  ...row.properties,
                                  [column.id]: newValue,
                                },
                              })
                            }}
                            className="mx-1 px-2 py-1.5 cursor-pointer flex items-center gap-2 hover:bg-muted rounded-md"
                          >
                            <span className={`px-2 py-0.5 rounded text-xs ${colorInfo.bg} ${colorInfo.text}`}>
                              {option.name || 'Unnamed'}
                            </span>
                            {isSelected && (
                              <span className="ml-auto text-primary">✓</span>
                            )}
                          </div>
                        )
                      })
                    })()}
                  </div>
                  {columns[selectCellEditor.col]?.type === 'multi_select' && (
                    <div className="border-t border-border mt-2 pt-2 px-2">
                      <button
                        onClick={() => setSelectCellEditor(null)}
                        className="w-full text-center text-xs text-muted-foreground hover:text-foreground py-1"
                      >
                        Done
                      </button>
                    </div>
                  )}
                  {/* Clear selection option */}
                  <div
                    onClick={() => {
                      const column = columns[selectCellEditor.col]
                      const row = rows[selectCellEditor.row]
                      if (!databaseId || !row || !column) return

                      updateRow.mutate({
                        databaseId,
                        rowId: row.id,
                        properties: {
                          ...row.properties,
                          [column.id]: column.type === 'multi_select' ? [] : '',
                        },
                      })
                      setSelectCellEditor(null)
                    }}
                    className="mx-1 mt-1 px-2 py-1.5 cursor-pointer flex items-center gap-2 hover:bg-muted rounded-md text-muted-foreground"
                  >
                    <span className="text-xs">Clear selection</span>
                  </div>
                </div>
              </>
            )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Settings Sidebar */}
      <DatabaseSettingsSidebar
        isOpen={isSettingsSidebarOpen}
        onClose={() => setIsSettingsSidebarOpen(false)}
        database={database}
      />
    </MainLayout>
  )
}
