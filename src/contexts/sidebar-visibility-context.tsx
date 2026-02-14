<<<<<<< HEAD
import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
=======
import { createContext, useContext, useState, useCallback, useMemo, ReactNode, useEffect } from 'react'
>>>>>>> d4609d4 (feat: add hooks for managing spaces, users, versions, and webhooks)

interface SidebarVisibilityContextType {
  areSidebarsVisible: boolean
  isTemporarilyVisible: boolean
  toggleSidebars: () => void
  showTemporarily: () => void
  hideTemporarily: () => void
}

const SidebarVisibilityContext = createContext<SidebarVisibilityContextType | undefined>(undefined)

export function SidebarVisibilityProvider({ children }: { children: ReactNode }) {
  // Load initial visibility from localStorage (default: true)
  const [areSidebarsVisible, setAreSidebarsVisible] = useState(() => {
    const saved = localStorage.getItem('sidebars_visible')
    return saved === null ? true : saved === 'true'
  })

  const [isTemporarilyVisible, setIsTemporarilyVisible] = useState(false)

  // Save to localStorage when visibility changes
  useEffect(() => {
    localStorage.setItem('sidebars_visible', areSidebarsVisible.toString())
  }, [areSidebarsVisible])

<<<<<<< HEAD
  const toggleSidebars = () => {
    setAreSidebarsVisible((prev) => !prev)
    setIsTemporarilyVisible(false) // Reset temporary state
  }

  const showTemporarily = () => {
    // Only show temporarily if sidebars are hidden
    if (!areSidebarsVisible) {
      setIsTemporarilyVisible(true)
    }
  }

  const hideTemporarily = () => {
    setIsTemporarilyVisible(false)
  }

  return (
    <SidebarVisibilityContext.Provider
      value={{
        areSidebarsVisible,
        isTemporarilyVisible,
        toggleSidebars,
        showTemporarily,
        hideTemporarily,
      }}
    >
=======
  const toggleSidebars = useCallback(() => {
    setAreSidebarsVisible((prev) => !prev)
    setIsTemporarilyVisible(false) // Reset temporary state
  }, [])

  const showTemporarily = useCallback(() => {
    setAreSidebarsVisible((current) => {
      if (!current) setIsTemporarilyVisible(true)
      return current
    })
  }, [])

  const hideTemporarily = useCallback(() => {
    setIsTemporarilyVisible(false)
  }, [])

  const value = useMemo(() => ({
    areSidebarsVisible,
    isTemporarilyVisible,
    toggleSidebars,
    showTemporarily,
    hideTemporarily,
  }), [areSidebarsVisible, isTemporarilyVisible, toggleSidebars, showTemporarily, hideTemporarily])

  return (
    <SidebarVisibilityContext.Provider value={value}>
>>>>>>> d4609d4 (feat: add hooks for managing spaces, users, versions, and webhooks)
      {children}
    </SidebarVisibilityContext.Provider>
  )
}

export function useSidebarVisibility() {
  const context = useContext(SidebarVisibilityContext)
  if (!context) {
    throw new Error('useSidebarVisibility must be used within SidebarVisibilityProvider')
  }
  return context
}
