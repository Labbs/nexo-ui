import { useState, useRef, useCallback } from 'react'
import { FileText } from 'lucide-react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  pointerWithin,
  rectIntersection,
  type DragEndEvent,
  type DragStartEvent,
  type DragOverEvent,
  type CollisionDetection,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { useQueryClient } from '@tanstack/react-query'
import { DocumentIcon } from '@/components/ui/icon-picker'
import { parseStoredIcon } from '@/lib/utils'
import { useReorderDocuments } from '@/hooks/use-reorder-documents'
import { useMoveDocument } from '@/hooks/use-documents'
import { DocumentTree, RootDropZone } from '@/components/document/DocumentTree'
import { DatabaseTree } from '@/components/database/DatabaseTree'
import { DrawingTree } from '@/components/drawing/DrawingTree'

interface SpaceContentDocsProps {
  spaceId: string
  canEdit: boolean
}

interface ActiveDragItem {
  id: string
  name: string
  icon?: string | null
  parentId?: string
}

// Custom collision detection that prioritizes drop zones
const customCollisionDetection: CollisionDetection = (args) => {
  const pointerCollisions = pointerWithin(args)
  if (pointerCollisions.length > 0) {
    const dropZone = pointerCollisions.find(c => c.data?.droppableContainer?.data?.current?.isDropZone)
    if (dropZone) return [dropZone]
    return pointerCollisions
  }
  return rectIntersection(args)
}

// Dwell time in ms before a hover becomes a "nest" intent
const NEST_DWELL_MS = 500

export function SpaceContentDocs({ spaceId, canEdit }: SpaceContentDocsProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  )
  const queryClient = useQueryClient()
  const { mutate: reorderDocuments } = useReorderDocuments()
  const { mutate: moveDocument } = useMoveDocument()
  const [activeItem, setActiveItem] = useState<ActiveDragItem | null>(null)
  const [dropTarget, setDropTarget] = useState<string | null>(null)

  // Dwell-time refs for nest detection
  const nestTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastOverIdRef = useRef<string | null>(null)

  const clearNestTimeout = useCallback(() => {
    if (nestTimeoutRef.current) {
      clearTimeout(nestTimeoutRef.current)
      nestTimeoutRef.current = null
    }
  }, [])

  const handleDragStart = (event: DragStartEvent) => {
    const data = event.active.data.current
    if (data?.type === 'document') {
      setActiveItem({
        id: event.active.id as string,
        name: data.name,
        icon: data.icon,
        parentId: data.parentId,
      })
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { over, active } = event
    if (!over) {
      clearNestTimeout()
      lastOverIdRef.current = null
      if (dropTarget !== 'root') setDropTarget(null)
      return
    }

    const overData = over.data.current
    const activeData = active.data.current

    // Handle root drop zone - immediate
    if (overData?.isDropZone) {
      clearNestTimeout()
      lastOverIdRef.current = null
      setDropTarget('root')
      return
    }

    // For documents: use dwell-time to detect nest intent
    if (overData?.type === 'document' && over.id !== activeItem?.id) {
      const docId = over.id as string

      // Different container = immediate nest target (cross-level move)
      const activeContainer = activeData?.sortable?.containerId
      const overContainer = overData?.sortable?.containerId
      if (activeContainer !== overContainer) {
        clearNestTimeout()
        lastOverIdRef.current = docId
        setDropTarget(docId)
        return
      }

      // Same container: start dwell timer if hovering over a new document
      if (lastOverIdRef.current !== docId) {
        clearNestTimeout()
        lastOverIdRef.current = docId
        // Clear any existing nest target since we moved to a new item
        setDropTarget(null)

        // After dwelling for NEST_DWELL_MS, mark as nest target
        nestTimeoutRef.current = setTimeout(() => {
          setDropTarget(docId)
        }, NEST_DWELL_MS)
      }
      // If same docId, let the existing timer continue
      return
    }

    // Not hovering over a relevant target
    clearNestTimeout()
    lastOverIdRef.current = null
    setDropTarget(null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    const currentDropTarget = dropTarget
    clearNestTimeout()
    lastOverIdRef.current = null
    setActiveItem(null)
    setDropTarget(null)

    if (!over || active.id === over.id) return

    const activeData = active.data.current
    const overData = over.data.current

    if (activeData?.type !== 'document') return

    const activeContainer = activeData.sortable?.containerId
    const overContainer = overData?.sortable?.containerId
    const currentParentId = activeData.parentId

    // Case 1: Drop on root drop zone - move to root (remove parent)
    if (overData?.isDropZone && overData?.target === 'root') {
      if (currentParentId) {
        moveDocument({ spaceId, id: active.id as string, parentId: undefined })
      }
      return
    }

    // Case 2: Nest under a document (dropTarget was set via dwell timer or cross-container)
    if (currentDropTarget && currentDropTarget !== 'root' && overData?.type === 'document') {
      const targetDocId = over.id as string
      const isAlreadyChild = currentParentId === targetDocId

      if (targetDocId !== active.id && !isAlreadyChild) {
        moveDocument({ spaceId, id: active.id as string, parentId: targetDocId })
        return
      }
    }

    // Case 3: Different container without nest intent - move to that container's parent level
    if (overData?.type === 'document' && activeContainer !== overContainer) {
      const newParentId = overContainer === 'root' ? undefined : overContainer

      if (newParentId !== currentParentId) {
        moveDocument({ spaceId, id: active.id as string, parentId: newParentId })
        return
      }
    }

    // Case 4: Same container, no nest target - reorder within the same parent
    if (activeContainer && activeContainer === overContainer && !currentDropTarget) {
      const sortableItems = activeData.sortable?.items as string[] | undefined
      if (!sortableItems) return

      const oldIndex = sortableItems.indexOf(active.id as string)
      const newIndex = sortableItems.indexOf(over.id as string)
      if (oldIndex === -1 || newIndex === -1) return

      const newOrder = arrayMove([...sortableItems], oldIndex, newIndex)

      queryClient.setQueryData(
        ['documents', spaceId, currentParentId],
        (old: any[] | undefined) => {
          if (!old) return old
          const itemMap = new Map(old.map((d: any) => [(d.id || d.document) as string, d]))
          return newOrder.map(id => itemMap.get(id)).filter(Boolean)
        }
      )

      const reorderItems = newOrder.map((id, index) => ({ id: id as string, position: index }))
      reorderDocuments({ spaceId, items: reorderItems })
    }
  }

  const iconValue = activeItem?.icon ? parseStoredIcon(activeItem.icon) : null
  const isDraggingNestedDoc = activeItem && activeItem.parentId

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={customCollisionDetection}
      modifiers={[restrictToVerticalAxis]}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="ml-4 pl-3 border-l border-border/50 space-y-0.5">
        {/* Root drop zone - only show when dragging a nested document */}
        {isDraggingNestedDoc && (
          <RootDropZone isOver={dropTarget === 'root'} />
        )}
        <DocumentTree spaceId={spaceId} canEdit={canEdit} dropTarget={dropTarget} activeId={activeItem?.id} />
        <DatabaseTree spaceId={spaceId} canEdit={canEdit} />
        <DrawingTree spaceId={spaceId} canEdit={canEdit} />
      </div>

      <DragOverlay>
        {activeItem && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-background shadow-lg border text-sm max-w-[200px]">
            {iconValue ? (
              <DocumentIcon value={iconValue} size="sm" />
            ) : (
              <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
            )}
            <span className="truncate">{activeItem.name}</span>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
