import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react'

const STORAGE_KEY = 'nexo_doc_expansion'

interface DocumentExpansionState {
  expandedDocuments: Record<string, string[]> // spaceId -> docIds[]
}

interface DocumentExpansionContextType {
  isDocumentExpanded: (spaceId: string, docId: string) => boolean
  toggleDocumentExpanded: (spaceId: string, docId: string) => void
  setDocumentExpanded: (spaceId: string, docId: string, expanded: boolean) => void
}

const defaultState: DocumentExpansionState = {
  expandedDocuments: {},
}

const DocumentExpansionContext = createContext<DocumentExpansionContextType | undefined>(undefined)

export function DocumentExpansionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DocumentExpansionState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) return { ...defaultState, ...JSON.parse(saved) }
      // Migrate from the old monolithic key
      const legacy = localStorage.getItem('nexo_ui_state')
      if (legacy) {
        const parsed = JSON.parse(legacy)
        if (parsed.expandedDocuments) return { expandedDocuments: parsed.expandedDocuments }
      }
      return defaultState
    } catch {
      return defaultState
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const isDocumentExpanded = useCallback((spaceId: string, docId: string): boolean => {
    return state.expandedDocuments[spaceId]?.includes(docId) ?? false
  }, [state.expandedDocuments])

  const toggleDocumentExpanded = useCallback((spaceId: string, docId: string) => {
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
  }, [])

  const setDocumentExpanded = useCallback((spaceId: string, docId: string, expanded: boolean) => {
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
  }, [])

  const value = useMemo(() => ({
    isDocumentExpanded,
    toggleDocumentExpanded,
    setDocumentExpanded,
  }), [
    isDocumentExpanded,
    toggleDocumentExpanded,
    setDocumentExpanded,
  ])

  return (
    <DocumentExpansionContext.Provider value={value}>
      {children}
    </DocumentExpansionContext.Provider>
  )
}

export function useDocumentExpansion() {
  const context = useContext(DocumentExpansionContext)
  if (context === undefined) {
    throw new Error('useDocumentExpansion must be used within a DocumentExpansionProvider')
  }
  return context
}
