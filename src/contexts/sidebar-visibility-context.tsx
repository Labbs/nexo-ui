import { createContext, useContext, useState, ReactNode, useEffect } from 'react'

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
