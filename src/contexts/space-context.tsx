import { createContext, useContext, useState, ReactNode, useMemo, useCallback, useEffect } from 'react'
import type { components } from '@/api/types'
import { useSpaces } from '@/hooks/use-spaces'

type Space = components['schemas']['Space']

// Roles that can create/edit content
const EDIT_ROLES = ['owner', 'admin', 'editor']

interface SpaceContextType {
  currentSpace: Space | null
  setCurrentSpace: (space: Space | null) => void
  canEdit: boolean // Whether the current user can create/edit content in the current space
}

const SpaceContext = createContext<SpaceContextType | undefined>(undefined)

export function SpaceProvider({ children }: { children: ReactNode }) {
  const { data: spaces = [] } = useSpaces()
  const [currentSpaceId, setCurrentSpaceId] = useState<string | null>(() => {
    const saved = localStorage.getItem('current_space')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        return parsed?.id || null
      } catch {
        return null
      }
    }
    return null
  })

  // Get the current space from the fresh spaces data (includes my_role)
  const currentSpace = useMemo(() => {
    if (!currentSpaceId || spaces.length === 0) return null
    return spaces.find((s: Space) => s.id === currentSpaceId) || null
  }, [currentSpaceId, spaces])

  // Sync localStorage when currentSpace changes
  useEffect(() => {
    if (currentSpace) {
      localStorage.setItem('current_space', JSON.stringify(currentSpace))
    }
  }, [currentSpace])

  const setCurrentSpace = useCallback((space: Space | null) => {
    if (space) {
      setCurrentSpaceId(space.id || null)
      localStorage.setItem('current_space', JSON.stringify(space))
    } else {
      setCurrentSpaceId(null)
      localStorage.removeItem('current_space')
    }
  }, [])

  // Check if user can edit content in the current space based on their role
  const canEdit = useMemo(() => {
    if (!currentSpace?.my_role) return false
    return EDIT_ROLES.includes(currentSpace.my_role)
  }, [currentSpace?.my_role])

  const value = useMemo(() => ({
    currentSpace, setCurrentSpace, canEdit
  }), [currentSpace, setCurrentSpace, canEdit])

  return (
    <SpaceContext.Provider value={value}>
      {children}
    </SpaceContext.Provider>
  )
}

export function useCurrentSpace() {
  const context = useContext(SpaceContext)
  if (context === undefined) {
    throw new Error('useCurrentSpace must be used within a SpaceProvider')
  }
  return context
}
