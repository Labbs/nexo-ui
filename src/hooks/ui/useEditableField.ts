import { useState, useEffect, useCallback } from 'react'

/**
 * Hook for text input with local state during editing.
 * Manages local state that syncs with external value when entering edit mode.
 */
export function useEditableText(
  externalValue: unknown,
  isEditing: boolean,
  onChange: (value: unknown) => void,
  onEndEdit?: () => void
) {
  const [localValue, setLocalValue] = useState<string>('')

  // Sync local value when entering edit mode
  useEffect(() => {
    if (isEditing) {
      setLocalValue((externalValue as string) || '')
    }
  }, [isEditing, externalValue])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value)
  }, [])

  const handleBlur = useCallback(() => {
    // Save the value when leaving edit mode
    onChange(localValue)
    setTimeout(() => onEndEdit?.(), 50)
  }, [localValue, onChange, onEndEdit])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onChange(localValue)
      onEndEdit?.()
    } else if (e.key === 'Escape') {
      // Discard changes on Escape
      onEndEdit?.()
    }
  }, [localValue, onChange, onEndEdit])

  return { localValue, setLocalValue, handleChange, handleBlur, handleKeyDown }
}

/**
 * Hook for number input with local state during editing.
 * Manages local state that syncs with external value when entering edit mode.
 */
export function useEditableNumber(
  externalValue: unknown,
  isEditing: boolean,
  onChange: (value: unknown) => void,
  onEndEdit?: () => void
) {
  const [localValue, setLocalValue] = useState<string>('')

  // Sync local value when entering edit mode
  useEffect(() => {
    if (isEditing) {
      setLocalValue(externalValue !== null && externalValue !== undefined ? String(externalValue) : '')
    }
  }, [isEditing, externalValue])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value)
  }, [])

  const handleBlur = useCallback(() => {
    // Save the value when leaving edit mode
    onChange(localValue ? Number(localValue) : null)
    setTimeout(() => onEndEdit?.(), 50)
  }, [localValue, onChange, onEndEdit])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onChange(localValue ? Number(localValue) : null)
      onEndEdit?.()
    } else if (e.key === 'Escape') {
      onEndEdit?.()
    }
  }, [localValue, onChange, onEndEdit])

  return { localValue, setLocalValue, handleChange, handleBlur, handleKeyDown }
}
