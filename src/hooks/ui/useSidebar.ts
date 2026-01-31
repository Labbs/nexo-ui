import { useState, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTheme } from 'next-themes'
import { useCurrentSpace } from '@/contexts/space-context'
import { useDocuments, useCreateDocument } from '@/hooks/use-documents'
import { useCreateDrawing } from '@/hooks/use-drawings'
import { useCreateDatabase, type DatabaseType } from '@/hooks/use-database'
import { useFavorites } from '@/hooks/use-favorites'
import { useSpaces } from '@/hooks/use-spaces'
import { useToast } from '@/components/ui/toaster'
import { useAuth } from '@/contexts/auth-context'
import { useMediaQuery } from '@/hooks/use-media-query'
import { useResizable } from '@/hooks/use-resizable'
import { useSidebarVisibility } from '@/contexts/sidebar-visibility-context'
import { useUIState } from '@/contexts/ui-state-context'

// Types for space (matching API response)
export interface Space {
  id?: string
  name?: string
  icon?: string
  icon_color?: string
}

// Types for document
export interface Document {
  id?: string
  name?: string
  slug?: string
  parent_id?: string
  config?: {
    icon?: string
  }
}

// Types for favorite
export interface Favorite {
  id: string
  document?: Document
}

/**
 * Hook that encapsulates all sidebar logic.
 * Returns state and actions for the UI to consume.
 */
export function useSidebar() {
  const navigate = useNavigate()
  const { slug } = useParams<{ slug?: string }>()
  const { currentSpace, setCurrentSpace, canEdit } = useCurrentSpace()
  const { data: spaces = [] } = useSpaces()
  const { data: documents = [], isLoading: isLoadingDocs } = useDocuments(currentSpace?.id)
  const { mutateAsync: createDocument } = useCreateDocument()
  const { mutateAsync: createDrawing } = useCreateDrawing()
  const { mutateAsync: createDatabase } = useCreateDatabase()
  const { data: favorites = [], isLoading: isLoadingFavs } = useFavorites()
  const { show } = useToast()
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const { toggleSidebars } = useSidebarVisibility()
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const { width, isResizing, handleMouseDown } = useResizable({
    minWidth: 200,
    maxWidthVw: 33,
    defaultWidth: 256,
  })

  // Filter root documents (no parent)
  const rootDocuments = documents.filter((doc) => !(doc as Document).parent_id)

  // Local UI state
  const [isEditSpaceOpen, setIsEditSpaceOpen] = useState(false)
  const { favoritesExpanded, setFavoritesExpanded } = useUIState()

  // Toggle theme
  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, [theme, setTheme])

  // Handle space change
  const handleSpaceChange = useCallback((space: Space) => {
    setCurrentSpace(space)
    navigate(`/space/${space.id}`)
  }, [setCurrentSpace, navigate])

  // Handle create document
  const handleCreateDocument = useCallback(async () => {
    if (!currentSpace?.id) return
    try {
      const doc = await createDocument({ spaceId: currentSpace.id })
      const docSlug = (doc as Document).slug
      if (docSlug) navigate(`/space/${currentSpace.id}/${docSlug}`)
    } catch {
      show({ title: 'Failed to create page', variant: 'destructive' })
    }
  }, [currentSpace?.id, createDocument, navigate, show])

  // Handle create drawing (directly without modal)
  const handleCreateDrawing = useCallback(async (documentId?: string) => {
    if (!currentSpace?.id) return
    try {
      const result = await createDrawing({
        spaceId: currentSpace.id,
        documentId,
        name: 'Untitled Drawing',
        elements: [],
        appState: {},
        files: {},
      })
      if (result.id) navigate(`/space/${currentSpace.id}/drawing/${result.id}`)
    } catch {
      show({ title: 'Failed to create drawing', variant: 'destructive' })
    }
  }, [currentSpace?.id, createDrawing, navigate, show])

  // Handle create database (directly without modal)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleCreateDatabaseOrSpreadsheet = useCallback(async (_type: DatabaseType, documentId?: string) => {
    if (!currentSpace?.id) return
    try {
      const result = await createDatabase({
        spaceId: currentSpace.id,
        documentId,
        name: 'Untitled Database',
        icon: '📚',
        schema: [{ id: 'title', name: 'Title', type: 'title' }],
        type: 'document',
      })
      if (result.id) navigate(`/space/${currentSpace.id}/database/${result.id}`)
    } catch {
      show({ title: 'Failed to create database', variant: 'destructive' })
    }
  }, [currentSpace?.id, createDatabase, navigate, show])

  // Handle favorite click
  const handleFavoriteClick = useCallback((favorite: Favorite) => {
    const doc = favorite.document
    const docSlug = doc?.slug
    if (currentSpace?.id && docSlug) {
      navigate(`/space/${currentSpace.id}/${docSlug}`)
    }
  }, [currentSpace?.id, navigate])

  // Handle database creation success
  const handleDatabaseCreated = useCallback((databaseId: string) => {
    if (currentSpace?.id) {
      navigate(`/space/${currentSpace.id}/database/${databaseId}`)
    }
  }, [currentSpace?.id, navigate])

  // Handle drawing creation success
  const handleDrawingCreated = useCallback((drawingId: string) => {
    if (currentSpace?.id) {
      navigate(`/space/${currentSpace.id}/drawing/${drawingId}`)
    }
  }, [currentSpace?.id, navigate])

  // Navigate to settings
  const navigateToSettings = useCallback(() => {
    navigate('/user/settings')
  }, [navigate])

  // Navigate to admin
  const navigateToAdmin = useCallback(() => {
    navigate('/admin')
  }, [navigate])

  // Check if a favorite is active
  const isFavoriteActive = useCallback((favorite: Favorite) => {
    const docSlug = favorite.document?.slug
    return !!(docSlug && slug === docSlug)
  }, [slug])

  return {
    // Navigation & routing
    navigate,
    slug,

    // Space data
    currentSpace: currentSpace as Space | null,
    spaces: spaces as Space[],
    canEdit,

    // Documents
    documents: documents as Document[],
    rootDocuments: rootDocuments as Document[],
    isLoadingDocs,

    // Favorites
    favorites: favorites as Favorite[],
    isLoadingFavs,
    favoritesExpanded,
    setFavoritesExpanded,
    isFavoriteActive,
    handleFavoriteClick,

    // User & auth
    user,
    logout,
    isAdmin: user?.role === 'admin',

    // Theme
    theme,
    isDarkMode: theme === 'dark',
    toggleTheme,

    // Sidebar visibility & resize
    toggleSidebars,
    isDesktop,
    width,
    isResizing,
    handleMouseDown,

    // Modals
    isEditSpaceOpen,
    setIsEditSpaceOpen,

    // Actions
    handleSpaceChange,
    handleCreateDocument,
    handleCreateDrawing,
    handleCreateDatabaseOrSpreadsheet,
    handleDatabaseCreated,
    handleDrawingCreated,
    navigateToSettings,
    navigateToAdmin,

    // Toast
    showToast: show,
  }
}
