import { useEffect } from 'react'
import { useCurrentSpace } from '@/contexts/space-context'
import { useSpaces } from './use-spaces'
import type { components } from '@/api/types'

type Space = components['schemas']['Space']

/**
 * Auto-select space hook
 *
 * Logic:
 * 1. Check if there's already a current space selected (from localStorage)
 * 2. If yes and it's still valid (exists in user's spaces), keep it
 * 3. If no or invalid:
 *    - Try to find a space with type "private"
 *    - If no private space, select the first available space
 * 4. If no spaces at all, do nothing (user needs to create a space)
 */
export function useAutoSelectSpace() {
  const { currentSpace, setCurrentSpace } = useCurrentSpace()
  const { data: spaces = [], isLoading } = useSpaces()

  useEffect(() => {
    // Wait for spaces to load
    if (isLoading) return

    // If no spaces, nothing to select
    if (spaces.length === 0) return

    // If current space is already set and valid, keep it
    if (currentSpace && spaces.some((space: Space) => space.id === currentSpace.id)) {
      return
    }

    // Try to find the "private" space
    const privateSpace = spaces.find((space: Space) => space.type === 'private')
    if (privateSpace) {
      setCurrentSpace(privateSpace)
      return
    }

    // Fallback: select the first available space
    if (spaces.length > 0) {
      setCurrentSpace(spaces[0])
    }
  }, [spaces, isLoading, currentSpace, setCurrentSpace])
}
