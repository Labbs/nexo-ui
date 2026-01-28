import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Table2, MoreHorizontal, Pencil, Trash2, Copy, Filter, ArrowUpDown, Columns3, Eye, EyeOff, List, LayoutGrid, Kanban, ArrowRightLeft, Layers } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
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

// viewTypes is now inside the component to use t()

// Get icon for view type
function getViewIcon(type: string): LucideIcon {
  const viewTypeMap: Record<string, LucideIcon> = {
    table: Table2,
    list: List,
    gallery: LayoutGrid,
    board: Kanban,
  }
  return viewTypeMap[type] || Table2
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
  onChangeViewType: (viewId: string, type: string) => void
  onDuplicateView: (viewId: string) => void
  onDeleteView: (viewId: string) => void
  onFilterChange: (filter: FilterConfig | undefined) => void
  onSortChange: (sort: SortConfig[]) => void
  onGroupByChange?: (columnId: string) => void
  onShowColumn: (columnId: string) => void
  onHideColumn: (columnId: string) => void
  onShowAllColumns: () => void
  canDeleteView: boolean
  externalFilterOpen?: boolean
  onExternalFilterOpenChange?: (open: boolean) => void
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
  onChangeViewType,
  onDuplicateView,
  onDeleteView,
  onFilterChange,
  onSortChange,
  onGroupByChange,
  onShowColumn,
  onHideColumn,
  onShowAllColumns,
  canDeleteView,
  externalFilterOpen,
  onExternalFilterOpenChange,
}: ViewTabsProps) {
  const { t } = useTranslation('database')
  const [showRenameDialog, setShowRenameDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [editingViewId, setEditingViewId] = useState<string | null>(null)
  const [newName, setNewName] = useState('')
  const [columnsOpen, setColumnsOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)
  const [groupByOpen, setGroupByOpen] = useState(false)

  const viewTypes: ViewTypeOption[] = [
    { type: 'table', label: t('views.table'), icon: Table2 },
    { type: 'list', label: t('views.list'), icon: List },
    { type: 'gallery', label: t('views.gallery'), icon: LayoutGrid },
    { type: 'board', label: t('views.board'), icon: Kanban },
  ]

  // Get groupable columns (select/status) for board view
  const groupableColumns = useMemo(() => {
    return allColumns.filter(col => col.id && (col.type === 'select' || col.type === 'status'))
  }, [allColumns])

  // Get current group by column
  const currentGroupByColumn = useMemo(() => {
    if (!activeView?.groupBy) return null
    return allColumns.find(col => col.id === activeView.groupBy)
  }, [activeView?.groupBy, allColumns])

  // Sync external filter open state
  useEffect(() => {
    if (externalFilterOpen !== undefined) {
      setFilterOpen(externalFilterOpen)
    }
  }, [externalFilterOpen])
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
                    {t('views.rename')}
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <ArrowRightLeft className="h-4 w-4 mr-2" />
                      {t('views.changeType')}
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      {viewTypes.map((viewType) => {
                        const Icon = viewType.icon
                        const isCurrentType = view.type === viewType.type
                        return (
                          <DropdownMenuItem
                            key={viewType.type}
                            onClick={() => onChangeViewType(view.id, viewType.type)}
                            disabled={isCurrentType}
                            className={cn(isCurrentType && 'opacity-50')}
                          >
                            <Icon className="h-4 w-4 mr-2" />
                            {viewType.label}
                          </DropdownMenuItem>
                        )
                      })}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                  <DropdownMenuItem onClick={() => onDuplicateView(view.id)}>
                    <Copy className="h-4 w-4 mr-2" />
                    {t('views.duplicate')}
                  </DropdownMenuItem>
                  {canDeleteView && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDelete(view.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {t('common:delete')}
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
                {t('views.addNewView')}
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
          <Popover open={filterOpen} onOpenChange={(open) => {
            setFilterOpen(open)
            if (!open) {
              onExternalFilterOpenChange?.(false)
            }
          }}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-muted-foreground hover:text-foreground"
              >
                <Filter className="h-4 w-4 mr-1.5" />
                {t('views.filter')}
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
                  <h4 className="font-medium text-sm">{t('views.filters')}</h4>
                  {filterCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-muted-foreground"
                      onClick={handleClearFilters}
                    >
                      {t('views.clearAll')}
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
                {t('views.sort')}
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
                  <h4 className="font-medium text-sm">{t('views.sort')}</h4>
                  {sortCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-muted-foreground"
                      onClick={handleClearSort}
                    >
                      {t('views.clearAll')}
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

          {/* Group By button - only for board views */}
          {activeView?.type === 'board' && groupableColumns.length > 0 && (
            <Popover open={groupByOpen} onOpenChange={setGroupByOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-muted-foreground hover:text-foreground"
                >
                  <Layers className="h-4 w-4 mr-1.5" />
                  {t('views.group')}
                  {currentGroupByColumn && (
                    <Badge variant="secondary" className="ml-1.5 h-5 px-1.5 text-xs">
                      {currentGroupByColumn.name}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-0" align="end">
                <div className="p-4">
                  <h4 className="font-medium text-sm mb-3">{t('views.groupBy')}</h4>
                  <div className="space-y-1">
                    {groupableColumns.map((col) => {
                      const isSelected = activeView?.groupBy === col.id
                      return (
                        <div
                          key={col.id}
                          className={cn(
                            'flex items-center justify-between py-1.5 px-2 rounded cursor-pointer transition-colors',
                            isSelected ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                          )}
                          onClick={() => {
                            if (col.id && onGroupByChange) {
                              onGroupByChange(col.id)
                            }
                            setGroupByOpen(false)
                          }}
                        >
                          <span className="text-sm">{col.name}</span>
                          <span className="text-xs text-muted-foreground capitalize">{col.type}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}

          {/* Columns button */}
          <Popover open={columnsOpen} onOpenChange={setColumnsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-muted-foreground hover:text-foreground"
              >
                <Columns3 className="h-4 w-4 mr-1.5" />
                {t('views.columns')}
                {hiddenCount > 0 && (
                  <Badge variant="secondary" className="ml-1.5 h-5 px-1.5 text-xs">
                    {t('views.hiddenCount', { count: hiddenCount })}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0" align="end">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-sm">{t('views.columns')}</h4>
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
                      {t('views.showAll')}
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
            <DialogTitle>{t('views.renameView')}</DialogTitle>
          </DialogHeader>
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={t('views.viewName')}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleConfirmRename()
              }
            }}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRenameDialog(false)}>
              {t('common:cancel')}
            </Button>
            <Button onClick={handleConfirmRename}>{t('common:save')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('views.deleteView')}</DialogTitle>
            <DialogDescription>
              {t('views.deleteViewConfirm')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              {t('common:cancel')}
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              {t('common:delete')}
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
