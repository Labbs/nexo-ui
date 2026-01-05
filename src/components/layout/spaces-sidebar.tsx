import { Plus } from 'lucide-react'
import { SpaceIcon } from '@/components/spaces/space-icon'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'
import { useSpaces } from '@/hooks/use-spaces'
import { useCurrentSpace } from '@/contexts/space-context'
import { cn } from '@/lib/utils'

interface SpacesSidebarProps {
  onCreateSpace?: () => void
}

export function SpacesSidebar({ onCreateSpace }: SpacesSidebarProps) {
  const { data: spaces = [], isLoading } = useSpaces()
  const { currentSpace, setCurrentSpace } = useCurrentSpace()

  if (isLoading) {
    return (
      <aside className="w-[72px] border-r bg-muted/20 flex flex-col items-center py-3 gap-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-10 w-10 rounded-lg bg-muted animate-pulse"
          />
        ))}
      </aside>
    )
  }

  return (
    <TooltipProvider delayDuration={300}>
      <aside className="w-[72px] border-r bg-muted/20 flex flex-col items-center py-3">
        {/* Spaces list */}
        <div className="flex-1 flex flex-col items-center gap-2 w-full px-3 pt-2 overflow-y-auto">
          {spaces.map((space) => {
            const isActive = currentSpace?.id === space.id

            return (
              <Tooltip key={space.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setCurrentSpace(space)}
                    className={cn(
                      'relative group w-full transition-all',
                      isActive && 'scale-105'
                    )}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-1 h-8 rounded-r-full transition-all"
                        style={{ backgroundColor: (space as any).icon_color || '#6366f1' }}
                      />
                    )}

                    <SpaceIcon
                      space={space}
                      className={cn(
                        'mx-auto transition-all',
                        isActive
                          ? 'ring-2'
                          : 'opacity-70 hover:opacity-100'
                      )}
                      style={
                        isActive
                          ? {
                              '--tw-ring-color': (space as any).icon_color || '#6366f1',
                            } as React.CSSProperties
                          : undefined
                      }
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{space.name}</p>
                </TooltipContent>
              </Tooltip>
            )
          })}

          {/* Add space button */}
          <Separator className="my-2" />
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onCreateSpace}
                className="h-10 w-10 rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center hover:border-muted-foreground/60 hover:bg-muted/50 transition-all"
              >
                <Plus className="h-5 w-5 text-muted-foreground" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Create new space</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  )
}
