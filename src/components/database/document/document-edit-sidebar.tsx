import { useCallback, useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { X, ExternalLink, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BlockNoteEditor, type BlockNoteContent } from '@/components/editor/blocknote-editor'
import { FieldEditor } from '@/components/database/common/field-editor'
import { EmojiPicker } from '@/components/ui/emoji-picker'
import {
  useDatabase,
  useRow,
  useUpdateRow,
  type PropertySchema,
} from '@/hooks/use-database'
import { cn } from '@/lib/utils'

interface DocumentEditSidebarProps {
  isOpen: boolean
  onClose: () => void
  databaseId: string
  rowId: string
  spaceId: string
}

export function DocumentEditSidebar({
  isOpen,
  onClose,
  databaseId,
  rowId,
  spaceId,
}: DocumentEditSidebarProps) {
  const { data: database, isLoading: isLoadingDatabase } = useDatabase(databaseId)
  const { data: row, isLoading: isLoadingRow } = useRow(databaseId, rowId)
  const updateRow = useUpdateRow()

  // Local state for title editing
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [localTitle, setLocalTitle] = useState('')

  // Find title column
  const titleColumn = useMemo(() => {
    if (!database?.schema) return null
    return database.schema.find(col => col.type === 'title') || database.schema[0]
  }, [database?.schema])

  // Get non-title columns for the fields header
  const fieldColumns = useMemo(() => {
    if (!database?.schema) return []
    return database.schema.filter(col => col.type !== 'title')
  }, [database?.schema])

  // Get current title value
  const titleValue = useMemo(() => {
    if (!row?.properties || !titleColumn || !titleColumn.id) return ''
    return (row.properties[titleColumn.id] as string) || ''
  }, [row?.properties, titleColumn])

  // Get current icon from content
  const iconValue = useMemo(() => {
    const content = row?.content as { icon?: string } | undefined
    return content?.icon || null
  }, [row?.content])

  // Reset title when row changes
  useEffect(() => {
    setLocalTitle(titleValue)
    setIsEditingTitle(false)
  }, [titleValue, rowId])

  // Handle property change
  const handlePropertyChange = useCallback((propertyId: string, value: unknown) => {
    if (!databaseId || !rowId || !row) return

    updateRow.mutate({
      databaseId,
      rowId,
      properties: {
        ...row.properties,
        [propertyId]: value,
      },
    })
  }, [databaseId, rowId, row, updateRow])

  // Handle title save
  const handleTitleSave = useCallback(() => {
    setIsEditingTitle(false)
    if (!titleColumn || !titleColumn.id || localTitle === titleValue) return
    handlePropertyChange(titleColumn.id, localTitle)
  }, [titleColumn, localTitle, titleValue, handlePropertyChange])

  // Handle icon change
  const handleIconChange = useCallback((newIcon: string) => {
    if (!databaseId || !rowId) return

    const currentContent = (row?.content as { blocks?: BlockNoteContent; icon?: string }) || {}

    updateRow.mutate({
      databaseId,
      rowId,
      content: {
        ...currentContent,
        icon: newIcon,
      } as Record<string, unknown>,
    })
  }, [databaseId, rowId, row?.content, updateRow])

  // Handle content change
  const handleContentChange = useCallback((content: BlockNoteContent) => {
    if (!databaseId || !rowId) return

    const currentContent = (row?.content as { blocks?: BlockNoteContent; icon?: string }) || {}

    updateRow.mutate({
      databaseId,
      rowId,
      content: {
        ...currentContent,
        blocks: content,
      } as Record<string, unknown>,
    })
  }, [databaseId, rowId, row?.content, updateRow])

  const isLoading = isLoadingDatabase || isLoadingRow

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full border-l shadow-xl z-50 transition-transform duration-300 ease-in-out",
          "w-[600px] max-w-[90vw]",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        style={{ backgroundColor: 'hsl(var(--background))' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {database?.name || 'Document'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              asChild
              title="Open as full page"
            >
              <Link to={`/space/${spaceId}/database/${databaseId}/doc/${rowId}`}>
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              title="Close"
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
          ) : !row ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Document not found</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {/* Icon and Title */}
              <div className="px-6 pt-6 pb-4">
                <div className="flex items-center gap-2">
                  <EmojiPicker value={iconValue} onChange={handleIconChange}>
                    <button
                      className="shrink-0 hover:bg-accent rounded p-1 transition-colors"
                      title="Change icon"
                    >
                      <span className="text-2xl">{iconValue || '📄'}</span>
                    </button>
                  </EmojiPicker>
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
                      placeholder="Untitled"
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
                      {titleValue || 'Untitled'}
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
                            value={property.id ? row.properties[property.id] : undefined}
                            onChange={(value) => property.id && handlePropertyChange(property.id, value)}
                            className="w-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* BlockNote Editor for content */}
              <div className="px-6 py-4 flex-1">
                <BlockNoteEditor
                  content={((row.content as { blocks?: BlockNoteContent })?.blocks) || []}
                  onChange={handleContentChange}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
