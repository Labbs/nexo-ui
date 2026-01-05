import { useState, useEffect, useCallback, useRef } from 'react'

interface UseResizableOptions {
  minWidth?: number
  maxWidthVw?: number // max width as viewport width percentage
  defaultWidth?: number
  storageKey?: string
}

interface UseResizableReturn {
  width: number
  isResizing: boolean
  handleMouseDown: (e: React.MouseEvent) => void
}

export function useResizable({
  minWidth = 200,
  maxWidthVw = 33, // 33vw = 1/3 of screen
  defaultWidth = 256,
  storageKey = 'sidebar_width',
}: UseResizableOptions = {}): UseResizableReturn {
  // Load initial width from localStorage or use default
  const [width, setWidth] = useState(() => {
    const saved = localStorage.getItem(storageKey)
    return saved ? parseInt(saved, 10) : defaultWidth
  })

  const [isResizing, setIsResizing] = useState(false)
  const startXRef = useRef(0)
  const startWidthRef = useRef(0)

  // Calculate max width based on viewport
  const getMaxWidth = useCallback(() => {
    return (window.innerWidth * maxWidthVw) / 100
  }, [maxWidthVw])

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return

      const delta = e.clientX - startXRef.current
      const newWidth = startWidthRef.current + delta

      // Apply constraints
      const maxWidth = getMaxWidth()
      const constrainedWidth = Math.min(Math.max(newWidth, minWidth), maxWidth)

      setWidth(constrainedWidth)
    },
    [isResizing, minWidth, getMaxWidth]
  )

  const handleMouseUp = useCallback(() => {
    setIsResizing(false)
  }, [])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
    startXRef.current = e.clientX
    startWidthRef.current = width
  }, [width])

  // Save to localStorage when width changes
  useEffect(() => {
    localStorage.setItem(storageKey, width.toString())
  }, [width, storageKey])

  // Add/remove event listeners
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'

      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
      }
    }
  }, [isResizing, handleMouseMove, handleMouseUp])

  return {
    width,
    isResizing,
    handleMouseDown,
  }
}
