import { createContext, useContext, useState, ReactNode } from 'react'
import type { AppId } from '@/types/apps'

const STORAGE_KEY = 'nexo_active_app'

interface ActiveAppContextType {
  activeApp: AppId
  setActiveApp: (app: AppId) => void
}

const ActiveAppContext = createContext<ActiveAppContextType | undefined>(undefined)

export function ActiveAppProvider({ children }: { children: ReactNode }) {
  const [activeApp, setActiveAppState] = useState<AppId>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved === 'docs' || saved === 'projects') return saved
    } catch {
      // ignore
    }
    return 'docs'
  })

  const setActiveApp = (app: AppId) => {
    setActiveAppState(app)
    localStorage.setItem(STORAGE_KEY, app)
  }

  return (
    <ActiveAppContext.Provider value={{ activeApp, setActiveApp }}>
      {children}
    </ActiveAppContext.Provider>
  )
}

export function useActiveApp() {
  const context = useContext(ActiveAppContext)
  if (context === undefined) {
    throw new Error('useActiveApp must be used within an ActiveAppProvider')
  }
  return context
}
