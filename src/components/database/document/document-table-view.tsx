import { useState, useCallback } from 'react'
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
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { PropertyCell } from '../common/property-cell'
import { AddPropertyPopover } from '../common/add-property-popover'
import type { PropertySchema } from '@/hooks/use-database'

interface RowData {
  id: string
  properties: Record<string, unknown>
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
}

export function DocumentTableView({
  schema,
  rows,
  onUpdateRow,
  onDeleteRow,
  onAddRow,
  onAddProperty,
  onOpenDocument,
  isLoading = false,
}: DocumentTableViewProps) {
  const [editingCell, setEditingCell] = useState<{ rowId: string; propertyId: string } | null>(null)
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)
  const [showAddPropertyPopover, setShowAddPropertyPopover] = useState(false)

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

  // TODO: Use for multi-row selection
  const _toggleRowSelection = (rowId: string) => {
    setSelectedRows((prev) => {
      const next = new Set(prev)
      if (next.has(rowId)) {
        next.delete(rowId)
      } else {
        next.add(rowId)
      }
      return next
    })
  }
  void _toggleRowSelection

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
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse min-w-max">
        {/* Header */}
        <thead>
          <tr className="border-b">
            {/* Row selector column */}
            <th className="w-8 p-0 sticky left-0 bg-background z-10">
              <div className="h-8 flex items-center justify-center" />
            </th>

            {/* Property columns */}
            {schema.map((property, index) => {
              const propertyType = property.type || 'text'
              const propertyId = property.id || `prop-${index}`
              const Icon = propertyTypeIcons[propertyType] || Type
              const isTitle = propertyType === 'title'
              return (
                <th
                  key={propertyId}
                  className={cn(
                    'p-0 text-left font-normal',
                    isTitle ? 'min-w-[280px]' : 'min-w-[200px]',
                    index === 0 && 'sticky left-8 bg-background z-10'
                  )}
                >
                  <div className="h-8 px-2 flex items-center gap-2 text-sm text-muted-foreground border-r hover:bg-muted/50 cursor-pointer group">
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{property.name || 'Untitled'}</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="ml-auto h-5 w-5 flex items-center justify-center rounded opacity-0 group-hover:opacity-100 hover:bg-muted">
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-48">
                        <DropdownMenuItem>Edit property</DropdownMenuItem>
                        <DropdownMenuItem>Sort ascending</DropdownMenuItem>
                        <DropdownMenuItem>Sort descending</DropdownMenuItem>
                        <DropdownMenuItem>Filter</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Hide in view</DropdownMenuItem>
                        {propertyType !== 'title' && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                              Delete property
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </th>
              )
            })}

            {/* Add property column */}
            <th className="w-10 p-0">
              <AddPropertyPopover
                open={showAddPropertyPopover}
                onOpenChange={setShowAddPropertyPopover}
                onAdd={onAddProperty}
                trigger={
                  <button
                    className="h-8 w-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                    title="Add property"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                }
              />
            </th>
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {rows.map((row) => {
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
                {/* Row actions */}
                <td className="w-8 p-0 sticky left-0 bg-background z-10">
                  <div className="h-9 flex items-center justify-center">
                    <div
                      className={cn(
                        'h-5 w-5 flex items-center justify-center',
                        isHovered || isSelected ? 'opacity-100' : 'opacity-0'
                      )}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="h-5 w-5 flex items-center justify-center rounded hover:bg-muted text-muted-foreground">
                            <GripVertical className="h-3.5 w-3.5" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-48">
                          <DropdownMenuItem onClick={() => onOpenDocument(row.id)}>
                            <FileText className="h-4 w-4 mr-2" />
                            Open document
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => onDeleteRow(row.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete document
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

                  return (
                    <td
                      key={propertyId}
                      className={cn(
                        'p-0 border-r',
                        isTitle ? 'min-w-[280px]' : 'min-w-[200px]',
                        colIndex === 0 && 'sticky left-8 bg-background z-10'
                      )}
                    >
                      <div className="relative group/cell">
                        {isTitle ? (
                          // Title cell - clickable to open document
                          <div
                            className={cn(
                              "h-9 px-2 flex items-center gap-2 cursor-pointer hover:bg-muted/50",
                              isEditing && "bg-muted/50"
                            )}
                            onClick={() => {
                              if (!isEditing) {
                                onOpenDocument(row.id)
                              }
                            }}
                          >
                            <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span className="truncate text-sm">
                              {(row.properties[propertyId] as string) || 'Untitled'}
                            </span>
                            {(isHovered || isSelected) && !isEditing && (
                              <ExternalLink className="h-3 w-3 text-muted-foreground ml-auto shrink-0" />
                            )}
                          </div>
                        ) : (
                          // Other cells - editable inline
                          <PropertyCell
                            property={{ ...property, id: propertyId, type: propertyType, name: property.name || 'Untitled' }}
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
                        )}
                      </div>
                    </td>
                  )
                })}

                {/* Empty cell for add column */}
                <td className="w-10" />
              </tr>
            )
          })}

          {/* Add row button */}
          <tr className="group/addrow">
            <td className="w-8 p-0 sticky left-0 bg-background z-10">
              <div className="h-9 flex items-center justify-center opacity-0 group-hover/addrow:opacity-100">
                <Plus className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            </td>
            <td colSpan={schema.length + 1} className="p-0">
              <button
                className="w-full h-9 px-2 flex items-center gap-2 text-sm text-muted-foreground hover:bg-muted/30 transition-colors"
                onClick={onAddRow}
              >
                <Plus className="h-3.5 w-3.5" />
                <span>New document</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Empty state */}
      {rows.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <FileText className="h-12 w-12 mb-4 opacity-50" />
          <p className="text-sm mb-4">No documents yet</p>
          <Button
            variant="outline"
            size="sm"
            onClick={onAddRow}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add first document
          </Button>
        </div>
      )}
    </div>
  )
}
