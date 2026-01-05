import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDebouncedCallback } from 'use-debounce'
import { formatDistanceToNow } from 'date-fns'
import { BlockNoteEditor, BlockNoteContent } from '@/components/editor/blocknote-editor'
import { EmojiPicker } from '@/components/ui/emoji-picker'
import { FieldEditor } from '@/components/database/common/field-editor'
import { Button } from '@/components/ui/button'
import { Loader2, Star, Lock, Unlock, ChevronRight, MoreHorizontal, History } from 'lucide-react'
import type { PropertySchema } from '@/hooks/use-database'

// Types for breadcrumb items
interface BreadcrumbItem {
  label: string
  href?: string
  icon?: string
}

// Types for document fields (from database schema)
interface DocumentField {
  property: PropertySchema
  value: unknown
}

// Props for the unified document editor
interface DocumentEditorProps {
  // Core document data
  title: string
  icon: string | null
  content: BlockNoteContent | null

  // Loading states
  isLoading?: boolean
  isUpdating?: boolean

  // Callbacks for changes
  onTitleChange: (title: string) => void
  onIconChange: (icon: string | null) => void
  onContentChange: (content: BlockNoteContent) => void

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
  // Local state for title editing with debounce
  const [localTitle, setLocalTitle] = useState(title)

  // Sync local title with prop when it changes externally
  useEffect(() => {
    setLocalTitle(title)
  }, [title])

  // Debounced title save
  const debouncedTitleChange = useDebouncedCallback(
    (newTitle: string) => {
      onTitleChange(newTitle)
    },
    800
  )

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setLocalTitle(newTitle)
    debouncedTitleChange(newTitle)
  }

  // Handle icon change
  const handleIconChange = (newIcon: string) => {
    // Empty string means remove icon
    onIconChange(newIcon || null)
  }

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
    <div className="flex h-full flex-col">
      {/* Header with breadcrumb */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        {/* Breadcrumb row */}
        <div className="px-4 py-2 flex items-center text-sm text-muted-foreground">
          <nav className="flex items-center gap-1 min-w-0 flex-1">
            {breadcrumbs.map((crumb, index) => (
              <span key={index} className="flex items-center gap-1">
                {index > 0 && <ChevronRight className="h-3 w-3 shrink-0 opacity-50" />}
                {crumb.href ? (
                  <Link
                    to={crumb.href}
                    className="hover:text-foreground transition-colors truncate max-w-[200px]"
                  >
                    {crumb.icon && <span className="mr-1">{crumb.icon}</span>}
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-foreground font-medium truncate">
                    {crumb.icon && <span className="mr-1">{crumb.icon}</span>}
                    {crumb.label}
                  </span>
                )}
              </span>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-1 shrink-0 ml-2">
            {/* Last updated */}
            {updatedAt && (
              <div className="flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground">
                <span>Edited {formatDistanceToNow(new Date(updatedAt), { addSuffix: true })}</span>
              </div>
            )}

            {/* Saving indicator */}
            {isUpdating && (
              <div className="flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Saving...</span>
              </div>
            )}

            {/* Lock button */}
            {isLocked && onTemporaryUnlockToggle && (
              <Button
                variant="ghost"
                size="icon"
                className={`h-7 w-7 ${temporaryUnlock ? 'text-green-500' : 'text-muted-foreground'}`}
                title={temporaryUnlock ? 'Document temporarily unlocked (click to lock again)' : 'Document locked (click to temporarily unlock)'}
                onClick={onTemporaryUnlockToggle}
              >
                {temporaryUnlock ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
              </Button>
            )}

            {/* Favorites button */}
            {onFavoriteToggle && (
              <Button
                variant="ghost"
                size="icon"
                className={'h-7 w-7 ' + (isFavorited ? 'text-amber-500' : '')}
                type="button"
                title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                onClick={onFavoriteToggle}
              >
                <Star className="h-4 w-4" fill={isFavorited ? 'currentColor' : 'none'} />
              </Button>
            )}

            {/* Version history button */}
            {onHistoryClick && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                title="Version history"
                onClick={onHistoryClick}
              >
                <History className="h-4 w-4" />
              </Button>
            )}

            {/* Settings button */}
            {onSettingsClick && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                title="Document settings"
                onClick={onSettingsClick}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Icon and Title row */}
        <div className="px-4 pb-3">
          <div
            className="mx-auto flex items-center gap-2 transition-all duration-200"
            style={{ maxWidth: contentMaxWidth, padding: '0 2rem' }}
          >
            <EmojiPicker value={icon} onChange={handleIconChange}>
              <button
                className="shrink-0 hover:bg-accent rounded p-1 transition-colors"
                title="Change icon"
              >
                <span className="text-2xl">{icon || '📄'}</span>
              </button>
            </EmojiPicker>
            <input
              type="text"
              value={localTitle}
              onChange={handleTitleChange}
              placeholder="Untitled"
              className="text-2xl font-bold bg-transparent border-none outline-none flex-1 placeholder:text-muted-foreground/50"
              disabled={!isEditable}
            />
          </div>
        </div>
      </div>

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

          {/* BlockNote Editor */}
          {isInitialized ? (
            <BlockNoteEditor
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
