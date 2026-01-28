import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, MoreHorizontal, GripVertical } from 'lucide-react'
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import type { PropertySchema } from '@/hooks/use-database'
import { selectOptionColors, type SelectOption, type SelectOptionColor } from '@/lib/database'
import { DocumentIcon, type IconValue } from '@/components/ui/icon-picker'

interface RowData {
  id: string
  properties: Record<string, unknown>
  content?: { icon?: IconValue; blocks?: unknown }
}

interface DocumentBoardViewProps {
  schema: PropertySchema[]
  rows: RowData[]
  groupByColumnId?: string
  onUpdateRow: (rowId: string, properties: Record<string, unknown>) => void
  onDeleteRow: (rowId: string) => void
  onAddRow: () => void
  onOpenDocument: (rowId: string) => void
  isLoading?: boolean
}

export function DocumentBoardView({
  schema,
  rows,
  groupByColumnId: propGroupByColumnId,
  onUpdateRow,
  onDeleteRow,
  onAddRow,
  onOpenDocument,
}: DocumentBoardViewProps) {
  const { t } = useTranslation('database')
  const [activeId, setActiveId] = useState<string | null>(null)

  // Configure sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required before drag starts
      },
    })
  )

  // Find select/status columns that can be used for grouping
  const groupableColumns = useMemo(() => {
    return schema.filter(col => col.id && (col.type === 'select' || col.type === 'status'))
  }, [schema])

  // Determine the effective groupByColumnId (from prop or default)
  const groupByColumnId = useMemo(() => {
    if (propGroupByColumnId && groupableColumns.some(c => c.id === propGroupByColumnId)) {
      return propGroupByColumnId
    }
    const statusCol = groupableColumns.find(c => c.type === 'status')
    return statusCol?.id || groupableColumns[0]?.id || null
  }, [propGroupByColumnId, groupableColumns])

  // Get the grouping column
  const groupByColumn = useMemo(() => {
    return schema.find(col => col.id === groupByColumnId)
  }, [schema, groupByColumnId])

  // Get title column for displaying card titles
  const titleColumn = useMemo(() => {
    return schema.find(col => col.type === 'title') || schema[0]
  }, [schema])

  // Get options for the grouping column
  const groupOptions: SelectOption[] = useMemo(() => {
    if (!groupByColumn?.options) return []
    const opts = (groupByColumn.options as { options?: SelectOption[] })?.options
    if (Array.isArray(opts)) return opts
    if (Array.isArray(groupByColumn.options)) return groupByColumn.options as SelectOption[]
    return []
  }, [groupByColumn])

  // Group rows by the selected column value
  const groupedRows = useMemo(() => {
    const groups: Record<string, RowData[]> = {}

    groupOptions.forEach(option => {
      groups[option.id] = []
    })

    groups['__none__'] = []

    rows.forEach(row => {
      const value = groupByColumnId ? (row.properties[groupByColumnId] as string | undefined) : undefined
      if (value) {
        const matchingOption = groupOptions.find(opt => opt.id === value || opt.name === value)
        if (matchingOption) {
          groups[matchingOption.id].push(row)
        } else {
          groups['__none__'].push(row)
        }
      } else {
        groups['__none__'].push(row)
      }
    })

    return groups
  }, [rows, groupByColumnId, groupOptions])

  // Get the active row being dragged
  const activeRow = useMemo(() => {
    if (!activeId) return null
    return rows.find(row => row.id === activeId)
  }, [activeId, rows])

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  // Handle drag end - move card to new column
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over || !groupByColumnId) return

    const rowId = active.id as string
    const targetColumnId = over.id as string

    // Find the current column of the dragged item
    const currentColumn = Object.entries(groupedRows).find(([, columnRows]) =>
      columnRows.some(row => row.id === rowId)
    )?.[0]

    // Only update if dropped on a different column
    if (currentColumn !== targetColumnId) {
      onUpdateRow(rowId, {
        [groupByColumnId]: targetColumnId === '__none__' ? null : targetColumnId,
      })
    }
  }

  // Handle adding a new row to a specific column
  const handleAddToColumn = (_groupValue: string) => {
    onAddRow()
  }

  if (!groupableColumns.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <p className="text-sm">{t('board.boardRequiresSelect')}</p>
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col h-full">
        {/* Board columns */}
        <div className="flex-1 overflow-x-auto">
          <div className="flex gap-3 px-4 h-full min-h-0">
            {groupOptions.map(option => {
              const colorConfig = selectOptionColors.find(c => c.value === option.color) || selectOptionColors[0]
              const columnRows = groupedRows[option.id] || []

              return (
                <BoardColumn
                  key={option.id}
                  id={option.id}
                  title={option.name}
                  colorConfig={colorConfig}
                  rows={columnRows}
                  titleColumn={titleColumn}
                  onOpenDocument={onOpenDocument}
                  onDeleteRow={onDeleteRow}
                  onAddToColumn={handleAddToColumn}
                />
              )
            })}

            {/* "No status" column if there are ungrouped rows */}
            {groupedRows['__none__']?.length > 0 && (
              <BoardColumn
                id="__none__"
                title={t('board.noStatus')}
                colorConfig={selectOptionColors.find(c => c.value === 'gray') || selectOptionColors[0]}
                rows={groupedRows['__none__']}
                titleColumn={titleColumn}
                onOpenDocument={onOpenDocument}
                onDeleteRow={onDeleteRow}
                onAddToColumn={handleAddToColumn}
              />
            )}
          </div>
        </div>
      </div>

      {/* Drag overlay - shows the card being dragged */}
      <DragOverlay>
        {activeRow && (
          <div className="bg-background rounded-md border shadow-lg px-3 py-2 w-64 opacity-90">
            <div className="flex items-center gap-2">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
              <DocumentIcon value={activeRow.content?.icon} size="sm" />
              <span className="text-sm truncate">
                {titleColumn?.id ? (activeRow.properties[titleColumn.id] as string) || t('common:untitled') : t('common:untitled')}
              </span>
            </div>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}

interface BoardColumnProps {
  id: string
  title: string
  colorConfig: SelectOptionColor
  rows: RowData[]
  titleColumn: PropertySchema | undefined
  onOpenDocument: (rowId: string) => void
  onDeleteRow: (rowId: string) => void
  onAddToColumn: (groupValue: string) => void
}

function BoardColumn({
  id,
  title,
  colorConfig,
  rows,
  titleColumn,
  onOpenDocument,
  onDeleteRow,
  onAddToColumn,
}: BoardColumnProps) {
  const { t } = useTranslation('database')
  const { setNodeRef, isOver } = useDroppable({
    id,
  })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex flex-col w-72 shrink-0 rounded-lg transition-colors",
        isOver && "ring-2 ring-primary ring-offset-2"
      )}
      style={{
        border: `1px solid ${colorConfig.hex}40`,
        backgroundColor: `${colorConfig.hex}15`,
      }}
    >
      {/* Column header */}
      <div className="flex items-center gap-2 px-3 py-2.5">
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ backgroundColor: colorConfig.textHex }}
        />
        <span
          className="text-sm font-medium"
          style={{ color: colorConfig.textHex }}
        >
          {title}
        </span>
        <span className="text-sm text-muted-foreground ml-1">
          {rows.length}
        </span>
      </div>

      {/* Cards container */}
      <div className="flex-1 px-2 pb-2 space-y-2 overflow-y-auto overflow-x-hidden min-h-[100px]">
        {rows.map(row => (
          <BoardCard
            key={row.id}
            row={row}
            titleColumn={titleColumn}
            onOpenDocument={onOpenDocument}
            onDeleteRow={onDeleteRow}
          />
        ))}
      </div>

      {/* Add new page button */}
      <button
        onClick={() => onAddToColumn(id)}
        className="flex items-center gap-2 px-3 py-2 mx-2 mb-2 rounded-md text-sm transition-colors hover:bg-background/50"
        style={{ color: colorConfig.textHex }}
      >
        <Plus className="h-4 w-4" />
        <span>{t('board.newPage')}</span>
      </button>
    </div>
  )
}

interface BoardCardProps {
  row: RowData
  titleColumn: PropertySchema | undefined
  onOpenDocument: (rowId: string) => void
  onDeleteRow: (rowId: string) => void
}

function BoardCard({
  row,
  titleColumn,
  onOpenDocument,
  onDeleteRow,
}: BoardCardProps) {
  const { t } = useTranslation('database')
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: row.id,
  })

  const title = titleColumn?.id ? (row.properties[titleColumn.id] as string) || t('common:untitled') : t('common:untitled')
  const icon = row.content?.icon

  const style: React.CSSProperties | undefined = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined

  // Hide the original element while dragging to prevent scrollbar issues
  if (isDragging && style) {
    style.opacity = 0
    style.pointerEvents = 'none'
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group bg-background rounded-md border shadow-sm px-3 py-2 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => !isDragging && onOpenDocument(row.id)}
    >
      <div className="flex items-center justify-between gap-2">
        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing touch-none"
          onClick={e => e.stopPropagation()}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <DocumentIcon value={icon} size="sm" />
        <span className="text-sm truncate flex-1">{title}</span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={e => e.stopPropagation()}>
            <DropdownMenuItem
              className="text-destructive"
              onSelect={() => onDeleteRow(row.id)}
            >
              {t('board.delete')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
