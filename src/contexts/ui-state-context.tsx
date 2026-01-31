import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

const STORAGE_KEY = 'nexo_ui_state'

interface UIState {
  expandedDocuments: Record<string, string[]> // spaceId -> docIds[]
  expandedSpaces: string[] // space IDs that are expanded in sidebar
  favoritesExpanded: boolean
}

interface UIStateContextType {
  isDocumentExpanded: (spaceId: string, docId: string) => boolean
  toggleDocumentExpanded: (spaceId: string, docId: string) => void
  setDocumentExpanded: (spaceId: string, docId: string, expanded: boolean) => void
  favoritesExpanded: boolean
  setFavoritesExpanded: (expanded: boolean) => void
  isSpaceExpanded: (spaceId: string) => boolean
  toggleSpaceExpanded: (spaceId: string) => void
  isCommandPaletteOpen: boolean
  setCommandPaletteOpen: (open: boolean) => void
}

const defaultState: UIState = {
  expandedDocuments: {},
  expandedSpaces: [],
  favoritesExpanded: true,
}

const UIStateContext = createContext<UIStateContextType | undefined>(undefined)

export function UIStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<UIState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? { ...defaultState, ...JSON.parse(saved) } : defaultState
    } catch {
      return defaultState
    }
  })

  // Persist to localStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const isDocumentExpanded = (spaceId: string, docId: string): boolean => {
    return state.expandedDocuments[spaceId]?.includes(docId) ?? false
  }

  const toggleDocumentExpanded = (spaceId: string, docId: string) => {
    setState((prev) => {
      const spaceExpanded = prev.expandedDocuments[spaceId] || []
      const isExpanded = spaceExpanded.includes(docId)
      return {
        ...prev,
        expandedDocuments: {
          ...prev.expandedDocuments,
          [spaceId]: isExpanded
            ? spaceExpanded.filter((id) => id !== docId)
            : [...spaceExpanded, docId],
        },
      }
    })
  }

  const setDocumentExpanded = (spaceId: string, docId: string, expanded: boolean) => {
    setState((prev) => {
      const spaceExpanded = prev.expandedDocuments[spaceId] || []
      const isCurrentlyExpanded = spaceExpanded.includes(docId)

      if (expanded && !isCurrentlyExpanded) {
        return {
          ...prev,
          expandedDocuments: {
            ...prev.expandedDocuments,
            [spaceId]: [...spaceExpanded, docId],
          },
        }
      } else if (!expanded && isCurrentlyExpanded) {
        return {
          ...prev,
          expandedDocuments: {
            ...prev.expandedDocuments,
            [spaceId]: spaceExpanded.filter((id) => id !== docId),
          },
        }
      }
      return prev
    })
  }

  const setFavoritesExpanded = (expanded: boolean) => {
    setState((prev) => ({ ...prev, favoritesExpanded: expanded }))
  }

  const isSpaceExpanded = (spaceId: string): boolean => {
    return state.expandedSpaces.includes(spaceId)
  }

  const toggleSpaceExpanded = (spaceId: string) => {
    setState((prev) => {
      const isExpanded = prev.expandedSpaces.includes(spaceId)
      return {
        ...prev,
        expandedSpaces: isExpanded
          ? prev.expandedSpaces.filter((id) => id !== spaceId)
          : [...prev.expandedSpaces, spaceId],
      }
    })
  }

  // Transient state (not persisted)
  const [isCommandPaletteOpen, setCommandPaletteOpen] = useState(false)

  return (
    <UIStateContext.Provider
      value={{
        isDocumentExpanded,
        toggleDocumentExpanded,
        setDocumentExpanded,
        favoritesExpanded: state.favoritesExpanded,
        setFavoritesExpanded,
        isSpaceExpanded,
        toggleSpaceExpanded,
        isCommandPaletteOpen,
        setCommandPaletteOpen,
      }}
    >
      {children}
    </UIStateContext.Provider>
  )
}

export function useUIState() {
  const context = useContext(UIStateContext)
  if (context === undefined) {
    throw new Error('useUIState must be used within a UIStateProvider')
  }
  return context
}
