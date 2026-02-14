import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react'

const STORAGE_KEY = 'nexo_sidebar_ui'

interface SidebarUIState {
  expandedSpaces: string[]
  favoritesExpanded: boolean
}

interface SidebarUIContextType {
  isSpaceExpanded: (spaceId: string) => boolean
  toggleSpaceExpanded: (spaceId: string) => void
  favoritesExpanded: boolean
  setFavoritesExpanded: (expanded: boolean) => void
}

const defaultState: SidebarUIState = {
  expandedSpaces: [],
  favoritesExpanded: true,
}

const SidebarUIContext = createContext<SidebarUIContextType | undefined>(undefined)

export function SidebarUIProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SidebarUIState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) return { ...defaultState, ...JSON.parse(saved) }
      // Migrate from the old monolithic key
      const legacy = localStorage.getItem('nexo_ui_state')
      if (legacy) {
        const parsed = JSON.parse(legacy)
        return {
          expandedSpaces: parsed.expandedSpaces ?? defaultState.expandedSpaces,
          favoritesExpanded: parsed.favoritesExpanded ?? defaultState.favoritesExpanded,
        }
      }
      return defaultState
    } catch {
      return defaultState
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const isSpaceExpanded = useCallback((spaceId: string): boolean => {
    return state.expandedSpaces.includes(spaceId)
  }, [state.expandedSpaces])

  const toggleSpaceExpanded = useCallback((spaceId: string) => {
    setState((prev) => {
      const isExpanded = prev.expandedSpaces.includes(spaceId)
      return {
        ...prev,
        expandedSpaces: isExpanded
          ? prev.expandedSpaces.filter((id) => id !== spaceId)
          : [...prev.expandedSpaces, spaceId],
      }
    })
  }, [])

  const setFavoritesExpanded = useCallback((expanded: boolean) => {
    setState((prev) => ({ ...prev, favoritesExpanded: expanded }))
  }, [])

  const value = useMemo(() => ({
    isSpaceExpanded,
    toggleSpaceExpanded,
    favoritesExpanded: state.favoritesExpanded,
    setFavoritesExpanded,
  }), [
    isSpaceExpanded,
    toggleSpaceExpanded,
    state.favoritesExpanded,
    setFavoritesExpanded,
  ])

  return (
    <SidebarUIContext.Provider value={value}>
      {children}
    </SidebarUIContext.Provider>
  )
}

export function useSidebarUI() {
  const context = useContext(SidebarUIContext)
  if (context === undefined) {
    throw new Error('useSidebarUI must be used within a SidebarUIProvider')
  }
  return context
}
