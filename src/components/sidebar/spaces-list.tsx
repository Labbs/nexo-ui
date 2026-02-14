import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { useSpaces } from '@/hooks/use-spaces'
import { useCurrentSpace } from '@/contexts/space-context'
<<<<<<< HEAD
import { useUIState } from '@/contexts/ui-state-context'
=======
import { useSidebarUI } from '@/contexts/sidebar-ui-context'
>>>>>>> d4609d4 (feat: add hooks for managing spaces, users, versions, and webhooks)
import { useSpaceOrder, useUpdateSpaceOrder } from '@/hooks/use-space-order'
import { SortableSpaceItem } from './space-item'
import { CreateSpaceModal } from '@/components/spaces/create-space-modal'
import { Button } from '@/components/ui/button'

export function SpacesList() {
  const { t } = useTranslation('navigation')
  const { data: spaces = [], isLoading } = useSpaces()
  const { currentSpace } = useCurrentSpace()
<<<<<<< HEAD
  const { isSpaceExpanded, toggleSpaceExpanded } = useUIState()
=======
  const { isSpaceExpanded, toggleSpaceExpanded } = useSidebarUI()
>>>>>>> d4609d4 (feat: add hooks for managing spaces, users, versions, and webhooks)
  const spaceOrder = useSpaceOrder()
  const { mutate: updateSpaceOrder } = useUpdateSpaceOrder()
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Auto-expand current space (or first space) on initial load
  useEffect(() => {
    if (spaces.length === 0) return
    const hasAnyExpanded = spaces.some((s) => isSpaceExpanded(s.id ?? ''))
    if (hasAnyExpanded) return
    const targetId = currentSpace?.id ?? spaces[0]?.id
    if (targetId) toggleSpaceExpanded(targetId)
  }, [spaces]) // eslint-disable-line react-hooks/exhaustive-deps

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  )

  // Sort spaces according to user preference
  const sortedSpaces = useMemo(() => {
    if (spaceOrder.length === 0) return spaces
    const orderMap = new Map(spaceOrder.map((id, index) => [id, index]))
    return [...spaces].sort((a, b) => {
      const aIndex = orderMap.get(a.id ?? '') ?? Infinity
      const bIndex = orderMap.get(b.id ?? '') ?? Infinity
      return aIndex - bIndex
    })
  }, [spaces, spaceOrder])

  const spaceIds = useMemo(
    () => sortedSpaces.map((s) => s.id ?? '').filter(Boolean),
    [sortedSpaces]
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = spaceIds.indexOf(active.id as string)
    const newIndex = spaceIds.indexOf(over.id as string)
    if (oldIndex === -1 || newIndex === -1) return

    const newOrder = arrayMove(spaceIds, oldIndex, newIndex)
    updateSpaceOrder({ spaceIds: newOrder })
  }

  return (
    <div className="flex-1 overflow-y-auto px-2">
      <div className="px-2 py-1 flex items-center justify-between group">
        <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
          {t('sidebar.spaces')}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => setShowCreateModal(true)}
          title={t('spaces.createTitle')}
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-1 px-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-7 rounded bg-muted/50 animate-pulse" />
          ))}
        </div>
      ) : spaces.length === 0 ? (
        <div className="px-2 py-4 text-xs text-muted-foreground text-center">
          {t('spaces.createNewSpace')}
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={spaceIds} strategy={verticalListSortingStrategy}>
            <div className="space-y-0.5">
              {sortedSpaces.map((space) => (
                <SortableSpaceItem key={space.id} space={space} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <CreateSpaceModal open={showCreateModal} onOpenChange={setShowCreateModal} />
    </div>
  )
}
