/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react'

interface CommandPaletteContextType {
  isCommandPaletteOpen: boolean
  setCommandPaletteOpen: (open: boolean) => void
}

const CommandPaletteContext = createContext<CommandPaletteContextType | undefined>(undefined)

export function CommandPaletteProvider({ children }: { children: ReactNode }) {
  const [isCommandPaletteOpen, setOpen] = useState(false)

  const setCommandPaletteOpen = useCallback((open: boolean) => {
    setOpen(open)
  }, [])

  const value = useMemo(() => ({
    isCommandPaletteOpen,
    setCommandPaletteOpen,
  }), [isCommandPaletteOpen, setCommandPaletteOpen])

  return (
    <CommandPaletteContext.Provider value={value}>
      {children}
    </CommandPaletteContext.Provider>
  )
}

export function useCommandPalette() {
  const context = useContext(CommandPaletteContext)
  if (context === undefined) {
    throw new Error('useCommandPalette must be used within a CommandPaletteProvider')
  }
  return context
}
