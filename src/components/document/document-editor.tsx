import { OpenBlockEditor, OpenBlockContent } from '@/components/editor/openblock-editor'
import { FieldEditor } from '@/components/database/common/field-editor'
import { ContentHeader, type BreadcrumbItem } from '@/components/shared/content-header'
import { Loader2 } from 'lucide-react'
import type { PropertySchema } from '@/hooks/use-database'

// Types for document fields (from database schema)
interface DocumentField {
  property: PropertySchema
  value: unknown
}

// Props for the unified document editor
interface DocumentEditorProps {
  // Core document data
  documentId?: string // Used as key to force editor remount on document change
  title: string
  icon: string | null
  content: OpenBlockContent | null

  // Loading states
  isLoading?: boolean
  isUpdating?: boolean

  // Callbacks for changes
  onTitleChange: (title: string) => void
  onIconChange: (icon: string | null) => void
  onContentChange: (content: OpenBlockContent) => void

  // Optional fields (for database documents)
  fields?: DocumentField[]
  onFieldChange?: (propertyId: string, value: unknown) => void

  // Navigation/breadcrumb
  breadcrumbs?: BreadcrumbItem[]

  // Optional features (for regular documents)
  updatedAt?: string
  isFavorited?: boolean
  onFavoriteToggle?: () => void
  isLocked?: boolean
  temporaryUnlock?: boolean
  onTemporaryUnlockToggle?: () => void
  isFullWidth?: boolean
  onSettingsClick?: () => void
  onHistoryClick?: () => void

  // Error handling
  saveError?: string | null

  // For version comparison (regular documents only)
  comparisonPanel?: React.ReactNode

  // Editor readiness
  isInitialized?: boolean
}

export function DocumentEditor({
  documentId,
  title,
  icon,
  content,
  isLoading = false,
  isUpdating = false,
  onTitleChange,
  onIconChange,
  onContentChange,
  fields,
  onFieldChange,
  breadcrumbs = [],
  updatedAt,
  isFavorited,
  onFavoriteToggle,
  isLocked = false,
  temporaryUnlock = false,
  onTemporaryUnlockToggle,
  isFullWidth = false,
  onSettingsClick,
  onHistoryClick,
  saveError,
  comparisonPanel,
  isInitialized = true,
}: DocumentEditorProps) {
  // Determine if editor should be editable
  const isEditable = !isLocked || temporaryUnlock

  // Check if we have fields to display
  const hasFields = fields && fields.length > 0

  // Content max width style
  const contentMaxWidth = isFullWidth ? '100%' : '720px'

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col relative">
      {/* Unified Content Header */}
      <ContentHeader
        title={title}
        onTitleChange={onTitleChange}
        onSettingsClick={onSettingsClick || (() => {})}
        placeholder="Untitled"
        breadcrumbs={breadcrumbs}
        icon={icon}
        defaultIcon="📄"
        onIconChange={onIconChange}
        isFavorited={isFavorited}
        onFavoriteToggle={onFavoriteToggle}
        isLocked={isLocked}
        temporaryUnlock={temporaryUnlock}
        onTemporaryUnlockToggle={onTemporaryUnlockToggle}
        updatedAt={updatedAt}
        isUpdating={isUpdating}
        onHistoryClick={onHistoryClick}
        isFullWidth={isFullWidth}
        isEditable={isEditable}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Main content area */}
        <div className="flex-1 overflow-y-auto">
          {/* Fields section (for database documents) */}
          {hasFields && onFieldChange && (
            <div className="mx-auto" style={{ maxWidth: contentMaxWidth, padding: '0 2rem' }}>
              <div className="py-4 border-b space-y-2">
                {fields.map((field) => (
                  <div
                    key={field.property.id}
                    className="flex items-start gap-4 py-1"
                  >
                    <div className="w-32 shrink-0 text-sm text-muted-foreground py-1.5">
                      {field.property.name}
                    </div>
                    <div className="flex-1 min-w-0">
                      <FieldEditor
                        property={field.property}
                        value={field.value}
                        onChange={(value) => field.property.id && onFieldChange(field.property.id, value)}
                        className="w-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* OpenBlock Editor */}
          {isInitialized ? (
            <OpenBlockEditor
              key={documentId}
              content={content}
              onChange={onContentChange}
              editable={isEditable}
              fullWidth={isFullWidth}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {/* Error toast */}
          {saveError && (
            <div className="fixed bottom-4 right-4 bg-destructive text-destructive-foreground border border-destructive rounded-lg shadow-lg px-3 py-2 flex items-center gap-2 z-30">
              <span className="text-sm">{saveError}</span>
            </div>
          )}
        </div>

        {/* Comparison panel (for version history) */}
        {comparisonPanel}
      </div>
    </div>
  )
}
