import { useEffect, useRef } from 'react'

interface UseEdgeDetectionOptions {
  edgeWidth?: number // Width of the detection zone in pixels
  onEdgeEnter: () => void
  onEdgeLeave: () => void
  isEnabled: boolean
}

export function useEdgeDetection({
  edgeWidth = 20,
  onEdgeEnter,
  onEdgeLeave,
  isEnabled,
}: UseEdgeDetectionOptions) {
  const isNearEdgeRef = useRef(false)
  const sidebarRectRef = useRef<DOMRect | null>(null)

  useEffect(() => {
    if (!isEnabled) return

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX } = e

      // Check if mouse is in the edge zone (left edge)
      const isInEdgeZone = clientX < edgeWidth

      // Get sidebar bounds if available (for leave detection)
      const sidebarElement = document.querySelector('[data-sidebar-container]')
      if (sidebarElement) {
        sidebarRectRef.current = sidebarElement.getBoundingClientRect()
      }

      if (isInEdgeZone && !isNearEdgeRef.current) {
        // Entering edge zone
        isNearEdgeRef.current = true
        onEdgeEnter()
      } else if (
        !isInEdgeZone &&
        isNearEdgeRef.current &&
        sidebarRectRef.current &&
        clientX > sidebarRectRef.current.right
      ) {
        // Leaving edge zone and sidebar area
        isNearEdgeRef.current = false
        onEdgeLeave()
      }
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [edgeWidth, onEdgeEnter, onEdgeLeave, isEnabled])
}
