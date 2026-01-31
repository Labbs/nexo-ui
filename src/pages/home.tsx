import { MainLayout } from '@/components/layout/main-layout'
import { useAutoSelectSpace } from '@/hooks/use-auto-select-space'

export function HomePage() {
  // Auto-select space on mount (Private space for new users, or last used space)
  useAutoSelectSpace()

  return (
    <MainLayout>
      <div />
    </MainLayout>
  )
}
