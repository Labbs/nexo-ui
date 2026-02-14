<<<<<<< HEAD
import { useMemo } from 'react'
=======
import { memo, useMemo } from 'react'
>>>>>>> d4609d4 (feat: add hooks for managing spaces, users, versions, and webhooks)
import { useTranslation } from 'react-i18next'
import { Plus, MoreHorizontal, Image } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import type { PropertySchema } from '@/hooks/use-database'
import { selectOptionColors, type SelectOption } from '@/lib/database'
import { DocumentIcon, type IconValue } from '@/components/ui/icon-picker'

interface RowData {
  id: string
  properties: Record<string, unknown>
  content?: { icon?: IconValue; blocks?: unknown }
}

interface DocumentGalleryViewProps {
  schema: PropertySchema[]
  rows: RowData[]
  onUpdateRow: (rowId: string, properties: Record<string, unknown>) => void
  onDeleteRow: (rowId: string) => void
  onAddRow: () => void
  onOpenDocument: (rowId: string) => void
  isLoading?: boolean
}

export function DocumentGalleryView({
  schema,
  rows,
  onDeleteRow,
  onAddRow,
  onOpenDocument,
  isLoading,
}: DocumentGalleryViewProps) {
  const { t } = useTranslation('database')

  // Get title column for displaying card titles
  const titleColumn = useMemo(() => {
    return schema.find(col => col.type === 'title') || schema[0]
  }, [schema])

  // Get cover/image column if exists
  const coverColumn = useMemo(() => {
    return schema.find(col => col.type === 'url' || col.type === 'file')
  }, [schema])

  // Get preview properties (exclude title and cover)
  const previewProperties = useMemo(() => {
    return schema
      .filter(col => col.id !== titleColumn?.id && col.id !== coverColumn?.id)
      .slice(0, 4)
  }, [schema, titleColumn, coverColumn])

  return (
    <div className="flex flex-col h-full px-4">
      {/* Gallery grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {rows.map(row => (
            <GalleryCard
              key={row.id}
              row={row}
              titleColumn={titleColumn}
              coverColumn={coverColumn}
              previewProperties={previewProperties}
              onOpenDocument={onOpenDocument}
              onDeleteRow={onDeleteRow}
            />
          ))}

          {/* Add new card button */}
          <button
            onClick={onAddRow}
            className={cn(
              'flex flex-col items-center justify-center min-h-[200px] rounded-lg border-2 border-dashed',
              'text-muted-foreground hover:text-foreground hover:border-foreground/50 transition-colors',
              isLoading && 'pointer-events-none opacity-50'
            )}
          >
            <Plus className="h-8 w-8 mb-2" />
            <span className="text-sm">{t('gallery.new')}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

interface GalleryCardProps {
  row: RowData
  titleColumn: PropertySchema | undefined
  coverColumn: PropertySchema | undefined
  previewProperties: PropertySchema[]
  onOpenDocument: (rowId: string) => void
  onDeleteRow: (rowId: string) => void
}

<<<<<<< HEAD
function GalleryCard({
=======
const GalleryCard = memo(function GalleryCard({
>>>>>>> d4609d4 (feat: add hooks for managing spaces, users, versions, and webhooks)
  row,
  titleColumn,
  coverColumn,
  previewProperties,
  onOpenDocument,
  onDeleteRow,
}: GalleryCardProps) {
  const { t } = useTranslation('database')
  const title = titleColumn?.id ? (row.properties[titleColumn.id] as string) || t('common:untitled') : t('common:untitled')
  const coverUrl = coverColumn?.id ? (row.properties[coverColumn.id] as string) : null

  return (
    <div
      className="group bg-background rounded-lg border shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onOpenDocument(row.id)}
    >
      {/* Cover image or placeholder */}
      <div className="aspect-[4/3] bg-muted relative">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Image className="h-12 w-12 text-muted-foreground/30" />
          </div>
        )}

        {/* Actions overlay */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
              <Button variant="secondary" size="icon" className="h-7 w-7">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={e => e.stopPropagation()}>
              <DropdownMenuItem onClick={() => onOpenDocument(row.id)}>
                {t('gallery.open')}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => onDeleteRow(row.id)}
              >
                {t('gallery.delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Card content */}
      <div className="p-3">
        {/* Title */}
        <div className="flex items-center gap-2 mb-2">
          <DocumentIcon value={row.content?.icon} size="sm" />
          <span className="text-sm font-medium truncate">{title}</span>
        </div>

        {/* Preview properties */}
        {previewProperties.length > 0 && (
          <div className="space-y-1">
            {previewProperties.map(prop => {
              if (!prop.id) return null
              const value = row.properties[prop.id]
              if (!value) return null

              return (
                <PropertyPreview key={prop.id} property={prop} value={value} />
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
<<<<<<< HEAD
}
=======
})
>>>>>>> d4609d4 (feat: add hooks for managing spaces, users, versions, and webhooks)

interface PropertyPreviewProps {
  property: PropertySchema
  value: unknown
}

function getPropertyOptions(property: PropertySchema): SelectOption[] {
  if (!property.options) return []
  const opts = (property.options as { options?: SelectOption[] })?.options
  if (Array.isArray(opts)) return opts
  if (Array.isArray(property.options)) return property.options as SelectOption[]
  return []
}

<<<<<<< HEAD
function PropertyPreview({ property, value }: PropertyPreviewProps) {
=======
const PropertyPreview = memo(function PropertyPreview({ property, value }: PropertyPreviewProps) {
>>>>>>> d4609d4 (feat: add hooks for managing spaces, users, versions, and webhooks)
  const renderValue = () => {
    switch (property.type) {
      case 'checkbox':
        return (
          <span className={cn(value ? 'text-green-600' : 'text-muted-foreground')}>
            {value ? '✓' : '✗'}
          </span>
        )

      case 'select':
      case 'status': {
        const options = getPropertyOptions(property)
        const option = options.find(o => o.id === value || o.name === value)
        if (!option) return null
        const colorConfig = selectOptionColors.find(c => c.value === option.color)
        return (
          <Badge
            variant="secondary"
            className={cn('text-xs', colorConfig?.bg, colorConfig?.text)}
          >
            {option.name}
          </Badge>
        )
      }

      case 'multi_select': {
        if (!Array.isArray(value)) return null
        const options = getPropertyOptions(property)
        return (
          <div className="flex flex-wrap gap-1">
            {value.slice(0, 2).map((v, idx) => {
              const option = options.find(o => o.id === v || o.name === v)
              if (!option) return null
              const colorConfig = selectOptionColors.find(c => c.value === option.color)
              return (
                <Badge
                  key={idx}
                  variant="secondary"
                  className={cn('text-xs', colorConfig?.bg, colorConfig?.text)}
                >
                  {option.name}
                </Badge>
              )
            })}
            {value.length > 2 && (
              <span className="text-xs text-muted-foreground">+{value.length - 2}</span>
            )}
          </div>
        )
      }

      case 'date': {
        if (typeof value !== 'string') return null
        try {
          return (
            <span className="text-xs text-muted-foreground">
              {new Date(value).toLocaleDateString()}
            </span>
          )
        } catch {
          return null
        }
      }

      default:
        return (
          <span className="text-xs text-muted-foreground truncate">
            {String(value)}
          </span>
        )
    }
  }

  return (
    <div className="flex items-center gap-1 text-xs text-muted-foreground">
      <span className="shrink-0 truncate max-w-[60px]">{property.name}:</span>
      {renderValue()}
    </div>
  )
<<<<<<< HEAD
}
=======
})
>>>>>>> d4609d4 (feat: add hooks for managing spaces, users, versions, and webhooks)
