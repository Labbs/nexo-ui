import { useCallback, useMemo, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { MainLayout } from '@/components/layout/main-layout'
import { DocumentEditor } from '@/components/document/document-editor'
import { DocumentRowSettingsSidebar } from '@/components/database/document/document-row-settings-sidebar'
import { type BlockNoteContent } from '@/components/editor/blocknote-editor'
import {
  useDatabase,
  useRow,
  useUpdateRow,
  type PropertySchema,
} from '@/hooks/use-database'

// Content type for database document rows
interface RowContent {
  blocks?: BlockNoteContent
  icon?: string
  lock?: boolean
  full_width?: boolean
}

export function DatabaseDocumentPage() {
  const { spaceId, databaseId, rowId } = useParams<{
    spaceId: string
    databaseId: string
    rowId: string
  }>()

  // API hooks
  const { data: database, isLoading: isLoadingDatabase } = useDatabase(databaseId)
  const { data: row, isLoading: isLoadingRow } = useRow(databaseId, rowId)
  const updateRow = useUpdateRow()

  // Track initialization for editor
  const [isInitialized, setIsInitialized] = useState(false)

  // Settings sidebar state
  const [isSettingsSidebarOpen, setIsSettingsSidebarOpen] = useState(false)

  // Local state for lock and fullWidth (stored in row.content)
  const [isLocked, setIsLocked] = useState(false)
  const [isFullWidth, setIsFullWidth] = useState(false)
  const [temporaryUnlock, setTemporaryUnlock] = useState(false)

  // Reset initialization when rowId changes
  useEffect(() => {
    setIsInitialized(false)
    setTemporaryUnlock(false)
  }, [rowId])

  // Initialize state from row content
  useEffect(() => {
    if (row && !isInitialized) {
      const content = row.content as RowContent | undefined
      setIsLocked(content?.lock || false)
      setIsFullWidth(content?.full_width || false)
      setIsInitialized(true)
    }
  }, [row, isInitialized])

  // Find title column
  const titleColumn = useMemo(() => {
    if (!database?.schema) return null
    return database.schema.find(col => col.type === 'title') || database.schema[0]
  }, [database?.schema])

  // Get non-title columns for fields
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
    const content = row?.content as RowContent | undefined
    return content?.icon || null
  }, [row?.content])

  // Get current content blocks
  const contentBlocks = useMemo(() => {
    const content = row?.content as RowContent | undefined
    return content?.blocks || null
  }, [row?.content])

  // Get timestamps
  const updatedAt = useMemo(() => {
    return (row as any)?.updated_at
  }, [row])

  const createdAt = useMemo(() => {
    return (row as any)?.created_at
  }, [row])

  // Build fields array for DocumentEditor
  const fields = useMemo(() => {
    if (!row?.properties) return []
    return fieldColumns.map((property: PropertySchema) => ({
      property,
      value: property.id ? row.properties[property.id] : undefined,
    }))
  }, [row?.properties, fieldColumns])

  // Build breadcrumbs
  const breadcrumbs = useMemo(() => {
    const crumbs = []
    if (database) {
      crumbs.push({
        label: database.name || 'Database',
        href: `/space/${spaceId}/database/${databaseId}`,
        icon: database.icon,
      })
    }
    crumbs.push({
      label: titleValue || 'Untitled',
    })
    return crumbs
  }, [database, spaceId, databaseId, titleValue])

  // Helper to update content while preserving other fields
  const updateContent = useCallback((updates: Partial<RowContent>) => {
    if (!databaseId || !rowId) return

    const currentContent = (row?.content as RowContent) || {}

    updateRow.mutate({
      databaseId,
      rowId,
      content: {
        ...currentContent,
        ...updates,
      } as Record<string, unknown>,
    })
  }, [databaseId, rowId, row?.content, updateRow])

  // Handle title change
  const handleTitleChange = useCallback((newTitle: string) => {
    if (!titleColumn?.id || !databaseId || !rowId || !row) return

    updateRow.mutate({
      databaseId,
      rowId,
      properties: {
        ...row.properties,
        [titleColumn.id]: newTitle,
      },
    })
  }, [titleColumn, databaseId, rowId, row, updateRow])

  // Handle icon change
  const handleIconChange = useCallback((newIcon: string | null) => {
    updateContent({ icon: newIcon || '' })
  }, [updateContent])

  // Handle content change
  const handleContentChange = useCallback((content: BlockNoteContent) => {
    updateContent({ blocks: content })
  }, [updateContent])

  // Handle field change
  const handleFieldChange = useCallback((propertyId: string, value: unknown) => {
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

  // Handle config change (lock, fullWidth)
  const handleConfigChange = useCallback((config: Partial<{ fullWidth: boolean; lock: boolean }>) => {
    // Update local state immediately for responsive UI
    if (config.lock !== undefined) {
      setIsLocked(config.lock)
    }
    if (config.fullWidth !== undefined) {
      setIsFullWidth(config.fullWidth)
    }

    // Save to content
    const updates: Partial<RowContent> = {}
    if (config.lock !== undefined) {
      updates.lock = config.lock
    }
    if (config.fullWidth !== undefined) {
      updates.full_width = config.fullWidth
    }
    updateContent(updates)
  }, [updateContent])

  // Loading state
  const isLoading = isLoadingDatabase || isLoadingRow

  // Not found state
  if (!isLoading && (!database || !row)) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <p className="text-muted-foreground">Document not found</p>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <DocumentEditor
        title={titleValue}
        icon={iconValue}
        content={contentBlocks}
        isLoading={isLoading}
        isUpdating={updateRow.isPending}
        onTitleChange={handleTitleChange}
        onIconChange={handleIconChange}
        onContentChange={handleContentChange}
        fields={fields}
        onFieldChange={handleFieldChange}
        breadcrumbs={breadcrumbs}
        updatedAt={updatedAt}
        isLocked={isLocked}
        temporaryUnlock={temporaryUnlock}
        onTemporaryUnlockToggle={() => setTemporaryUnlock(!temporaryUnlock)}
        isFullWidth={isFullWidth}
        onSettingsClick={() => setIsSettingsSidebarOpen(true)}
        isInitialized={isInitialized}
      />

      {/* Settings Sidebar */}
      {databaseId && rowId && (
        <DocumentRowSettingsSidebar
          isOpen={isSettingsSidebarOpen}
          onClose={() => setIsSettingsSidebarOpen(false)}
          databaseId={databaseId}
          rowId={rowId}
          rowName={titleValue}
          icon={iconValue}
          isLocked={isLocked}
          isFullWidth={isFullWidth}
          updatedAt={updatedAt}
          createdAt={createdAt}
          onIconChange={handleIconChange}
          onConfigChange={handleConfigChange}
          isUpdating={updateRow.isPending}
        />
      )}
    </MainLayout>
  )
}
