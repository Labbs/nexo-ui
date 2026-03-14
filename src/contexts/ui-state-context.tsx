/* eslint-disable react-refresh/only-export-components */
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
}
