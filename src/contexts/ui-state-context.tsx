<<<<<<< HEAD
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
=======
/**
 * UIStateContext — backward-compatibility shim.
 *
 * The original monolithic context has been split into three focused contexts:
 *   - DocumentExpansionContext  (expanded document tree nodes)
 *   - SidebarUIContext          (expanded spaces, favorites toggle)
 *   - CommandPaletteContext     (command palette open/close)
 *
 * This file re-exports the three providers composed into one `UIStateProvider`
 * and a `useUIState()` hook that merges all three for any consumers that have
 * not yet been migrated to the new granular hooks.
 */

import type { ReactNode } from 'react'
import { DocumentExpansionProvider, useDocumentExpansion } from './document-expansion-context'
import { SidebarUIProvider, useSidebarUI } from './sidebar-ui-context'
import { CommandPaletteProvider, useCommandPalette } from './command-palette-context'

export function UIStateProvider({ children }: { children: ReactNode }) {
  return (
    <DocumentExpansionProvider>
      <SidebarUIProvider>
        <CommandPaletteProvider>
          {children}
        </CommandPaletteProvider>
      </SidebarUIProvider>
    </DocumentExpansionProvider>
  )
}

/**
 * @deprecated Use the granular hooks instead:
 *   - `useDocumentExpansion()` for isDocumentExpanded / toggleDocumentExpanded / setDocumentExpanded
 *   - `useSidebarUI()` for isSpaceExpanded / toggleSpaceExpanded / favoritesExpanded / setFavoritesExpanded
 *   - `useCommandPalette()` for isCommandPaletteOpen / setCommandPaletteOpen
 */
export function useUIState() {
  const docExpansion = useDocumentExpansion()
  const sidebarUI = useSidebarUI()
  const commandPalette = useCommandPalette()

  return {
    ...docExpansion,
    ...sidebarUI,
    ...commandPalette,
  }
>>>>>>> d4609d4 (feat: add hooks for managing spaces, users, versions, and webhooks)
}
