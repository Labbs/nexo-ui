import { useState } from 'react'
import { Filter, ArrowUpDown, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { FilterBuilder } from './filter-builder'
import { SortBuilder } from './sort-builder'
import type { ViewConfig, FilterConfig, SortConfig, PropertySchema } from '@/hooks/use-database'

interface DatabaseToolbarProps {
  view: ViewConfig
  columns: PropertySchema[]
  onFilterChange: (filter: FilterConfig | undefined) => void
  onSortChange: (sort: SortConfig[]) => void
  onSearch?: (query: string) => void
}

export function DatabaseToolbar({
  view,
  columns,
  onFilterChange,
  onSortChange,
  onSearch,
}: DatabaseToolbarProps) {
  const [filterOpen, setFilterOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)

  // Count active filters
  const filterCount = countActiveFilters(view.filter)
  const sortCount = view.sort?.length || 0

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    onSearch?.(value)
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
    <div className="flex items-center gap-2 px-4 py-2 border-b border-border">
      {/* Filter button */}
      <Popover open={filterOpen} onOpenChange={setFilterOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={filterCount > 0 ? 'secondary' : 'ghost'}
            size="sm"
            className="h-8"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
            {filterCount > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                {filterCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96 p-0" align="start">
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
              filter={parseFilterConfig(view.filter)}
              onChange={onFilterChange}
            />
          </div>
        </PopoverContent>
      </Popover>

      {/* Sort button */}
      <Popover open={sortOpen} onOpenChange={setSortOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={sortCount > 0 ? 'secondary' : 'ghost'}
            size="sm"
            className="h-8"
          >
            <ArrowUpDown className="h-4 w-4 mr-2" />
            Sort
            {sortCount > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                {sortCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
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
              sort={view.sort || []}
              onChange={onSortChange}
            />
          </div>
        </PopoverContent>
      </Popover>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search */}
      {showSearch ? (
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="h-8 w-48"
            autoFocus
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => {
              setShowSearch(false)
              setSearchQuery('')
              onSearch?.('')
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setShowSearch(true)}
        >
          <Search className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

function countActiveFilters(filter: Record<string, unknown> | undefined): number {
  if (!filter) return 0
  let count = 0
  if (Array.isArray(filter.and)) {
    count += filter.and.length
  }
  if (Array.isArray(filter.or)) {
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
