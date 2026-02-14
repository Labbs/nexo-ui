<<<<<<< HEAD
import { useState, useCallback, useRef, useEffect } from 'react'
=======
import { useState, useCallback, useRef, useEffect, memo } from 'react'
>>>>>>> d4609d4 (feat: add hooks for managing spaces, users, versions, and webhooks)
import { useTranslation } from 'react-i18next'
import {
  Plus,
  Trash2,
  GripVertical,
  FileText,
  MoreHorizontal,
  Type,
  Hash,
  CheckSquare,
  CircleDot,
  Tags,
  Calendar,
  Link,
  Mail,
  Phone,
  ExternalLink,
  ArrowUpDown,
  EyeOff,
  ChevronRight,
  ChevronLeft,
  Filter,
  WrapText,
  Palette,
  Copy,
  Info,
  User,
  Clock,
  Edit3,
  ArrowUpFromLine,
  ArrowDownFromLine,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { PropertyCell } from '../common/property-cell'
import { AddPropertyPopover } from '../common/add-property-popover'
import { Input } from '@/components/ui/input'
import type { PropertySchema } from '@/hooks/use-database'
import {
  selectOptionColors,
  type SelectOption,
  type NumberFormatOptions,
  type DateFormatOptions,
  type ColumnOptions,
} from '@/lib/database'
import type { ConditionalRule } from '@/lib/database/conditionalStyles'
import { NumberFormatEditor } from '../common/number-format-editor'
import { DateFormatEditor } from '../common/date-format-editor'
import { ConditionalFormatEditor } from '../common/conditional-format-editor'
import { IconPicker, DocumentIcon, type IconValue } from '@/components/ui/icon-picker'

interface RowData {
  id: string
  properties: Record<string, unknown>
  content?: { icon?: IconValue; blocks?: unknown }
  showInSidebar?: boolean
}

interface DocumentTableViewProps {
  schema: PropertySchema[]
  rows: RowData[]
  onUpdateRow: (rowId: string, properties: Record<string, unknown>) => void
  onDeleteRow: (rowId: string) => void
  onAddRow: () => void
  onAddProperty: (property: PropertySchema) => Promise<void>
  onOpenDocument: (rowId: string) => void
  onUpdateSchema?: (schema: PropertySchema[]) => void
  onRenameColumn?: (columnId: string, name: string) => void
  onDeleteColumn?: (columnId: string) => void
  onHideColumn?: (columnId: string) => void
  onSortColumn?: (columnId: string, direction: 'asc' | 'desc') => void
  onUpdateColumnOptions?: (columnId: string, options: SelectOption[]) => void
  onInsertColumn?: (columnId: string, position: 'left' | 'right') => void
  insertColumnOpen?: boolean
  onInsertColumnOpenChange?: (open: boolean) => void
  onFilterColumn?: (columnId: string) => void
  onToggleWrapText?: (columnId: string, wrapText: boolean) => void
  onUpdateColumnFormat?: (columnId: string, options: Partial<ColumnOptions>) => void
  onDuplicateColumn?: (columnId: string) => void
  isLoading?: boolean
}

// Property type icons mapping
const propertyTypeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  title: Type,
  text: Type,
  number: Hash,
  checkbox: CheckSquare,
  select: CircleDot,
  multi_select: Tags,
  status: CircleDot,
  date: Calendar,
  url: Link,
  email: Mail,
  phone: Phone,
  person: User,
  created_time: Clock,
  created_at: Clock,
  updated_time: Clock,
  updated_at: Clock,
  last_edited_time: Clock,
  relation: Link,
}

export function DocumentTableView({
  schema,
  rows,
  onUpdateRow,
  onDeleteRow,
  onAddRow,
  onAddProperty,
  onOpenDocument,
  onRenameColumn,
  onDeleteColumn,
  onHideColumn,
  onSortColumn,
  onUpdateColumnOptions,
  onInsertColumn,
  insertColumnOpen,
  onInsertColumnOpenChange,
  onFilterColumn,
  onToggleWrapText,
  onUpdateColumnFormat,
  onDuplicateColumn,
  isLoading = false,
}: DocumentTableViewProps) {
  const { t } = useTranslation('database')
  const [editingCell, setEditingCell] = useState<{ rowId: string; propertyId: string } | null>(null)
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)
  const [showAddPropertyPopover, setShowAddPropertyPopover] = useState(false)

  // Column menu state
  const [columnMenuOpen, setColumnMenuOpen] = useState<string | null>(null)
  const [editingColumnName, setEditingColumnName] = useState('')
  const [editingOptionId, setEditingOptionId] = useState<string | null>(null)
  // Track which sub-menu is expanded: 'numberFormat' | 'dateFormat' | 'conditionalFormat' | 'icon' | null

  // Drag-drop state for select options
  const [draggingOptionId, setDraggingOptionId] = useState<string | null>(null)

  // Sync insertColumnOpen prop with internal popover state
  useEffect(() => {
    if (insertColumnOpen) {
      setShowAddPropertyPopover(true)
    }
  }, [insertColumnOpen])
  const [dragOverOptionId, setDragOverOptionId] = useState<string | null>(null)

  // Column widths state
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(() => {
    const widths: Record<string, number> = {}
    schema.forEach((property, index) => {
      const propertyId = property.id || `prop-${index}`
      const isTitle = property.type === 'title'
      widths[propertyId] = isTitle ? 280 : 200
    })
    return widths
  })

  // Column resize state
  const [resizing, setResizing] = useState<{ propertyId: string; startX: number; startWidth: number } | null>(null)
  const tableRef = useRef<HTMLTableElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Keyboard navigation state
  const [focusedCell, setFocusedCell] = useState<{ rowIndex: number; colIndex: number } | null>(null)

  // Handle column resize
  const handleResizeStart = useCallback((e: React.MouseEvent, propertyId: string) => {
    e.preventDefault()
    e.stopPropagation()
    const startWidth = columnWidths[propertyId] || 200
    setResizing({ propertyId, startX: e.clientX, startWidth })
  }, [columnWidths])

  useEffect(() => {
    if (!resizing) return

    const handleMouseMove = (e: MouseEvent) => {
      const diff = e.clientX - resizing.startX
      const newWidth = Math.max(100, resizing.startWidth + diff)
      setColumnWidths(prev => ({
        ...prev,
        [resizing.propertyId]: newWidth
      }))
    }

    const handleMouseUp = () => {
      setResizing(null)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [resizing])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle if we're in an input or textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      // Ctrl+A / Cmd+A - Select all rows
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault()
        setSelectedRows(new Set(rows.map(r => r.id)))
        return
      }

      // Escape - Clear selection and editing
      if (e.key === 'Escape') {
        setEditingCell(null)
        setFocusedCell(null)
        setSelectedRows(new Set())
        return
      }

      // Navigation requires a focused cell
      if (!focusedCell && rows.length > 0 && schema.length > 0) {
        // If no cell is focused and we press an arrow key, focus the first cell
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
          e.preventDefault()
          setFocusedCell({ rowIndex: 0, colIndex: 0 })
          return
        }
      }

      if (!focusedCell) return

      const { rowIndex, colIndex } = focusedCell

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault()
          if (rowIndex > 0) {
            setFocusedCell({ rowIndex: rowIndex - 1, colIndex })
          }
          break

        case 'ArrowDown':
          e.preventDefault()
          if (rowIndex < rows.length - 1) {
            setFocusedCell({ rowIndex: rowIndex + 1, colIndex })
          }
          break

        case 'ArrowLeft':
          e.preventDefault()
          if (colIndex > 0) {
            setFocusedCell({ rowIndex, colIndex: colIndex - 1 })
          }
          break

        case 'ArrowRight':
          e.preventDefault()
          if (colIndex < schema.length - 1) {
            setFocusedCell({ rowIndex, colIndex: colIndex + 1 })
          }
          break

        case 'Tab':
          e.preventDefault()
          if (e.shiftKey) {
            // Move to previous cell
            if (colIndex > 0) {
              setFocusedCell({ rowIndex, colIndex: colIndex - 1 })
            } else if (rowIndex > 0) {
              setFocusedCell({ rowIndex: rowIndex - 1, colIndex: schema.length - 1 })
            }
          } else {
            // Move to next cell
            if (colIndex < schema.length - 1) {
              setFocusedCell({ rowIndex, colIndex: colIndex + 1 })
            } else if (rowIndex < rows.length - 1) {
              setFocusedCell({ rowIndex: rowIndex + 1, colIndex: 0 })
            }
          }
          break

        case 'Enter':
          e.preventDefault()
          // Start editing the focused cell
          const row = rows[rowIndex]
          const property = schema[colIndex]
          if (row && property) {
            const propertyId = property.id || `prop-${colIndex}`
            setEditingCell({ rowId: row.id, propertyId })
          }
          break

        case 'Delete':
        case 'Backspace':
          // Clear the cell content
          if (!editingCell) {
            e.preventDefault()
            const currentRow = rows[rowIndex]
            const currentProperty = schema[colIndex]
            if (currentRow && currentProperty && currentProperty.type !== 'title') {
              const propId = currentProperty.id || `prop-${colIndex}`
              onUpdateRow(currentRow.id, { ...currentRow.properties, [propId]: null })
            }
          }
          break
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('keydown', handleKeyDown)
      return () => container.removeEventListener('keydown', handleKeyDown)
    }
  }, [focusedCell, rows, schema, editingCell, onUpdateRow])

  const handleCellChange = useCallback(
    (rowId: string, propertyId: string, value: unknown) => {
      const row = rows.find((r) => r.id === rowId)
      if (!row) return

      onUpdateRow(rowId, {
        ...row.properties,
        [propertyId]: value,
      })
    },
    [rows, onUpdateRow]
  )

  // Row selection
  const lastSelectedIndexRef = useRef<number | null>(null)

  const toggleRowSelection = useCallback((rowId: string, rowIndex: number, event?: React.MouseEvent) => {
    setSelectedRows((prev) => {
      const next = new Set(prev)

      // Shift+click for range selection
      if (event?.shiftKey && lastSelectedIndexRef.current !== null) {
        const start = Math.min(lastSelectedIndexRef.current, rowIndex)
        const end = Math.max(lastSelectedIndexRef.current, rowIndex)
        for (let i = start; i <= end; i++) {
          next.add(rows[i].id)
        }
        return next
      }

      // Ctrl/Cmd+click for toggle
      if (event?.ctrlKey || event?.metaKey) {
        if (next.has(rowId)) {
          next.delete(rowId)
        } else {
          next.add(rowId)
        }
        lastSelectedIndexRef.current = rowIndex
        return next
      }

      // Regular click - toggle single row
      if (next.has(rowId)) {
        next.delete(rowId)
      } else {
        next.add(rowId)
      }
      lastSelectedIndexRef.current = rowIndex
      return next
    })
  }, [rows])

  const selectAllRows = useCallback(() => {
    if (selectedRows.size === rows.length) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(rows.map(r => r.id)))
    }
  }, [rows, selectedRows.size])

  const isAllSelected = rows.length > 0 && selectedRows.size === rows.length
  const isSomeSelected = selectedRows.size > 0 && selectedRows.size < rows.length

  if (isLoading) {
    return (
      <div className="w-full">
        {/* Header skeleton */}
        <div className="flex border-b bg-muted/30">
          <div className="w-8 shrink-0" />
          <div className="flex-1 flex">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-48 h-8 px-2 flex items-center border-r">
                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        </div>
        {/* Row skeletons */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex border-b">
            <div className="w-8 shrink-0" />
            <div className="flex-1 flex">
              {[1, 2, 3].map((j) => (
                <div key={j} className="w-48 h-9 px-2 flex items-center border-r">
                  <div className="h-4 w-full bg-muted/50 animate-pulse rounded" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className={cn("w-full overflow-x-auto outline-none", resizing && "select-none cursor-col-resize")}
    >
      <table ref={tableRef} className="w-full border-collapse" style={{ tableLayout: 'fixed' }}>
        {/* Header */}
        <thead>
          <tr className="border-t border-b">
            {/* Row selector column */}
            <th className="w-8 p-0 sticky left-0 bg-background z-10">
              <div className="h-8 flex items-center justify-center">
                <Checkbox
                  checked={isAllSelected}
                  // @ts-expect-error - indeterminate is a valid prop
                  indeterminate={isSomeSelected || undefined}
                  onCheckedChange={selectAllRows}
                  className="h-4 w-4"
                />
              </div>
            </th>

            {/* Property columns */}
            {schema.map((property, index) => {
              const propertyType = property.type || 'text'
              const propertyId = property.id || `prop-${index}`
              const Icon = propertyTypeIcons[propertyType] || Type
              const width = columnWidths[propertyId] || 200
              const isMenuOpen = columnMenuOpen === propertyId
              const selectOptions = (property.options?.options || []) as SelectOption[]

              return (
                <th
                  key={propertyId}
                  className={cn(
                    'p-0 text-left font-normal relative',
                    index === 0 && 'sticky left-8 bg-background z-10'
                  )}
                  style={{ width: `${width}px`, minWidth: `${width}px` }}
                >
                  <div className="h-8 px-2 flex items-center gap-2 text-sm text-muted-foreground border-r hover:bg-muted/50 cursor-pointer group">
                    {/* Custom icon or default type icon */}
                    {property.options?.customIcon ? (
                      <span className="text-sm shrink-0">{property.options.customIcon as string}</span>
                    ) : (
                      <Icon className="h-3.5 w-3.5 shrink-0" />
                    )}
                    <span className="truncate">{property.name || t('common:untitled')}</span>
                    <DropdownMenu
                      open={isMenuOpen}
                      onOpenChange={(open) => {
                        if (open) {
                          setColumnMenuOpen(propertyId)
                          setEditingColumnName(property.name || '')
                          setEditingOptionId(null)
                        } else {
                          setColumnMenuOpen(null)
                          setEditingOptionId(null)
                        }
                      }}
                    >
                      <DropdownMenuTrigger asChild>
                        <button className="ml-auto h-5 w-5 flex items-center justify-center rounded opacity-0 group-hover:opacity-100 hover:bg-muted">
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-72 p-0" onClick={(e) => e.stopPropagation()}>
                        {/* Column header with icon picker + name input + info */}
                        <div className="p-3 border-b">
                          <div className="flex items-center gap-2">
                            {/* Icon picker */}
                            <IconPicker
                              value={property.options?.customIcon as IconValue}
                              onChange={(icon) => {
                                onUpdateColumnFormat?.(propertyId, { customIcon: icon || undefined })
                              }}
                            >
                              <button
                                type="button"
                                className="shrink-0 w-8 h-8 flex items-center justify-center rounded-md hover:bg-muted border bg-muted/30 transition-colors"
                                title={t('table.changeIcon')}
                                onClick={(e) => e.stopPropagation()}
                              >
                                {property.options?.customIcon ? (
                                  <DocumentIcon value={property.options.customIcon as IconValue} size="sm" />
                                ) : (
                                  <Icon className="w-4 h-4 text-muted-foreground" />
                                )}
                              </button>
                            </IconPicker>
                            <div className="flex-1 flex items-center gap-1 px-2 py-1.5 rounded-md border bg-muted/30">
                              <Input
                                value={editingColumnName}
                                onChange={(e) => setEditingColumnName(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && onRenameColumn) {
                                    onRenameColumn(propertyId, editingColumnName)
                                    setColumnMenuOpen(null)
                                  }
                                  if (e.key === 'Escape') {
                                    setColumnMenuOpen(null)
                                  }
                                }}
                                onBlur={() => {
                                  if (onRenameColumn && editingColumnName !== property.name) {
                                    onRenameColumn(propertyId, editingColumnName)
                                  }
                                }}
                                className="h-5 border-0 bg-transparent p-0 text-sm font-medium focus-visible:ring-0"
                                autoFocus
                              />
                            </div>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    type="button"
                                    className="shrink-0 w-8 h-8 flex items-center justify-center rounded-md hover:bg-muted transition-colors"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Info className="w-4 h-4 text-muted-foreground" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent side="right" className="max-w-xs">
                                  <p className="text-xs">
                                    <span className="font-medium">{t('table.type')}:</span> {propertyType}
                                  </p>
                                  {typeof property.options?.description === 'string' && property.options.description && (
                                    <p className="text-xs mt-1">{property.options.description}</p>
                                  )}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          {/* Property type label */}
                          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                            <Icon className="w-3.5 h-3.5" />
                            <span className="capitalize">{propertyType.replace(/_/g, ' ')}</span>
                          </div>
                        </div>

                        {/* Toggle options */}
                        {(propertyType === 'text' || propertyType === 'title') && (
                          <div className="px-3 py-2 border-b">
                            <div
                              className="flex items-center justify-between py-1 cursor-pointer"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                const currentWrapText = property.options?.wrapText === true
                                onToggleWrapText?.(propertyId, !currentWrapText)
                              }}
                            >
                              <div className="flex items-center gap-2">
                                <WrapText className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">{t('table.wrapText')}</span>
                              </div>
                              <Switch
                                checked={property.options?.wrapText === true}
                                onCheckedChange={(checked) => {
                                  onToggleWrapText?.(propertyId, checked)
                                }}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                          </div>
                        )}

                        {/* Sort & Filter section */}
                        <div className="py-1">
                          <DropdownMenuItem
                            className="gap-2 mx-1"
                            onClick={() => {
                              onFilterColumn?.(propertyId)
                              setColumnMenuOpen(null)
                            }}
                          >
                            <Filter className="w-4 h-4" />
                            <span className="flex-1">{t('table.filter')}</span>
                          </DropdownMenuItem>
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="gap-2 mx-1">
                              <ArrowUpDown className="w-4 h-4" />
                              <span>{t('table.sort')}</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem
                                className="gap-2"
                                onClick={() => {
                                  onSortColumn?.(propertyId, 'asc')
                                  setColumnMenuOpen(null)
                                }}
                              >
                                <ArrowUpFromLine className="w-4 h-4" />
                                {t('table.ascending')}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="gap-2"
                                onClick={() => {
                                  onSortColumn?.(propertyId, 'desc')
                                  setColumnMenuOpen(null)
                                }}
                              >
                                <ArrowDownFromLine className="w-4 h-4" />
                                {t('table.descending')}
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuSub>
                        </div>

                        <DropdownMenuSeparator className="my-0" />

                        {/* Edit options for select/multi_select/status */}
                        {(propertyType === 'select' || propertyType === 'multi_select' || propertyType === 'status') && (
                          <div className="py-1">
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger className="gap-2 mx-1">
                                <Edit3 className="w-4 h-4" />
                                <span>{t('table.editOptions')}</span>
                              </DropdownMenuSubTrigger>
                              <DropdownMenuSubContent className="w-64 p-2">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t('table.options')}</span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      const newOption: SelectOption = {
                                        id: `opt-${Date.now()}`,
                                        name: t('table.newOption'),
                                        color: 'default',
                                      }
                                      const newOptions = [...selectOptions, newOption]
                                      onUpdateColumnOptions?.(propertyId, newOptions)
                                    }}
                                    className="p-1 hover:bg-muted rounded-sm transition-colors"
                                    title={t('table.addOption')}
                                  >
                                    <Plus className="w-3.5 h-3.5 text-muted-foreground" />
                                  </button>
                                </div>

                                <div className="space-y-0.5">
                                  {selectOptions.map((option, optionIndex) => {
                                    const colorInfo = selectOptionColors.find(c => c.value === option.color) || selectOptionColors[0]
                                    const isEditing = editingOptionId === option.id
                                    const isDragging = draggingOptionId === option.id
                                    const isDragOver = dragOverOptionId === option.id

                                    return (
                                      <div
                                        key={option.id}
                                        draggable={!isEditing}
                                        onDragStart={(e) => {
                                          e.stopPropagation()
                                          setDraggingOptionId(option.id)
                                          e.dataTransfer.effectAllowed = 'move'
                                        }}
                                        onDragEnd={() => {
                                          setDraggingOptionId(null)
                                          setDragOverOptionId(null)
                                        }}
                                        onDragOver={(e) => {
                                          e.preventDefault()
                                          e.stopPropagation()
                                          if (draggingOptionId && draggingOptionId !== option.id) {
                                            setDragOverOptionId(option.id)
                                          }
                                        }}
                                        onDragLeave={() => {
                                          setDragOverOptionId(null)
                                        }}
                                        onDrop={(e) => {
                                          e.preventDefault()
                                          e.stopPropagation()
                                          if (draggingOptionId && draggingOptionId !== option.id) {
                                            const dragIndex = selectOptions.findIndex(o => o.id === draggingOptionId)
                                            const dropIndex = optionIndex
                                            if (dragIndex !== -1 && dropIndex !== -1) {
                                              const newOptions = [...selectOptions]
                                              const [removed] = newOptions.splice(dragIndex, 1)
                                              newOptions.splice(dropIndex, 0, removed)
                                              onUpdateColumnOptions?.(propertyId, newOptions)
                                            }
                                          }
                                          setDraggingOptionId(null)
                                          setDragOverOptionId(null)
                                        }}
                                        className={cn(
                                          "rounded-sm",
                                          isDragging && "opacity-50",
                                          isDragOver && "ring-2 ring-primary"
                                        )}
                                      >
                                        <div
                                          className="flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-accent cursor-pointer"
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            setEditingOptionId(isEditing ? null : option.id)
                                          }}
                                        >
                                          <GripVertical className="w-3 h-3 text-muted-foreground cursor-grab shrink-0" />
                                          <span className={cn("px-2 py-0.5 rounded text-xs font-medium", colorInfo.bg, colorInfo.text)}>
                                            {option.name || t('table.unnamed')}
                                          </span>
                                          <ChevronRight className={cn("w-3.5 h-3.5 text-muted-foreground ml-auto transition-transform", isEditing && "rotate-90")} />
                                        </div>

                                        {isEditing && (
                                          <div className="ml-5 mt-1 p-2 rounded-md bg-background border" onClick={(e) => e.stopPropagation()}>
                                            <Input
                                              value={option.name}
                                              onChange={(e) => {
                                                const newOptions = selectOptions.map(o =>
                                                  o.id === option.id ? { ...o, name: e.target.value } : o
                                                )
                                                onUpdateColumnOptions?.(propertyId, newOptions)
                                              }}
                                              placeholder={t('table.optionName')}
                                              className="h-7 text-sm mb-2"
                                            />

                                            <div className="mb-2">
                                              <span className="text-xs text-muted-foreground">{t('table.color')}</span>
                                              <div className="grid grid-cols-5 gap-1.5 mt-1.5">
                                                {selectOptionColors.map((color) => (
                                                  <button
                                                    key={color.value}
                                                    onClick={(e) => {
                                                      e.stopPropagation()
                                                      const newOptions = selectOptions.map(o =>
                                                        o.id === option.id ? { ...o, color: color.value } : o
                                                      )
                                                      onUpdateColumnOptions?.(propertyId, newOptions)
                                                    }}
                                                    className={cn(
                                                      "w-6 h-6 rounded-md flex items-center justify-center transition-all",
                                                      color.bg,
                                                      option.color === color.value ? "ring-2 ring-primary ring-offset-2" : "hover:ring-1 hover:ring-muted-foreground/50"
                                                    )}
                                                    title={color.name}
                                                  >
                                                    {option.color === color.value && (
                                                      <span className={cn("text-xs font-bold", color.text)}>✓</span>
                                                    )}
                                                  </button>
                                                ))}
                                              </div>
                                            </div>

                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation()
                                                const newOptions = selectOptions.filter(o => o.id !== option.id)
                                                onUpdateColumnOptions?.(propertyId, newOptions)
                                                setEditingOptionId(null)
                                              }}
                                              className="flex items-center gap-1.5 text-xs text-destructive hover:text-destructive/80 transition-colors"
                                            >
                                              <Trash2 className="w-3 h-3" />
                                              {t('table.deleteOption')}
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    )
                                  })}

                                  {selectOptions.length === 0 && (
                                    <div className="text-xs text-muted-foreground text-center py-3">
                                      {t('table.noOptions')}
                                    </div>
                                  )}
                                </div>
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>
                            <DropdownMenuSeparator className="my-1" />
                          </div>
                        )}

                        {/* Number format editor */}
                        {propertyType === 'number' && (
                          <div className="py-1">
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger className="gap-2 mx-1">
                                <Hash className="w-4 h-4" />
                                <span>{t('table.numberFormat')}</span>
                              </DropdownMenuSubTrigger>
                              <DropdownMenuSubContent className="w-64 p-0">
                                <NumberFormatEditor
                                  currentOptions={property.options?.numberFormat as NumberFormatOptions | undefined}
                                  onUpdate={(options) => {
                                    onUpdateColumnFormat?.(propertyId, { numberFormat: options })
                                  }}
                                />
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>
                            <DropdownMenuSeparator className="my-1" />
                          </div>
                        )}

                        {/* Date format editor */}
                        {propertyType === 'date' && (
                          <div className="py-1">
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger className="gap-2 mx-1">
                                <Calendar className="w-4 h-4" />
                                <span>{t('table.dateFormat')}</span>
                              </DropdownMenuSubTrigger>
                              <DropdownMenuSubContent className="w-64 p-0">
                                <DateFormatEditor
                                  currentOptions={property.options?.dateFormat as DateFormatOptions | undefined}
                                  onUpdate={(options) => {
                                    onUpdateColumnFormat?.(propertyId, { dateFormat: options })
                                  }}
                                />
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>
                            <DropdownMenuSeparator className="my-1" />
                          </div>
                        )}

                        {/* Conditional formatting editor */}
                        {(propertyType === 'number' || propertyType === 'text' || propertyType === 'date' || propertyType === 'checkbox') && (
                          <div className="py-1">
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger className="gap-2 mx-1">
                                <Palette className="w-4 h-4" />
                                <span>{t('table.conditionalFormatting')}</span>
                              </DropdownMenuSubTrigger>
                              <DropdownMenuSubContent className="w-72 p-0">
                                <ConditionalFormatEditor
                                  rules={(property.options?.conditionalRules || []) as ConditionalRule[]}
                                  columnType={propertyType}
                                  onUpdate={(rules) => {
                                    onUpdateColumnFormat?.(propertyId, { conditionalRules: rules })
                                  }}
                                />
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>
                            <DropdownMenuSeparator className="my-1" />
                          </div>
                        )}

                        {/* Insert & Duplicate section */}
                        <div className="py-1">
                          <DropdownMenuItem
                            className="gap-2 mx-1"
                            onClick={() => {
                              onInsertColumn?.(propertyId, 'left')
                              setColumnMenuOpen(null)
                            }}
                          >
                            <ChevronLeft className="w-4 h-4" />
                            <span className="flex-1">{t('table.insertLeft')}</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="gap-2 mx-1"
                            onClick={() => {
                              onInsertColumn?.(propertyId, 'right')
                              setColumnMenuOpen(null)
                            }}
                          >
                            <ChevronRight className="w-4 h-4" />
                            <span className="flex-1">{t('table.insertRight')}</span>
                          </DropdownMenuItem>
                          {propertyType !== 'title' && (
                            <DropdownMenuItem
                              className="gap-2 mx-1"
                              onClick={() => {
                                onDuplicateColumn?.(propertyId)
                                setColumnMenuOpen(null)
                              }}
                            >
                              <Copy className="w-4 h-4" />
                              <span className="flex-1">{t('table.duplicateProperty')}</span>
                            </DropdownMenuItem>
                          )}
                        </div>

                        <DropdownMenuSeparator className="my-0" />

                        {/* Hide column */}
                        <div className="py-1">
                          <DropdownMenuItem
                            className="gap-2 mx-1"
                            onClick={() => {
                              onHideColumn?.(propertyId)
                              setColumnMenuOpen(null)
                            }}
                          >
                            <EyeOff className="w-4 h-4" />
                            <span className="flex-1">{t('table.hideInView')}</span>
                          </DropdownMenuItem>
                        </div>

                        {/* Delete column (not for title) */}
                        {propertyType !== 'title' && (
                          <>
                            <DropdownMenuSeparator className="my-0" />
                            <div className="py-1">
                              <DropdownMenuItem
                                className="gap-2 mx-1 text-destructive focus:text-destructive focus:bg-destructive/10"
                                onClick={() => {
                                  onDeleteColumn?.(propertyId)
                                  setColumnMenuOpen(null)
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                                <span className="flex-1">{t('table.deleteProperty')}</span>
                              </DropdownMenuItem>
                            </div>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  {/* Resize handle */}
                  <div
                    className={cn(
                      "absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-primary/50 z-20",
                      resizing?.propertyId === propertyId && "bg-primary"
                    )}
                    onMouseDown={(e) => handleResizeStart(e, propertyId)}
                  />
                </th>
              )
            })}

            {/* Add property column */}
            <th className="w-10 p-0">
              <AddPropertyPopover
                open={showAddPropertyPopover}
                onOpenChange={(open) => {
                  setShowAddPropertyPopover(open)
                  if (!open) {
                    onInsertColumnOpenChange?.(false)
                  }
                }}
                onAdd={onAddProperty}
                trigger={
                  <button
                    className="h-8 w-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                    title={t('table.addProperty')}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                }
              />
            </th>

            {/* Filler column to take remaining width */}
            <th className="p-0" />
          </tr>
        </thead>

        {/* Body */}
        <tbody>
<<<<<<< HEAD
          {rows.map((row, rowIndex) => {
            const isSelected = selectedRows.has(row.id)
            const isHovered = hoveredRow === row.id

            return (
              <tr
                key={row.id}
                className={cn(
                  'border-b group/row transition-colors',
                  isSelected && 'bg-primary/5',
                  isHovered && !isSelected && 'bg-muted/30'
                )}
                onMouseEnter={() => setHoveredRow(row.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                {/* Row selector with checkbox and menu */}
                <td className="w-8 p-0 sticky left-0 bg-background z-10">
                  <div className="h-9 flex items-center justify-center group/selector">
                    {/* Checkbox - shown when hovered or selected */}
                    <div className={cn(
                      "absolute",
                      (isHovered || isSelected) ? "opacity-100" : "opacity-0 group-hover/selector:opacity-100"
                    )}>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleRowSelection(row.id, rowIndex)}
                        onClick={(e) => toggleRowSelection(row.id, rowIndex, e as unknown as React.MouseEvent)}
                        className="h-4 w-4"
                      />
                    </div>
                    {/* Menu - shown on hover when checkbox is not visible */}
                    <div className={cn(
                      'h-5 w-5 flex items-center justify-center',
                      isHovered && !isSelected ? 'opacity-100' : 'opacity-0'
                    )}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="h-5 w-5 flex items-center justify-center rounded hover:bg-muted text-muted-foreground">
                            <GripVertical className="h-3.5 w-3.5" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-48">
                          <DropdownMenuItem onClick={() => onOpenDocument(row.id)}>
                            <FileText className="h-4 w-4 mr-2" />
                            {t('table.openDocument')}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => onDeleteRow(row.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            {t('table.deleteDocument')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </td>

                {/* Property cells */}
                {schema.map((property, colIndex) => {
                  const propertyId = property.id || `prop-${colIndex}`
                  const propertyType = property.type || 'text'
                  const isEditing =
                    editingCell?.rowId === row.id &&
                    editingCell?.propertyId === propertyId
                  const isTitle = propertyType === 'title'
                  const width = columnWidths[propertyId] || 200
                  const isFocused = focusedCell?.rowIndex === rowIndex && focusedCell?.colIndex === colIndex
                  const wrapText = property.options?.wrapText === true

                  return (
                    <td
                      key={propertyId}
                      className={cn(
                        'p-0 border-r',
                        colIndex === 0 && 'sticky left-8 bg-background z-10',
                        isFocused && 'ring-2 ring-inset ring-primary'
                      )}
                      style={{ width: `${width}px`, minWidth: `${width}px` }}
                      onClick={() => setFocusedCell({ rowIndex, colIndex })}
                    >
                      <div className="relative group/cell">
                        {isTitle ? (
                          // Title cell - clickable to open document
                          <div
                            className={cn(
                              "px-2 flex items-center gap-2 cursor-pointer hover:bg-muted/50",
                              wrapText ? "min-h-9 py-2" : "h-9",
                              isEditing && "bg-muted/50"
                            )}
                            onClick={() => {
                              if (!isEditing) {
                                onOpenDocument(row.id)
                              }
                            }}
                          >
                            <DocumentIcon value={row.content?.icon} size="sm" />
                            <span className={cn("text-sm", wrapText ? "whitespace-normal break-words" : "truncate")}>
                              {(row.properties[propertyId] as string) || t('common:untitled')}
                            </span>
                            {(isHovered || isSelected) && !isEditing && (
                              <ExternalLink className="h-3 w-3 text-muted-foreground ml-auto shrink-0" />
                            )}
                          </div>
                        ) : (
                          // Other cells - editable inline
                          <div className={cn(wrapText && "min-h-9 [&>div]:h-auto [&>div]:min-h-9 [&>div]:py-2 [&>div>*]:whitespace-normal [&>div>*]:break-words")}>
                            <PropertyCell
                              property={{ ...property, id: propertyId, type: propertyType, name: property.name || t('common:untitled') }}
                              value={row.properties[propertyId]}
                              onChange={(value) =>
                                handleCellChange(row.id, propertyId, value)
                              }
                              isEditing={isEditing}
                              onStartEdit={() =>
                                setEditingCell({ rowId: row.id, propertyId: propertyId })
                              }
                              onEndEdit={() => setEditingCell(null)}
                            />
                          </div>
                        )}
                      </div>
                    </td>
                  )
                })}

                {/* Empty cell for add column */}
                <td className="w-10" />

                {/* Filler cell */}
                <td />
              </tr>
            )
          })}
=======
          {rows.map((row, rowIndex) => (
            <MemoTableRow
              key={row.id}
              row={row}
              rowIndex={rowIndex}
              schema={schema}
              isSelected={selectedRows.has(row.id)}
              isHovered={hoveredRow === row.id}
              editingCell={editingCell}
              focusedCell={focusedCell}
              columnWidths={columnWidths}
              onMouseEnter={setHoveredRow}
              onToggleRowSelection={toggleRowSelection}
              onOpenDocument={onOpenDocument}
              onDeleteRow={onDeleteRow}
              onCellChange={handleCellChange}
              onSetEditingCell={setEditingCell}
              onSetFocusedCell={setFocusedCell}
            />
          ))}
>>>>>>> d4609d4 (feat: add hooks for managing spaces, users, versions, and webhooks)

          {/* Add row button */}
          <tr className="group/addrow">
            <td className="w-8 p-0 sticky left-0 bg-background z-10">
              <div className="h-9 flex items-center justify-center opacity-0 group-hover/addrow:opacity-100">
                <Plus className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            </td>
            <td colSpan={schema.length + 2} className="p-0">
              <button
                className="w-full h-9 px-2 flex items-center gap-2 text-sm text-muted-foreground hover:bg-muted/30 transition-colors"
                onClick={onAddRow}
              >
                <Plus className="h-3.5 w-3.5" />
                <span>{t('table.newDocument')}</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Empty state */}
      {rows.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <FileText className="h-12 w-12 mb-4 opacity-50" />
          <p className="text-sm mb-4">{t('table.noDocuments')}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={onAddRow}
          >
            <Plus className="h-4 w-4 mr-2" />
            {t('table.addFirstDocument')}
          </Button>
        </div>
      )}
    </div>
  )
}
<<<<<<< HEAD
=======

// Extracted table row component to avoid recreating closures for every cell on every render
interface MemoTableRowProps {
  row: RowData
  rowIndex: number
  schema: PropertySchema[]
  isSelected: boolean
  isHovered: boolean
  editingCell: { rowId: string; propertyId: string } | null
  focusedCell: { rowIndex: number; colIndex: number } | null
  columnWidths: Record<string, number>
  onMouseEnter: (rowId: string | null) => void
  onToggleRowSelection: (rowId: string, rowIndex: number, event?: React.MouseEvent) => void
  onOpenDocument: (rowId: string) => void
  onDeleteRow: (rowId: string) => void
  onCellChange: (rowId: string, propertyId: string, value: unknown) => void
  onSetEditingCell: (cell: { rowId: string; propertyId: string } | null) => void
  onSetFocusedCell: (cell: { rowIndex: number; colIndex: number } | null) => void
}

const MemoTableRow = memo(function MemoTableRow({
  row,
  rowIndex,
  schema,
  isSelected,
  isHovered,
  editingCell,
  focusedCell,
  columnWidths,
  onMouseEnter,
  onToggleRowSelection,
  onOpenDocument,
  onDeleteRow,
  onCellChange,
  onSetEditingCell,
  onSetFocusedCell,
}: MemoTableRowProps) {
  const { t } = useTranslation('database')

  const handleMouseEnter = useCallback(() => onMouseEnter(row.id), [onMouseEnter, row.id])
  const handleMouseLeave = useCallback(() => onMouseEnter(null), [onMouseEnter])
  const handleEndEdit = useCallback(() => onSetEditingCell(null), [onSetEditingCell])

  return (
    <tr
      className={cn(
        'border-b group/row transition-colors',
        isSelected && 'bg-primary/5',
        isHovered && !isSelected && 'bg-muted/30'
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Row selector with checkbox and menu */}
      <td className="w-8 p-0 sticky left-0 bg-background z-10">
        <div className="h-9 flex items-center justify-center group/selector">
          <div className={cn(
            "absolute",
            (isHovered || isSelected) ? "opacity-100" : "opacity-0 group-hover/selector:opacity-100"
          )}>
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => onToggleRowSelection(row.id, rowIndex)}
              onClick={(e) => onToggleRowSelection(row.id, rowIndex, e as unknown as React.MouseEvent)}
              className="h-4 w-4"
            />
          </div>
          <div className={cn(
            'h-5 w-5 flex items-center justify-center',
            isHovered && !isSelected ? 'opacity-100' : 'opacity-0'
          )}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-5 w-5 flex items-center justify-center rounded hover:bg-muted text-muted-foreground">
                  <GripVertical className="h-3.5 w-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem onClick={() => onOpenDocument(row.id)}>
                  <FileText className="h-4 w-4 mr-2" />
                  {t('table.openDocument')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => onDeleteRow(row.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t('table.deleteDocument')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </td>

      {/* Property cells */}
      {schema.map((property, colIndex) => {
        const propertyId = property.id || `prop-${colIndex}`
        const propertyType = property.type || 'text'
        const isEditing =
          editingCell?.rowId === row.id &&
          editingCell?.propertyId === propertyId
        const isTitle = propertyType === 'title'
        const width = columnWidths[propertyId] || 200
        const isFocused = focusedCell?.rowIndex === rowIndex && focusedCell?.colIndex === colIndex
        const wrapText = property.options?.wrapText === true

        return (
          <td
            key={propertyId}
            className={cn(
              'p-0 border-r',
              colIndex === 0 && 'sticky left-8 bg-background z-10',
              isFocused && 'ring-2 ring-inset ring-primary'
            )}
            style={{ width: `${width}px`, minWidth: `${width}px` }}
            onClick={() => onSetFocusedCell({ rowIndex, colIndex })}
          >
            <div className="relative group/cell">
              {isTitle ? (
                <div
                  className={cn(
                    "px-2 flex items-center gap-2 cursor-pointer hover:bg-muted/50",
                    wrapText ? "min-h-9 py-2" : "h-9",
                    isEditing && "bg-muted/50"
                  )}
                  onClick={() => {
                    if (!isEditing) {
                      onOpenDocument(row.id)
                    }
                  }}
                >
                  <DocumentIcon value={row.content?.icon} size="sm" />
                  <span className={cn("text-sm", wrapText ? "whitespace-normal break-words" : "truncate")}>
                    {(row.properties[propertyId] as string) || t('common:untitled')}
                  </span>
                  {(isHovered || isSelected) && !isEditing && (
                    <ExternalLink className="h-3 w-3 text-muted-foreground ml-auto shrink-0" />
                  )}
                </div>
              ) : (
                <div className={cn(wrapText && "min-h-9 [&>div]:h-auto [&>div]:min-h-9 [&>div]:py-2 [&>div>*]:whitespace-normal [&>div>*]:break-words")}>
                  <PropertyCell
                    property={{ ...property, id: propertyId, type: propertyType, name: property.name || t('common:untitled') }}
                    value={row.properties[propertyId]}
                    onChange={(value) => onCellChange(row.id, propertyId, value)}
                    isEditing={isEditing}
                    onStartEdit={() => onSetEditingCell({ rowId: row.id, propertyId })}
                    onEndEdit={handleEndEdit}
                  />
                </div>
              )}
            </div>
          </td>
        )
      })}

      {/* Empty cell for add column */}
      <td className="w-10" />

      {/* Filler cell */}
      <td />
    </tr>
  )
})
>>>>>>> d4609d4 (feat: add hooks for managing spaces, users, versions, and webhooks)
