import { useState } from 'react'
import { Sidebar } from './sidebar'
import { MobileHeader } from './mobile-header'
import { CreateSpaceModal } from '@/components/spaces/create-space-modal'
import { CommandPalette } from '@/components/sidebar/command-palette'
import { useMediaQuery } from '@/hooks/use-media-query'
import { useSidebarVisibility, SidebarVisibilityProvider } from '@/contexts/sidebar-visibility-context'
<<<<<<< HEAD
import { useUIState } from '@/contexts/ui-state-context'
=======
import { useCommandPalette } from '@/contexts/command-palette-context'
>>>>>>> d4609d4 (feat: add hooks for managing spaces, users, versions, and webhooks)
import { useEdgeDetection } from '@/hooks/use-edge-detection'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'
import { cn } from '@/lib/utils'

interface MainLayoutProps {
  children: React.ReactNode
}

function MainLayoutContent({ children }: MainLayoutProps) {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [showCreateSpaceModal, setShowCreateSpaceModal] = useState(false)
  const { areSidebarsVisible, isTemporarilyVisible, showTemporarily, hideTemporarily } =
    useSidebarVisibility()
<<<<<<< HEAD
  const { setCommandPaletteOpen } = useUIState()
=======
  const { setCommandPaletteOpen } = useCommandPalette()
>>>>>>> d4609d4 (feat: add hooks for managing spaces, users, versions, and webhooks)

  // Global keyboard shortcuts
  useKeyboardShortcuts([
    { key: 'k', meta: true, action: () => setCommandPaletteOpen(true) },
  ])

  // Edge detection for auto-show (desktop only)
  useEdgeDetection({
    edgeWidth: 20,
    onEdgeEnter: showTemporarily,
    onEdgeLeave: hideTemporarily,
    isEnabled: isDesktop && !areSidebarsVisible,
  })

  const shouldShowSidebars = areSidebarsVisible || isTemporarilyVisible

  if (isDesktop) {
    // Desktop: Double sidebar layout with visibility control
    return (
      <>
        <div className="flex h-screen overflow-hidden relative">
          {/* Sidebar container with transition */}
          <div
            data-sidebar-container
            className={cn(
              'flex transition-transform duration-200 ease-in-out',
              !shouldShowSidebars && '-translate-x-full',
              isTemporarilyVisible && 'z-30 shadow-2xl'
            )}
          >
            <Sidebar onCreateSpace={() => setShowCreateSpaceModal(true)} />
          </div>

          {/* Edge indicator when sidebars are hidden */}
          {!areSidebarsVisible && !isTemporarilyVisible && (
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-muted-foreground/10 hover:bg-muted-foreground/30 transition-colors cursor-pointer z-10" />
          )}

          {/* Main content */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
        <CreateSpaceModal
          open={showCreateSpaceModal}
          onOpenChange={setShowCreateSpaceModal}
        />
        <CommandPalette />
      </>
    )
  }

  // Mobile/Tablet: Header + overlay sidebar
  return (
    <>
      <div className="flex flex-col h-screen overflow-hidden">
        <MobileHeader onMenuClick={() => setIsMobileSidebarOpen(true)} />

        {/* Overlay backdrop */}
        {isMobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}

        {/* Sidebar overlay */}
        <div
          className={cn(
            'fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transform transition-transform duration-200 lg:hidden',
            isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <Sidebar onClose={() => setIsMobileSidebarOpen(false)} />
        </div>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
      <CreateSpaceModal
        open={showCreateSpaceModal}
        onOpenChange={setShowCreateSpaceModal}
      />
      <CommandPalette />
    </>
  )
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <SidebarVisibilityProvider>
      <MainLayoutContent>{children}</MainLayoutContent>
    </SidebarVisibilityProvider>
  )
}
