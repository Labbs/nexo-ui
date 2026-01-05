import { useCallback, useMemo, useRef, useState, useLayoutEffect } from 'react'
import DataEditor, {
  GridCellKind,
  GridColumn,
  Item,
  EditableGridCell,
  GridCell,
  Theme,
} from '@glideapps/glide-data-grid'
import '@glideapps/glide-data-grid/dist/index.css'
import type { PropertySchema, DatabaseRow } from '@/hooks/use-databases'

// Simple hook to get container dimensions
function useContainerSize(ref: React.RefObject<HTMLDivElement | null>) {
  const [size, setSize] = useState({ width: 0, height: 0 })

  useLayoutEffect(() => {
    const element = ref.current
    if (!element) return

    const updateSize = () => {
      setSize({
        width: element.clientWidth,
        height: element.clientHeight,
      })
    }

    updateSize()

    const resizeObserver = new ResizeObserver(updateSize)
    resizeObserver.observe(element)

    return () => resizeObserver.disconnect()
  }, [ref])

  return size
}

interface GlideDatabaseTableProps {
  schema: PropertySchema[]
  rows: DatabaseRow[]
  onUpdateRow: (rowId: string, properties: Record<string, unknown>) => void
  onDeleteRow: (rowId: string) => void
  onAddRow: () => void
  onAddProperty: (property: PropertySchema) => Promise<void>
  onRowClick?: (rowId: string) => void
  isLoading?: boolean
  isDarkMode?: boolean
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

export function GlideDatabaseTable({
  schema,
  rows,
  onUpdateRow,
  onAddRow,
  onRowClick: _onRowClick,
  isLoading = false,
  isDarkMode = true,
}: GlideDatabaseTableProps) {
  // TODO: Implement row click via selection or cell activation
  void _onRowClick
  const containerRef = useRef<HTMLDivElement>(null)
  const { width, height } = useContainerSize(containerRef)

  // Convert schema to Glide columns
  const columns: GridColumn[] = useMemo(() => {
    return schema.map((prop) => ({
      id: prop.id,
      title: prop.name,
      width: prop.type === 'title' ? 280 : 180,
      icon: getColumnIcon(prop.type),
      hasMenu: true,
      grow: prop.type === 'title' ? 1 : 0,
    }))
  }, [schema])

  // Get cell content for a specific cell
  const getCellContent = useCallback(
    ([col, row]: Item): GridCell => {
      const property = schema[col]
      const rowData = rows[row]

      if (!property || !rowData) {
        return {
          kind: GridCellKind.Text,
          data: '',
          displayData: '',
          allowOverlay: false,
        }
      }

      const value = rowData.properties[property.id]

      return propertyToCell(property, value)
    },
    [schema, rows]
  )

  // Handle cell edit
  const onCellEdited = useCallback(
    ([col, row]: Item, newValue: EditableGridCell) => {
      const property = schema[col]
      const rowData = rows[row]

      console.log('onCellEdited called:', { col, row, newValue, property, rowData })

      if (!property || !rowData) return

      const value = cellToValue(property, newValue)
      console.log('Converted value:', value)

      onUpdateRow(rowData.id, {
        ...rowData.properties,
        [property.id]: value,
      })
    },
    [schema, rows, onUpdateRow]
  )

  // Handle adding new row
  const onRowAppended = useCallback(() => {
    onAddRow()
  }, [onAddRow])

  const theme = isDarkMode ? darkTheme : lightTheme

  if (isLoading) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-[calc(100vh-200px)] min-h-[400px] rounded-lg overflow-hidden border border-border relative"
      style={{ position: 'relative' }}
    >
      {width > 0 && height > 0 && (
        <DataEditor
          columns={columns}
          rows={rows.length}
          getCellContent={getCellContent}
          onCellEdited={onCellEdited}
          onRowAppended={onRowAppended}
          theme={theme}
          width={width}
          height={height}
          rowMarkers="number"
          smoothScrollX
          smoothScrollY
          rowHeight={36}
          headerHeight={36}
          trailingRowOptions={{
            sticky: true,
            tint: true,
            hint: 'New row',
          }}
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
        />
      )}
    </div>
  )
}

// Helper to get column icon based on property type
function getColumnIcon(type: string): string | undefined {
  const iconMap: Record<string, string> = {
    title: 'headerString',
    text: 'headerString',
    number: 'headerNumber',
    checkbox: 'headerBoolean',
    select: 'headerSingleValue',
    multi_select: 'headerArray',
    date: 'headerDate',
    url: 'headerUri',
    email: 'headerString',
    phone: 'headerString',
    created_time: 'headerDate',
    updated_time: 'headerDate',
  }
  return iconMap[type]
}

// Convert our PropertySchema + value to Glide GridCell
function propertyToCell(property: PropertySchema, value: unknown): GridCell {
  switch (property.type) {
    case 'title':
    case 'text':
      return {
        kind: GridCellKind.Text,
        data: (value as string) || '',
        displayData: (value as string) || '',
        allowOverlay: true,
        readonly: false,
      }

    case 'number':
      return {
        kind: GridCellKind.Number,
        data: value as number | undefined,
        displayData: value !== null && value !== undefined ? String(value) : '',
        allowOverlay: true,
        readonly: false,
      }

    case 'checkbox':
      return {
        kind: GridCellKind.Boolean,
        data: !!value,
        allowOverlay: false,
        readonly: false,
      }

    case 'select': {
      // Use text cell for select - user types the option name
      const options = (property.options?.options as Array<{ id: string; name: string; color?: string }>) || []
      const selectedOption = options.find((o) => o.id === value || o.name === value)
      return {
        kind: GridCellKind.Text,
        data: selectedOption?.name || '',
        displayData: selectedOption?.name || '',
        allowOverlay: true,
        readonly: false,
      }
    }

    case 'multi_select': {
      // Use text cell for multi-select - comma separated values
      const options = (property.options?.options as Array<{ id: string; name: string; color?: string }>) || []
      const selectedIds = Array.isArray(value) ? value : []
      const selectedNames = options
        .filter((o) => selectedIds.includes(o.id) || selectedIds.includes(o.name))
        .map((o) => o.name)
        .join(', ')

      return {
        kind: GridCellKind.Text,
        data: selectedNames,
        displayData: selectedNames,
        allowOverlay: true,
        readonly: false,
      }
    }

    case 'date': {
      const dateValue = value ? new Date(value as string) : undefined
      return {
        kind: GridCellKind.Text,
        data: dateValue?.toISOString().split('T')[0] || '',
        displayData: dateValue?.toLocaleDateString() || '',
        allowOverlay: true,
        readonly: false,
      }
    }

    case 'url':
      return {
        kind: GridCellKind.Uri,
        data: (value as string) || '',
        allowOverlay: true,
        readonly: false,
      }

    case 'email':
      return {
        kind: GridCellKind.Text,
        data: (value as string) || '',
        displayData: (value as string) || '',
        allowOverlay: true,
        readonly: false,
      }

    case 'phone':
      return {
        kind: GridCellKind.Text,
        data: (value as string) || '',
        displayData: (value as string) || '',
        allowOverlay: true,
        readonly: false,
      }

    case 'created_time':
    case 'updated_time':
      return {
        kind: GridCellKind.Text,
        data: value ? new Date(value as string).toLocaleString() : '',
        displayData: value ? new Date(value as string).toLocaleString() : '-',
        allowOverlay: false,
        readonly: true,
      }

    default:
      return {
        kind: GridCellKind.Text,
        data: String(value ?? ''),
        displayData: String(value ?? ''),
        allowOverlay: false,
        readonly: true,
      }
  }
}

// Convert Glide cell value back to our format
function cellToValue(property: PropertySchema, cell: EditableGridCell): unknown {
  switch (property.type) {
    case 'title':
    case 'text':
    case 'email':
    case 'phone':
      if (cell.kind === GridCellKind.Text) {
        return cell.data
      }
      return null

    case 'number':
      if (cell.kind === GridCellKind.Number) {
        return cell.data
      }
      return null

    case 'checkbox':
      if (cell.kind === GridCellKind.Boolean) {
        return cell.data
      }
      return false

    case 'select':
      if (cell.kind === GridCellKind.Text) {
        // Find the option ID from the typed name
        const options = (property.options?.options as Array<{ id: string; name: string }>) || []
        const selected = options.find((o) => o.name.toLowerCase() === (cell.data as string).toLowerCase())
        return selected?.id || null
      }
      return null

    case 'multi_select':
      if (cell.kind === GridCellKind.Text) {
        const options = (property.options?.options as Array<{ id: string; name: string }>) || []
        const names = (cell.data as string).split(',').map((s) => s.trim()).filter(Boolean)
        return names.map((name: string) => {
          const option = options.find((o) => o.name.toLowerCase() === name.toLowerCase())
          return option?.id || name
        })
      }
      return []

    case 'date':
      if (cell.kind === GridCellKind.Text && cell.data) {
        try {
          return new Date(cell.data).toISOString()
        } catch {
          return null
        }
      }
      return null

    case 'url':
      if (cell.kind === GridCellKind.Uri) {
        return cell.data
      }
      return null

    default:
      return null
  }
}
