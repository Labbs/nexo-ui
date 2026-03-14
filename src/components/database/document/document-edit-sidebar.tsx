import { useCallback, useState, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { X, ExternalLink, Loader2, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { OpenBlockEditor, type OpenBlockContent } from '@/components/editor/openblock-editor'
import { FieldEditor } from '@/components/database/common/field-editor'
import { IconPicker, DocumentIcon, type IconValue } from '@/components/ui/icon-picker'
import {
  useDatabase,
  useRow,
  useUpdateRow,
  type PropertySchema,
  type RowItem,
} from '@/hooks/use-database'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { useLanguage } from '@/i18n/LanguageContext'

interface DocumentEditSidebarProps {
  isOpen: boolean
  onClose: () => void
  databaseId: string
  rowId: string
  spaceId: string
  initialRowData?: RowItem
}

export function DocumentEditSidebar({
  isOpen,
  onClose,
  databaseId,
  rowId,
  spaceId,
  initialRowData,
}: DocumentEditSidebarProps) {
  const { t } = useTranslation('database')
  const { dateFnsLocale } = useLanguage()
  const { data: database, isLoading: isLoadingDatabase } = useDatabase(databaseId)
  const { data: row, isLoading: isLoadingRow } = useRow(databaseId, rowId)
  const updateRow = useUpdateRow()

  // Use initial row data from list or fetched data
  const rowData = row || initialRowData

  // Local state for title editing
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [localTitle, setLocalTitle] = useState('')

  // Find title column
  const titleColumn = useMemo(() => {
    if (!database?.schema) return null
    return database.schema.find((col: PropertySchema) => col.type === 'title') || database.schema[0]
  }, [database?.schema])

  // Get non-title columns for the fields header
  const fieldColumns = useMemo(() => {
    if (!database?.schema) return []
    return database.schema.filter((col: PropertySchema) => col.type !== 'title')
  }, [database?.schema])

  // Get current title value
  const titleValue = useMemo(() => {
    if (!rowData?.properties || !titleColumn || !titleColumn.id) return ''
    return (rowData.properties[titleColumn.id] as string) || ''
  }, [rowData?.properties, titleColumn])

  // Get current icon from content
  const iconValue = useMemo((): IconValue => {
    const content = (rowData as { content?: { icon?: IconValue } })?.content
    return content?.icon || null
  }, [rowData])

  // Get user info for display
  const createdByUser = useMemo(() => {
    return (rowData as RowItem)?.created_by_user
  }, [rowData])

  const updatedByUser = useMemo(() => {
    return (rowData as RowItem)?.updated_by_user
  }, [rowData])

  const createdAt = useMemo(() => {
    return (rowData as RowItem)?.created_at
  }, [rowData])

  const updatedAt = useMemo(() => {
    return (rowData as RowItem)?.updated_at
  }, [rowData])

  // Reset title when row changes
  useEffect(() => {
    setLocalTitle(titleValue)
    setIsEditingTitle(false)
  }, [titleValue, rowId])

  // Handle property change
  const handlePropertyChange = useCallback((propertyId: string, value: unknown) => {
    if (!databaseId || !rowId || !rowData) return

    updateRow.mutate({
      databaseId,
      rowId,
      properties: {
        ...rowData.properties,
        [propertyId]: value,
      },
    })
  }, [databaseId, rowId, rowData, updateRow])

  // Handle title save
  const handleTitleSave = useCallback(() => {
    setIsEditingTitle(false)
    if (!titleColumn || !titleColumn.id || localTitle === titleValue) return
    handlePropertyChange(titleColumn.id, localTitle)
  }, [titleColumn, localTitle, titleValue, handlePropertyChange])

  // Handle icon change
  const handleIconChange = useCallback((newIcon: IconValue) => {
    if (!databaseId || !rowId) return

    const currentContent = ((rowData as { content?: { blocks?: OpenBlockContent; icon?: IconValue } })?.content) || {}

    updateRow.mutate({
      databaseId,
      rowId,
      content: {
        ...currentContent,
        icon: newIcon,
      } as Record<string, unknown>,
    })
  }, [databaseId, rowId, rowData, updateRow])

  // Handle content change
  const handleContentChange = useCallback((content: OpenBlockContent) => {
    if (!databaseId || !rowId) return

    const currentContent = ((rowData as { content?: { blocks?: OpenBlockContent; icon?: string } })?.content) || {}

    updateRow.mutate({
      databaseId,
      rowId,
      content: {
        ...currentContent,
        blocks: content,
      } as Record<string, unknown>,
    })
  }, [databaseId, rowId, rowData, updateRow])

  // Only show loading if we don't have initial data
  const isLoading = (isLoadingDatabase || isLoadingRow) && !initialRowData

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="absolute inset-0 bg-black/20 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "absolute top-0 right-0 h-full border-l shadow-xl z-50 transition-transform duration-300 ease-in-out",
          "w-[600px] max-w-[90vw]",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        style={{ backgroundColor: 'var(--main-bg)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {database?.name || t('documentEdit.document')}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              asChild
              title={t('documentEdit.openAsFullPage')}
            >
              <Link to={`/space/${spaceId}/database/${databaseId}/doc/${rowId}`}>
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              title={t('documentEdit.close')}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="h-[calc(100%-53px)] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : !rowData ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">{t('documentEdit.notFound')}</p>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              {/* Icon and Title */}
              <div className="px-6 pt-6 pb-4">
                <div className="flex items-center gap-2">
                  <IconPicker value={iconValue} onChange={handleIconChange}>
                    <button
                      className="shrink-0 hover:bg-accent rounded p-1 transition-colors"
                      title={t('documentEdit.changeIcon')}
                    >
                      <DocumentIcon value={iconValue} size="lg" />
                    </button>
                  </IconPicker>
                  {isEditingTitle ? (
                    <input
                      type="text"
                      value={localTitle}
                      onChange={(e) => setLocalTitle(e.target.value)}
                      onBlur={handleTitleSave}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleTitleSave()
                        }
                        if (e.key === 'Escape') {
                          setIsEditingTitle(false)
                          setLocalTitle(titleValue)
                        }
                      }}
                      className="text-2xl font-bold bg-transparent border-none outline-none flex-1"
                      placeholder={t('common:untitled')}
                      autoFocus
                    />
                  ) : (
                    <h1
                      className="text-2xl font-bold cursor-pointer hover:bg-muted/30 rounded px-1 flex-1"
                      onClick={() => {
                        setLocalTitle(titleValue)
                        setIsEditingTitle(true)
                      }}
                    >
                      {titleValue || t('common:untitled')}
                    </h1>
                  )}
                </div>
              </div>

              {/* Fields */}
              {fieldColumns.length > 0 && (
                <div className="px-6 pb-4 border-b">
                  <div className="space-y-2">
                    {fieldColumns.map((property: PropertySchema) => (
                      <div
                        key={property.id}
                        className="flex items-start gap-4 py-1"
                      >
                        <div className="w-28 shrink-0 text-sm text-muted-foreground py-1.5">
                          {property.name}
                        </div>
                        <div className="flex-1 min-w-0">
                          <FieldEditor
                            property={property}
                            value={property.id ? rowData.properties?.[property.id] : undefined}
                            onChange={(value) => property.id && handlePropertyChange(property.id, value)}
                            className="w-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* OpenBlock Editor for content */}
              <div className="px-6 py-4 flex-1">
                <OpenBlockEditor
                  content={(((rowData as { content?: { blocks?: OpenBlockContent } })?.content)?.blocks) || []}
                  onChange={handleContentChange}
                />
              </div>

              {/* Document info */}
              <div className="px-6 py-4 border-t mt-auto">
                <div className="space-y-1.5 text-xs text-muted-foreground">
                  {updatedAt && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      <span>
                        {t('documentEdit.edited', { time: formatDistanceToNow(new Date(updatedAt as unknown as string), { addSuffix: true, locale: dateFnsLocale }) })}
                        {(updatedByUser?.username || createdByUser?.username) && ` ${t('documentEdit.by', { name: updatedByUser?.username || createdByUser?.username })}`}
                      </span>
                    </div>
                  )}
                  {createdAt && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      <span>
                        {t('documentEdit.created', { time: formatDistanceToNow(new Date(createdAt as unknown as string), { addSuffix: true, locale: dateFnsLocale }) })}
                        {createdByUser?.username && ` ${t('documentEdit.by', { name: createdByUser.username })}`}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
