import { Check, ChevronsUpDown, Plus } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useSpaces } from '@/hooks/use-spaces'
import type { components } from '@/api/types'

type Space = components['schemas']['Space']
import { useCurrentSpace } from '@/contexts/space-context'
import { useTranslation } from 'react-i18next'

export function SpaceSwitcher() {
  const { data: spaces = [], isLoading } = useSpaces()
  const { currentSpace, setCurrentSpace } = useCurrentSpace()
  const { t } = useTranslation('navigation')

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-2 py-1.5">
        <div className="h-6 w-6 rounded bg-muted animate-pulse" />
        <div className="h-4 w-32 bg-muted animate-pulse rounded" />
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between px-2 font-normal"
        >
          <div className="flex items-center gap-2">
            {currentSpace ? (
              <>
                <div
                  className="h-6 w-6 rounded flex items-center justify-center text-sm font-medium"
                  style={{
                    backgroundColor: (currentSpace as any).icon_color || '#6366f1',
                    color: 'white',
                  }}
                >
                  {currentSpace.icon || currentSpace.name?.[0]?.toUpperCase()}
                </div>
                <span className="truncate">{currentSpace.name}</span>
              </>
            ) : (
              <span className="text-muted-foreground">{t('spaces.selectSpace')}</span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="start">
        <DropdownMenuLabel>{t('spaces.spaces')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {spaces.map((space: Space) => (
          <DropdownMenuItem
            key={space.id}
            onClick={() => setCurrentSpace(space)}
            className="cursor-pointer"
          >
            <div className="flex items-center gap-2 flex-1">
              <div
                className="h-6 w-6 rounded flex items-center justify-center text-sm font-medium"
                style={{
                  backgroundColor: (space as any).icon_color || '#6366f1',
                  color: 'white',
                }}
              >
                {space.icon || space.name?.[0]?.toUpperCase()}
              </div>
              <span className="truncate flex-1">{space.name}</span>
              {currentSpace?.id === space.id && (
                <Check className="h-4 w-4" />
              )}
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <Plus className="h-4 w-4 mr-2" />
          {t('spaces.createNewSpace')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
