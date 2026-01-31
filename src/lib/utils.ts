import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { IconValue } from '@/components/ui/icon-picker'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Parse a stored icon value (could be string emoji or JSON object)
 * @param storedIcon - The stored icon string from the API
 * @returns Parsed IconValue (string emoji, { name, color } object, or null)
 */
export function parseStoredIcon(storedIcon: string | undefined | null): IconValue {
  if (!storedIcon) return null
  // Try to parse as JSON (for IconValue objects with name and color)
  if (storedIcon.startsWith('{')) {
    try {
      return JSON.parse(storedIcon) as IconValue
    } catch {
      return storedIcon
    }
  }
  return storedIcon
}

/**
 * Serialize an IconValue for storage
 * @param icon - The IconValue to serialize
 * @returns String representation for storage
 */
export function serializeIcon(icon: IconValue): string {
  if (!icon) return ''
  if (typeof icon === 'string') return icon
  return JSON.stringify(icon)
}
