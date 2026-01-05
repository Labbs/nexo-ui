import { useState } from 'react'
import {
  MoreHorizontal,
  Settings,
  Trash2,
  Plus,
  Filter,
  ArrowUpDown,
  Table,
  LayoutGrid,
  Calendar,
  List,
  Search,
  Settings2,
  Eye,
  Paintbrush,
  Link2,
  Lock,
  Database,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import type { DatabaseDetail } from '@/hooks/use-databases'

interface DatabaseHeaderProps {
  database: DatabaseDetail
  onUpdateName: (name: string) => void
  onUpdateIcon: (icon: string) => void
  onDelete: () => void
  onAddProperty: () => void
  viewType?: 'table' | 'board' | 'calendar' | 'gallery' | 'list'
  onViewChange?: (view: 'table' | 'board' | 'calendar' | 'gallery' | 'list') => void
}

export function DatabaseHeader({
  database,
  onUpdateName,
  onUpdateIcon,
  onDelete,
  onAddProperty,
  viewType = 'table',
  onViewChange,
}: DatabaseHeaderProps) {
  const [isEditingName, setIsEditingName] = useState(false)
  const [editedName, setEditedName] = useState(database.name)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showViewSettings, setShowViewSettings] = useState(false)

  const handleNameSubmit = () => {
    if (editedName.trim() && editedName !== database.name) {
      onUpdateName(editedName.trim())
    }
    setIsEditingName(false)
  }

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSubmit()
    } else if (e.key === 'Escape') {
      setEditedName(database.name)
      setIsEditingName(false)
    }
  }

  const views = [
    { id: 'table' as const, icon: Table, label: 'Table' },
    { id: 'board' as const, icon: LayoutGrid, label: 'Board' },
    { id: 'calendar' as const, icon: Calendar, label: 'Calendar' },
    { id: 'list' as const, icon: List, label: 'List' },
  ]

  const currentView = views.find((v) => v.id === viewType)
  const CurrentViewIcon = currentView?.icon || Table

  return (
    <div className="border-b">
      {/* Title row */}
      <div className="px-12 py-8">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <button
            className="text-5xl hover:bg-accent rounded-lg p-2 transition-colors -ml-2 -mt-1"
            onClick={() => {
              const newIcon = prompt('Enter new icon (emoji):', database.icon || '📊')
              if (newIcon !== null) {
                onUpdateIcon(newIcon)
              }
            }}
          >
            {database.icon || '📊'}
          </button>

          {/* Name and actions */}
          <div className="flex-1">
            {isEditingName ? (
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onBlur={handleNameSubmit}
                onKeyDown={handleNameKeyDown}
                className="text-3xl font-bold h-auto py-1 px-2 border-none shadow-none focus-visible:ring-0 bg-transparent"
                autoFocus
              />
            ) : (
              <h1
                className="text-3xl font-bold cursor-text hover:bg-accent/50 rounded px-2 py-1 transition-colors inline-block text-foreground/90"
                onClick={() => setIsEditingName(true)}
              >
                {database.name || 'Untitled Database'}
              </h1>
            )}

            {/* Description */}
            {database.description && (
              <p className="text-muted-foreground text-sm mt-2 px-2">
                {database.description}
              </p>
            )}
          </div>

          {/* Actions menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem onClick={onAddProperty}>
                <Plus className="h-4 w-4 mr-2" />
                Add property
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="h-4 w-4 mr-2" />
                Database settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete database
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Toolbar row - Notion style */}
      <div className="px-12 pb-2 flex items-center gap-1">
        {/* View selector button */}
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-sm font-normal gap-1.5 text-foreground"
        >
          <CurrentViewIcon className="h-4 w-4" />
          {currentView?.label}
        </Button>

        <div className="w-px h-4 bg-border mx-1" />

        {/* Filter button */}
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-sm font-normal text-muted-foreground hover:text-foreground"
        >
          <Filter className="h-3.5 w-3.5 mr-1.5" />
          Filter
        </Button>

        {/* Sort button */}
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-sm font-normal text-muted-foreground hover:text-foreground"
        >
          <ArrowUpDown className="h-3.5 w-3.5 mr-1.5" />
          Sort
        </Button>

        <div className="flex-1" />

        {/* Search */}
        {showSearch ? (
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="h-7 w-48 pl-7 text-sm"
              autoFocus
              onBlur={() => {
                if (!searchQuery) setShowSearch(false)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setSearchQuery('')
                  setShowSearch(false)
                }
              }}
            />
          </div>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            onClick={() => setShowSearch(true)}
          >
            <Search className="h-3.5 w-3.5" />
          </Button>
        )}

        {/* View settings button */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'h-7 w-7 text-muted-foreground hover:text-foreground',
            showViewSettings && 'bg-accent text-foreground'
          )}
          onClick={() => setShowViewSettings(!showViewSettings)}
        >
          <Settings2 className="h-3.5 w-3.5" />
        </Button>

        {/* New button */}
        <Button
          size="sm"
          className="h-7 px-3 text-sm font-medium ml-1 bg-primary hover:bg-primary/90"
        >
          New
        </Button>
      </div>

      {/* View tabs - under toolbar */}
      <div className="px-12 pb-0 flex items-center border-b-0">
        {views.map((view) => {
          const Icon = view.icon
          const isActive = viewType === view.id
          return (
            <button
              key={view.id}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 text-sm transition-colors border-b-2 -mb-px',
                isActive
                  ? 'border-foreground text-foreground font-medium'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
              onClick={() => onViewChange?.(view.id)}
            >
              <Icon className="h-4 w-4" />
              {view.label}
            </button>
          )
        })}
        <button className="flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground border-b-2 border-transparent -mb-px">
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Delete confirmation dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete database</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{database.name}"? This will permanently delete
              the database and all its rows. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onDelete()
                setShowDeleteDialog(false)
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Settings Sheet */}
      <Sheet open={showViewSettings} onOpenChange={setShowViewSettings}>
        <SheetContent className="w-80 p-0">
          <SheetHeader className="px-4 py-3 border-b">
            <SheetTitle className="text-sm font-medium flex items-center gap-2">
              <Input
                defaultValue="View name"
                className="h-7 text-sm font-medium border-none shadow-none focus-visible:ring-1 px-2"
              />
            </SheetTitle>
          </SheetHeader>

          <div className="py-1">
            {/* Layout */}
            <button className="w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-accent">
              <div className="flex items-center gap-3">
                <Table className="h-4 w-4 text-muted-foreground" />
                <span>Layout</span>
              </div>
              <span className="text-muted-foreground">Table</span>
            </button>

            {/* Property visibility */}
            <button className="w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-accent">
              <div className="flex items-center gap-3">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <span>Property visibility</span>
              </div>
              <span className="text-muted-foreground">{database.schema.length}</span>
            </button>

            {/* Filter */}
            <button className="w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-accent">
              <div className="flex items-center gap-3">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span>Filter</span>
              </div>
            </button>

            {/* Sort */}
            <button className="w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-accent">
              <div className="flex items-center gap-3">
                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                <span>Sort</span>
              </div>
            </button>

            {/* Group */}
            <button className="w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-accent">
              <div className="flex items-center gap-3">
                <LayoutGrid className="h-4 w-4 text-muted-foreground" />
                <span>Group</span>
              </div>
            </button>

            {/* Conditional color */}
            <button className="w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-accent">
              <div className="flex items-center gap-3">
                <Paintbrush className="h-4 w-4 text-muted-foreground" />
                <span>Conditional color</span>
              </div>
            </button>

            {/* Copy link to view */}
            <button className="w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-accent">
              <div className="flex items-center gap-3">
                <Link2 className="h-4 w-4 text-muted-foreground" />
                <span>Copy link to view</span>
              </div>
            </button>

            <div className="border-t my-1" />

            {/* Data source settings */}
            <div className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Data source settings
            </div>

            {/* Source */}
            <button className="w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-accent">
              <div className="flex items-center gap-3">
                <Database className="h-4 w-4 text-muted-foreground" />
                <span>Source</span>
              </div>
              <span className="text-muted-foreground truncate max-w-[120px]">
                {database.name}
              </span>
            </button>

            {/* Edit properties */}
            <button className="w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-accent">
              <div className="flex items-center gap-3">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <span>Edit properties</span>
              </div>
            </button>

            <div className="border-t my-1" />

            {/* Lock database */}
            <button className="w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-accent">
              <div className="flex items-center gap-3">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <span>Lock database</span>
              </div>
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
