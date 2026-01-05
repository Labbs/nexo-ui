import { useState } from 'react'
import { Plus, Table2, MoreHorizontal, Pencil, Trash2, Copy, Filter, ArrowUpDown, Columns3, Eye, EyeOff, List, LayoutGrid, Kanban } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { FilterBuilder } from './filter-builder'
import { SortBuilder } from './sort-builder'
import type { ViewConfig, FilterConfig, SortConfig, PropertySchema } from '@/hooks/use-database'

// View type definitions
type ViewType = 'table' | 'list' | 'gallery' | 'board'

interface ViewTypeOption {
  type: ViewType
  label: string
  icon: LucideIcon
}

const viewTypes: ViewTypeOption[] = [
  { type: 'table', label: 'Table', icon: Table2 },
  { type: 'list', label: 'List', icon: List },
  { type: 'gallery', label: 'Gallery', icon: LayoutGrid },
  { type: 'board', label: 'Board', icon: Kanban },
]

// Get icon for view type
function getViewIcon(type: string): LucideIcon {
  const viewType = viewTypes.find(v => v.type === type)
  return viewType?.icon || Table2
}

interface ViewTabsProps {
  views: ViewConfig[]
  activeViewId: string
  activeView: ViewConfig | undefined
  columns: PropertySchema[]
  allColumns: PropertySchema[]
  hiddenColumnIds: Set<string>
  onViewChange: (viewId: string) => void
  onCreateView: (name: string, type?: string) => void
  onRenameView: (viewId: string, name: string) => void
  onDuplicateView: (viewId: string) => void
  onDeleteView: (viewId: string) => void
  onFilterChange: (filter: FilterConfig | undefined) => void
  onSortChange: (sort: SortConfig[]) => void
  onShowColumn: (columnId: string) => void
  onHideColumn: (columnId: string) => void
  onShowAllColumns: () => void
  canDeleteView: boolean
}

export function ViewTabs({
  views,
  activeViewId,
  activeView,
  columns,
  allColumns,
  hiddenColumnIds,
  onViewChange,
  onCreateView,
  onRenameView,
  onDuplicateView,
  onDeleteView,
  onFilterChange,
  onSortChange,
  onShowColumn,
  onHideColumn,
  onShowAllColumns,
  canDeleteView,
}: ViewTabsProps) {
  const [showRenameDialog, setShowRenameDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [editingViewId, setEditingViewId] = useState<string | null>(null)
  const [newName, setNewName] = useState('')
  const [columnsOpen, setColumnsOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)
  const [addViewOpen, setAddViewOpen] = useState(false)

  // Count active filters
  const filterCount = countActiveFilters(activeView?.filter)
  const sortCount = activeView?.sort?.length || 0
  const hiddenCount = hiddenColumnIds.size

  const handleRename = (viewId: string, currentName: string) => {
    setEditingViewId(viewId)
    setNewName(currentName)
    setShowRenameDialog(true)
  }

  const handleConfirmRename = () => {
    if (editingViewId && newName.trim()) {
      onRenameView(editingViewId, newName.trim())
    }
    setShowRenameDialog(false)
    setEditingViewId(null)
    setNewName('')
  }

  const handleDelete = (viewId: string) => {
    setEditingViewId(viewId)
    setShowDeleteDialog(true)
  }

  const handleConfirmDelete = () => {
    if (editingViewId) {
      onDeleteView(editingViewId)
    }
    setShowDeleteDialog(false)
    setEditingViewId(null)
  }

  const handleAddView = (type: ViewType) => {
    const viewNumber = views.length + 1
    const typeName = viewTypes.find(v => v.type === type)?.label || 'View'
    onCreateView(`${typeName} ${viewNumber}`, type)
    setAddViewOpen(false)
  }

  const handleClearFilters = () => {
    onFilterChange(undefined)
    setFilterOpen(false)
  }

  const handleClearSort = () => {
    onSortChange([])
    setSortOpen(false)
  }

  return (
    <>
      <div className="flex items-center gap-0.5 px-4 py-1">
        {/* View tabs on the left */}
        <div className="flex items-center gap-0.5">
          {views.map((view) => {
            const ViewIcon = getViewIcon(view.type)
            return (
            <div
              key={view.id}
              className={cn(
                'group flex items-center gap-1.5 px-3 py-1.5 text-sm cursor-pointer rounded-md transition-colors',
                activeViewId === view.id
                  ? 'bg-primary/10 text-primary font-medium border border-primary/30'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
              onClick={() => onViewChange(view.id)}
            >
              <ViewIcon className="h-4 w-4" />
              <span>{view.name}</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      'h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity',
                      activeViewId === view.id && 'opacity-100'
                    )}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => handleRename(view.id, view.name)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDuplicateView(view.id)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                  {canDeleteView && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDelete(view.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )})}
          <Popover open={addViewOpen} onOpenChange={setAddViewOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-muted-foreground hover:text-foreground"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2" align="start">
              <div className="text-xs font-medium text-muted-foreground px-2 py-1.5 mb-1">
                Add a new view
              </div>
              <div className="grid grid-cols-2 gap-1">
                {viewTypes.map((viewType) => {
                  const Icon = viewType.icon
                  return (
                    <button
                      key={viewType.type}
                      onClick={() => handleAddView(viewType.type)}
                      className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                    >
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span>{viewType.label}</span>
                    </button>
                  )
                })}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Filter and Sort on the right */}
        <div className="flex items-center gap-1">
          {/* Filter button */}
          <Popover open={filterOpen} onOpenChange={setFilterOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-muted-foreground hover:text-foreground"
              >
                <Filter className="h-4 w-4 mr-1.5" />
                Filter
                {filterCount > 0 && (
                  <Badge variant="secondary" className="ml-1.5 h-5 px-1.5 text-xs">
                    {filterCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-0" align="end">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-sm">Filters</h4>
                  {filterCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-muted-foreground"
                      onClick={handleClearFilters}
                    >
                      Clear all
                    </Button>
                  )}
                </div>
                <FilterBuilder
                  columns={columns}
                  filter={parseFilterConfig(activeView?.filter)}
                  onChange={onFilterChange}
                />
              </div>
            </PopoverContent>
          </Popover>

          {/* Sort button */}
          <Popover open={sortOpen} onOpenChange={setSortOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-muted-foreground hover:text-foreground"
              >
                <ArrowUpDown className="h-4 w-4 mr-1.5" />
                Sort
                {sortCount > 0 && (
                  <Badge variant="secondary" className="ml-1.5 h-5 px-1.5 text-xs">
                    {sortCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-sm">Sort</h4>
                  {sortCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-muted-foreground"
                      onClick={handleClearSort}
                    >
                      Clear all
                    </Button>
                  )}
                </div>
                <SortBuilder
                  columns={columns}
                  sort={activeView?.sort || []}
                  onChange={onSortChange}
                />
              </div>
            </PopoverContent>
          </Popover>

          {/* Columns button */}
          <Popover open={columnsOpen} onOpenChange={setColumnsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-muted-foreground hover:text-foreground"
              >
                <Columns3 className="h-4 w-4 mr-1.5" />
                Columns
                {hiddenCount > 0 && (
                  <Badge variant="secondary" className="ml-1.5 h-5 px-1.5 text-xs">
                    {hiddenCount} hidden
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0" align="end">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-sm">Columns</h4>
                  {hiddenCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-muted-foreground"
                      onClick={() => {
                        onShowAllColumns()
                        setColumnsOpen(false)
                      }}
                    >
                      Show all
                    </Button>
                  )}
                </div>
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {allColumns.map((col) => {
                    const isHidden = hiddenColumnIds.has(col.id || '')
                    return (
                      <div
                        key={col.id}
                        className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-muted cursor-pointer"
                        onClick={() => {
                          if (col.id) {
                            if (isHidden) {
                              onShowColumn(col.id)
                            } else {
                              onHideColumn(col.id)
                            }
                          }
                        }}
                      >
                        <span className={cn("text-sm", isHidden && "text-muted-foreground")}>
                          {col.name}
                        </span>
                        {isHidden ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Rename Dialog */}
      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rename view</DialogTitle>
          </DialogHeader>
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="View name"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleConfirmRename()
              }
            }}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRenameDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmRename}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete view</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this view? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function countActiveFilters(filter: Record<string, unknown> | undefined): number {
  if (!filter) return 0
  let count = 0
  if (Array.isArray(filter.and) && filter.and.length > 0) {
    count += filter.and.length
  }
  if (Array.isArray(filter.or) && filter.or.length > 0) {
    count += filter.or.length
  }
  return count
}

function parseFilterConfig(filter: Record<string, unknown> | undefined): FilterConfig | undefined {
  if (!filter) return undefined
  return {
    and: (filter.and as FilterConfig['and']) || [],
    or: (filter.or as FilterConfig['or']) || [],
  }
}
