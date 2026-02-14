import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, useNavigate } from 'react-router-dom'
import { useDebouncedCallback } from 'use-debounce'
import { formatDistanceToNow } from 'date-fns'
import { useLanguage } from '@/i18n/LanguageContext'
import { MainLayout } from '@/components/layout/main-layout'
import { DocumentEditor } from '@/components/document/document-editor'
import { OpenBlockEditor, OpenBlockContent } from '@/components/editor/openblock-editor'
import { DocumentSettingsSidebar } from '@/components/document/document-settings-sidebar'
import { VersionHistorySidebar } from '@/components/document/version-history-sidebar'
import { CreateDatabaseModal } from '@/components/database/common/create-database-modal'
import { useQueryClient } from '@tanstack/react-query'
import { useDocument, useUpdateDocument } from '@/hooks/use-documents'
import { useFavorites, useAddFavorite, useRemoveFavorite } from '@/hooks/use-favorites'
import { useVersion, useRestoreVersion } from '@/hooks/use-versions'
import { Button } from '@/components/ui/button'
import { Loader2, X, RotateCcw } from 'lucide-react'
import type { IconValue } from '@/components/ui/icon-picker'
import { parseStoredIcon, serializeIcon } from '@/lib/utils'

export function DocumentPage() {
  const { t } = useTranslation('document')
  const { dateFnsLocale } = useLanguage()
  const { spaceId, slug } = useParams<{ spaceId: string; slug: string }>()
  const navigate = useNavigate()

  const queryClient = useQueryClient()
  const { data: document, isLoading, error } = useDocument(spaceId, slug)
  const { mutate: updateDocument } = useUpdateDocument()
  const { data: favorites = [] } = useFavorites()
  const { mutate: addFavorite } = useAddFavorite()
  const { mutate: removeFavorite } = useRemoveFavorite()

  // Flag to skip state reset when slug changes due to title edit (same document)
  const slugChangedFromTitleEdit = useRef(false)

  const [content, setContent] = useState<OpenBlockContent | null>(null)
  const [title, setTitle] = useState('')
  const [icon, setIcon] = useState<IconValue>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [isSettingsSidebarOpen, setIsSettingsSidebarOpen] = useState(false)
  const [isVersionSidebarOpen, setIsVersionSidebarOpen] = useState(false)
  const [initializedDocId, setInitializedDocId] = useState<string | null>(null)
  const [initializedSlug, setInitializedSlug] = useState<string | null>(null)
  const [temporaryUnlock, setTemporaryUnlock] = useState(false)
  const [isLocked, setIsLocked] = useState(false)
  const [isFullWidth, setIsFullWidth] = useState(false)
  const [comparingVersionId, setComparingVersionId] = useState<string | null>(null)
  const [isCreateDatabaseModalOpen, setIsCreateDatabaseModalOpen] = useState(false)
  const [pendingDatabaseBlockId, setPendingDatabaseBlockId] = useState<string | null>(null)

  // Refs for synchronized scrolling
  const leftScrollRef = useRef<HTMLDivElement>(null)
  const rightScrollRef = useRef<HTMLDivElement>(null)
  const isScrolling = useRef(false)

  // Fetch version for comparison
  const docIdForVersion = (document as any)?.id || (document as any)?.document
  const { data: comparingVersion, isLoading: isLoadingVersion } = useVersion(
    spaceId,
    docIdForVersion,
    comparingVersionId || undefined
  )
  const { mutateAsync: restoreVersion, isPending: isRestoring } = useRestoreVersion()

  // Synchronized scroll handler
  const handleScroll = useCallback((source: 'left' | 'right') => {
    if (isScrolling.current) return
    isScrolling.current = true

    const sourceRef = source === 'left' ? leftScrollRef : rightScrollRef
    const targetRef = source === 'left' ? rightScrollRef : leftScrollRef

    if (sourceRef.current && targetRef.current) {
      const scrollPercentage = sourceRef.current.scrollTop /
        (sourceRef.current.scrollHeight - sourceRef.current.clientHeight)
      const targetScrollTop = scrollPercentage *
        (targetRef.current.scrollHeight - targetRef.current.clientHeight)
      targetRef.current.scrollTop = targetScrollTop
    }

    requestAnimationFrame(() => {
      isScrolling.current = false
    })
  }, [])

  // Listen for create database events from OpenBlock database blocks
  useEffect(() => {
    const handleCreateDatabase = (event: CustomEvent<{ blockId: string }>) => {
      setPendingDatabaseBlockId(event.detail.blockId)
      setIsCreateDatabaseModalOpen(true)
    }

    window.addEventListener('openblock:createDatabase', handleCreateDatabase as EventListener)
    return () => {
      window.removeEventListener('openblock:createDatabase', handleCreateDatabase as EventListener)
    }
  }, [])

  // Reset initialized state when navigating to a different document
  // Skip reset when slug changes due to a title edit (same document, new slug)
  useEffect(() => {
    if (slugChangedFromTitleEdit.current) {
      slugChangedFromTitleEdit.current = false
      return
    }
    setInitializedDocId(null)
    setInitializedSlug(null)
    setContent(null)
    setTitle('')
    setIcon(null)
    setTemporaryUnlock(false)
    setIsLocked(false)
    setIsFullWidth(false)
    setComparingVersionId(null)
  }, [slug])

  // Initialize content, title, and icon when document loads for the FIRST time
  useEffect(() => {
    if (!document || isLoading) return

    const docId = (document as any).id || (document as any).document
    if (!docId) return

    // Verify the document matches the current URL before initializing
    // This prevents using stale cached data from a previous document
    const docSlug = (document as any).slug
    if (docSlug && docSlug !== slug) return

    // Only initialize once per document
    if (initializedDocId === docId) return

    const docContent = document.content as OpenBlockContent | null | undefined

    // Only initialize if we have content OR if content is explicitly empty array
    // This prevents initializing with stale/empty data from list endpoints
    if (docContent !== undefined) {
      // Use empty array for empty documents (not null) to signal "ready but empty"
      setContent(docContent || [])
      setTitle(document.name || '')
      setIcon(parseStoredIcon(document.config?.icon))
      setIsLocked(document.config?.lock || false)
      setIsFullWidth((document.config as any)?.full_width || false)
      setInitializedDocId(docId)
      setInitializedSlug(slug || null)
    }
  }, [document, isLoading, initializedDocId, slug])

  // Debounced save function for content
  const debouncedSaveContent = useDebouncedCallback(
    (newContent: OpenBlockContent) => {
      if (!spaceId || !slug || !document) return
      const docId = (document as any).id || document.document
      if (!docId) return

      setIsUpdating(true)
      updateDocument(
        {
          spaceId,
          id: docId,
          content: newContent as any,
        },
        {
          onSuccess: () => {
            setIsUpdating(false)
            setSaveError(null)
          },
          onError: () => {
            setIsUpdating(false)
            setSaveError(t('saveFailed'))
          },
        }
      )
    },
    800
  )

  // Debounced save function for name
  const debouncedSaveName = useDebouncedCallback(
    (name: string) => {
      if (!spaceId || !slug || !document) return
      const docId = (document as any).id || document.document
      if (!docId) return

      setIsUpdating(true)
      updateDocument(
        {
          spaceId,
          id: docId,
          slug,
          name,
        },
        {
          onSuccess: (data) => {
            setIsUpdating(false)
            setSaveError(null)
            // Navigate to new slug if it changed
            const newSlug = (data as any)?.slug
            if (newSlug && newSlug !== slug) {
              // Pre-populate cache for the new slug so there's no loading flash
              queryClient.setQueryData(['document', spaceId, newSlug], data)
              // Update initializedSlug so isInitialized stays true
              setInitializedSlug(newSlug)
              // Flag to prevent the state reset effect from clearing editor state
              slugChangedFromTitleEdit.current = true
              navigate(`/space/${spaceId}/${newSlug}`, { replace: true })
            }
          },
          onError: () => {
            setIsUpdating(false)
            setSaveError(t('saveFailed'))
          },
        }
      )
    },
    800
  )

  // Save function for config changes (immediate for lock, debounced for others)
  const saveConfig = (configUpdates: Partial<{ icon: string; fullWidth: boolean; lock: boolean }>) => {
    if (!spaceId || !slug || !document) return
    const docId = (document as any).id || document.document
    if (!docId) return

    // Update local state immediately for responsive UI
    if (configUpdates.lock !== undefined) {
      setIsLocked(configUpdates.lock)
    }
    if (configUpdates.fullWidth !== undefined) {
      setIsFullWidth(configUpdates.fullWidth)
    }

    setIsUpdating(true)
    // Convert config to snake_case for API
    const apiConfig: any = { ...(document.config || {}) }
    if (configUpdates.icon !== undefined) apiConfig.icon = configUpdates.icon
    if (configUpdates.lock !== undefined) apiConfig.lock = configUpdates.lock
    if (configUpdates.fullWidth !== undefined) apiConfig.full_width = configUpdates.fullWidth
    updateDocument(
      {
        spaceId,
        id: docId,
        slug,
        config: apiConfig,
      },
      {
        onSuccess: () => {
          setIsUpdating(false)
          setSaveError(null)
        },
        onError: () => {
          setIsUpdating(false)
          setSaveError(t('saveFailed'))
          // Revert state on error
          if (configUpdates.lock !== undefined) {
            setIsLocked(!configUpdates.lock)
          }
          if (configUpdates.fullWidth !== undefined) {
            setIsFullWidth(!configUpdates.fullWidth)
          }
        },
      }
    )
  }

  const debouncedSaveConfig = useDebouncedCallback(saveConfig, 800)

  // Handle content changes from OpenBlock editor
  const handleContentChange = (newContent: OpenBlockContent) => {
    setContent(newContent)
    debouncedSaveContent(newContent)
  }

  // Handle title changes
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle)
    debouncedSaveName(newTitle)
  }

<<<<<<< HEAD
  // Handle icon changes
  const handleIconChange = (newIcon: IconValue) => {
    setIcon(newIcon)
    debouncedSaveConfig({ icon: serializeIcon(newIcon) })
=======
  // Handle icon changes (immediate save, no debounce — icon is a discrete click)
  const handleIconChange = (newIcon: IconValue) => {
    setIcon(newIcon)
    saveConfig({ icon: serializeIcon(newIcon) })
>>>>>>> d4609d4 (feat: add hooks for managing spaces, users, versions, and webhooks)
  }

  // Try to get document ID from various possible locations
  const currentDocId = (document as any)?.document ||
                       (document as any)?.id ||
                       slug?.split('-').pop() ||
                       ''

  // Find if current document is in favorites
  const currentFavorite = favorites.find((f: any) => {
    const favDocId = f?.document?.id
    if (favDocId && favDocId === currentDocId) return true
    const favDocSlug = f?.document?.slug
    if (favDocSlug && favDocSlug === slug) return true
    return false
  })
  const isFavorited = !!currentFavorite

  // Handle favorite toggle
  const handleFavoriteToggle = () => {
    if (!spaceId || !currentDocId) return
    if (isFavorited) {
      removeFavorite(currentFavorite.id as string)
    } else {
      addFavorite({ spaceId, documentId: currentDocId })
    }
  }

  // Build breadcrumbs
  const parent = (document as any)?.parent
  const space = (document as any)?.space

  const breadcrumbs = useMemo(() => {
    const crumbs = []
    if (space) {
      crumbs.push({
        label: space.name,
        href: `/space/${spaceId}`,
      })
    }
    if (parent) {
      crumbs.push({
        label: parent.name || t('untitled'),
        href: `/space/${spaceId}/${parent.slug}`,
      })
    }
    crumbs.push({
      label: title || t('untitled'),
    })
    return crumbs
  }, [space, parent, spaceId, title, t])

  // Version comparison panel
  const comparisonPanel = comparingVersionId ? (
    <div className="flex-1 flex flex-col border-l bg-muted/10">
      {/* Comparison header */}
      <div className="flex items-center justify-between p-3 border-b bg-muted/30 shrink-0">
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium">
            Version {comparingVersion?.version}
            {comparingVersion?.name && ` - ${comparingVersion.name}`}
          </div>
          <div className="text-xs text-muted-foreground">
            {comparingVersion?.created_at && formatDistanceToNow(new Date(comparingVersion.created_at), {
              addSuffix: true,
              locale: dateFnsLocale,
            })}
            {comparingVersion?.user_name && ` by ${comparingVersion.user_name}`}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="default"
            size="sm"
            onClick={async () => {
              if (!spaceId || !currentDocId || !comparingVersionId) return
              if (!window.confirm(t('versionRestore', { version: comparingVersion?.version }))) return
              try {
                await restoreVersion({ spaceId, documentId: currentDocId, versionId: comparingVersionId })
                setComparingVersionId(null)
              } catch (error) {
                console.error('Failed to restore version:', error)
              }
            }}
            disabled={isRestoring}
            className="gap-2"
          >
            {isRestoring ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RotateCcw className="h-4 w-4" />
            )}
            {t('restoreButton')}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setComparingVersionId(null)}
            title={t('closeComparison')}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Version content */}
      <div
        ref={rightScrollRef}
        className="flex-1 overflow-auto"
        onScroll={() => handleScroll('right')}
      >
        {isLoadingVersion ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <OpenBlockEditor
            content={comparingVersion?.content as OpenBlockContent}
            onChange={() => {}}
            editable={false}
          />
        )}
      </div>
    </div>
  ) : null

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </MainLayout>
    )
  }

  if (error || !document) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-full gap-4 p-8">
          <h1 className="text-2xl font-bold text-destructive">{t('notFound')}</h1>
          <p className="text-muted-foreground">
            {t('notFoundDescription')}
          </p>
          <Button onClick={() => navigate('/')} variant="outline">
            {t('common:goBackHome')}
          </Button>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <DocumentEditor
        key={currentDocId}
        documentId={currentDocId}
        title={title}
        icon={icon}
        content={content}
        isLoading={false}
        isUpdating={isUpdating}
        onTitleChange={handleTitleChange}
        onIconChange={handleIconChange}
        onContentChange={handleContentChange}
        breadcrumbs={breadcrumbs}
        updatedAt={(document as any).updated_at}
        isFavorited={isFavorited}
        onFavoriteToggle={handleFavoriteToggle}
        isLocked={isLocked}
        temporaryUnlock={temporaryUnlock}
        onTemporaryUnlockToggle={() => setTemporaryUnlock(!temporaryUnlock)}
        isFullWidth={isFullWidth && !comparingVersionId}
        onSettingsClick={() => setIsSettingsSidebarOpen(true)}
        onHistoryClick={() => setIsVersionSidebarOpen(true)}
        saveError={saveError}
        comparisonPanel={comparisonPanel}
        isInitialized={!!initializedDocId && initializedSlug === slug}
      />

      {/* Settings Sidebar */}
      <DocumentSettingsSidebar
        isOpen={isSettingsSidebarOpen}
        onClose={() => setIsSettingsSidebarOpen(false)}
        document={document as any}
        isLocked={isLocked}
        isFullWidth={isFullWidth}
        onIconChange={handleIconChange}
        onConfigChange={(configUpdates) => {
          // Use immediate save for lock/fullWidth changes, debounced for others
          if (configUpdates.lock !== undefined || configUpdates.fullWidth !== undefined) {
            saveConfig(configUpdates)
          } else {
            debouncedSaveConfig(configUpdates)
          }
        }}
        isUpdating={isUpdating}
      />

      {/* Version History Sidebar */}
      <VersionHistorySidebar
        isOpen={isVersionSidebarOpen}
        onClose={() => setIsVersionSidebarOpen(false)}
        spaceId={spaceId}
        documentId={currentDocId}
        onCompare={(versionId) => {
          // Toggle comparison - if same version clicked, close it
          setComparingVersionId(prev => prev === versionId ? null : versionId)
        }}
        comparingVersionId={comparingVersionId}
      />

      {/* Create Database Modal (triggered from database blocks in editor) */}
      {spaceId && (
        <CreateDatabaseModal
          open={isCreateDatabaseModalOpen}
          onOpenChange={(open) => {
            setIsCreateDatabaseModalOpen(open)
            if (!open) setPendingDatabaseBlockId(null)
          }}
          spaceId={spaceId}
          documentId={currentDocId}
          onSuccess={(databaseId) => {
            // Dispatch event to update the database block with the new database ID
            if (pendingDatabaseBlockId) {
              window.dispatchEvent(
                new CustomEvent('openblock:databaseCreated', {
                  detail: { blockId: pendingDatabaseBlockId, databaseId },
                })
              )
            }
            setPendingDatabaseBlockId(null)
          }}
        />
      )}
    </MainLayout>
  )
}
