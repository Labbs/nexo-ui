import { useState, useEffect, useCallback, useRef } from 'react'

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
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (isEditing) {
      setLocalValue((externalValue as string) || '')
    }
  }, [isEditing, externalValue])

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value)
  }, [])

  const handleBlur = useCallback(() => {
    onChange(localValue)
    timerRef.current = setTimeout(() => onEndEdit?.(), 50)
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
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (isEditing) {
      setLocalValue(externalValue !== null && externalValue !== undefined ? String(externalValue) : '')
    }
  }, [isEditing, externalValue])

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value)
  }, [])

  const handleBlur = useCallback(() => {
    onChange(localValue ? Number(localValue) : null)
    timerRef.current = setTimeout(() => onEndEdit?.(), 50)
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
