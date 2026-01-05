import { MainLayout } from '@/components/layout/main-layout'
import { useCurrentSpace } from '@/contexts/space-context'
import { useAutoSelectSpace } from '@/hooks/use-auto-select-space'

export function HomePage() {
  const { currentSpace } = useCurrentSpace()

  // Auto-select space on mount (Private space for new users, or last used space)
  useAutoSelectSpace()

  return (
    <MainLayout>
      <div className="p-8">
        {currentSpace ? (
          <>
            <h1 className="text-3xl font-bold">{currentSpace.name}</h1>
            <p className="mt-4 text-muted-foreground">
              Select a page from the sidebar or create a new one.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold">Welcome to Nexo</h1>
            <p className="mt-4 text-muted-foreground">
              Select a space from the sidebar to get started.
            </p>
          </>
        )}
      </div>
    </MainLayout>
  )
}
