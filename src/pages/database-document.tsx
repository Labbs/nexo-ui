import { useCallback, useMemo, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MainLayout } from '@/components/layout/main-layout'
import { DocumentEditor } from '@/components/document/document-editor'
import { DocumentRowSettingsSidebar } from '@/components/database/document/document-row-settings-sidebar'
import { type OpenBlockContent } from '@/components/editor/openblock-editor'
import type { IconValue } from '@/components/ui/icon-picker'
import {
  useDatabase,
  useRow,
  useUpdateRow,
  type PropertySchema,
} from '@/hooks/use-database'

// Content type for database document rows
interface RowContent {
  blocks?: OpenBlockContent
  icon?: IconValue
  lock?: boolean
  full_width?: boolean
}

export function DatabaseDocumentPage() {
  const { t } = useTranslation('database')
  const { spaceId, databaseId, rowId } = useParams<{
    spaceId: string
    databaseId: string
    rowId: string
  }>()

  // API hooks
  const { data: database, isLoading: isLoadingDatabase } = useDatabase(databaseId)
  const { data: row, isLoading: isLoadingRow } = useRow(databaseId, rowId)
  const updateRow = useUpdateRow()

  // Track initialization for editor - we need to track which rowId was initialized
  // to handle the timing issue where the component remounts before effects run
  const [initializedRowId, setInitializedRowId] = useState<string | null>(null)

  // Settings sidebar state
  const [isSettingsSidebarOpen, setIsSettingsSidebarOpen] = useState(false)

  // Local state for lock and fullWidth (stored in row.content)
  const [isLocked, setIsLocked] = useState(false)
  const [isFullWidth, setIsFullWidth] = useState(false)
  const [temporaryUnlock, setTemporaryUnlock] = useState(false)

  // Reset initialization when rowId changes
  useEffect(() => {
    setInitializedRowId(null)
    setTemporaryUnlock(false)
  }, [rowId])

  // Initialize state from row content
  useEffect(() => {
    if (row && !initializedRowId) {
      // Verify the row matches the current URL before initializing
      // This prevents using stale cached data from a previous row
      if (row.id && row.id !== rowId) return

      const content = row.content as RowContent | undefined
      setIsLocked(content?.lock || false)
      setIsFullWidth(content?.full_width || false)
      setInitializedRowId(rowId || null)
    }
  }, [row, initializedRowId, rowId])

  // Find title column
  const titleColumn = useMemo(() => {
    if (!database?.schema) return null
    return database.schema.find((col: PropertySchema) => col.type === 'title') || database.schema[0]
  }, [database?.schema])

  // Get non-title columns for fields
  const fieldColumns = useMemo(() => {
    if (!database?.schema) return []
    return database.schema.filter((col: PropertySchema) => col.type !== 'title')
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

  // Compute if we're initialized for the current rowId
  // This is the key fix: when rowId changes but effects haven't run yet,
  // initializedRowId won't match rowId, so isInitialized will be false
  const isInitialized = !!initializedRowId && initializedRowId === rowId

  // Get current content blocks
  const contentBlocks = useMemo(() => {
    if (!isInitialized) return null // Still loading
    const content = row?.content as RowContent | undefined
    // Use empty array for empty content (not null) to signal "ready but empty"
    return content?.blocks || []
  }, [row?.content, isInitialized])

  // Get timestamps and user info
  const updatedAt = useMemo(() => {
    return row?.updated_at
  }, [row])

  const createdAt = useMemo(() => {
    return row?.created_at
  }, [row])

  const createdByUser = useMemo(() => {
    return row?.created_by_user
  }, [row])

  const updatedByUser = useMemo(() => {
    return row?.updated_by_user
  }, [row])

  // Build fields array for DocumentEditor
  const fields = useMemo(() => {
    const props = row?.properties
    if (!props) return []
    return fieldColumns.map((property: PropertySchema) => ({
      property,
      value: property.id ? props[property.id] : undefined,
    }))
  }, [row?.properties, fieldColumns])

  // Build breadcrumbs
  const breadcrumbs = useMemo(() => {
    const crumbs = []
    if (database) {
      crumbs.push({
        label: database.name || t('untitledDatabase'),
        href: `/space/${spaceId}/database/${databaseId}`,
        icon: database.icon,
      })
    }
    crumbs.push({
      label: titleValue || t('common:untitled'),
    })
    return crumbs
  }, [database, spaceId, databaseId, titleValue, t])

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
  const handleIconChange = useCallback((newIcon: IconValue) => {
    updateContent({ icon: newIcon || undefined })
  }, [updateContent])

  // Handle content change
  const handleContentChange = useCallback((content: OpenBlockContent) => {
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
          <p className="text-muted-foreground">{t('document:notFound')}</p>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <DocumentEditor
        key={rowId}
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
          createdByUser={createdByUser}
          updatedByUser={updatedByUser}
          onIconChange={handleIconChange}
          onConfigChange={handleConfigChange}
          isUpdating={updateRow.isPending}
        />
      )}
    </MainLayout>
  )
}
