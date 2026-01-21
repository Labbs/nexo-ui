// Column type definitions and utilities
import {
  Type,
  AlignLeft,
  Hash,
  DollarSign,
  CheckSquare,
  AtSign,
  Link,
  Calendar,
  Sigma,
  CircleDot,
  List,
  Paperclip,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { PropertySchema } from '@/hooks/use-database'

// Column types we support (mapped from backend)
export type ColumnType =
  | 'title'
  | 'text'
  | 'number'
  | 'currency'
  | 'checkbox'
  | 'url'
  | 'email'
  | 'date'
  | 'select'
  | 'multi_select'
  | 'image'
  | 'formula'

// Column definition with type
export interface ColumnDef {
  id: string
  title: string
  type: ColumnType
  width: number
  options?: Record<string, unknown>
}

// Row data is a map of column id to value
export interface RowData {
  id: string
  properties: Record<string, unknown>
}

// Select option type
export interface SelectOption {
  id: string
  name: string
  color: string
}

// Column type options for the dropdown
export interface ColumnTypeOption {
  value: ColumnType
  label: string
  icon: LucideIcon
}

export const columnTypes: ColumnTypeOption[] = [
  { value: 'text', label: 'Text', icon: AlignLeft },
  { value: 'number', label: 'Number', icon: Hash },
  { value: 'select', label: 'Select', icon: CircleDot },
  { value: 'multi_select', label: 'Multi-select', icon: List },
  { value: 'date', label: 'Date', icon: Calendar },
  { value: 'checkbox', label: 'Checkbox', icon: CheckSquare },
  { value: 'url', label: 'URL', icon: Link },
  { value: 'email', label: 'Email', icon: AtSign },
  { value: 'currency', label: 'Currency', icon: DollarSign },
  { value: 'image', label: 'Files & media', icon: Paperclip },
  { value: 'formula', label: 'Formula', icon: Sigma },
  { value: 'title', label: 'Title', icon: Type },
]

// Select option colors (matching Notion's color palette - vibrant pastels)
export interface SelectOptionColor {
  name: string
  bg: string
  text: string
  value: string
  hex: string
  hexDark: string
  textHex: string
  textHexDark: string
}

export const selectOptionColors: SelectOptionColor[] = [
  { name: 'Default', bg: 'bg-slate-100 dark:bg-slate-600', text: 'text-slate-700 dark:text-slate-100', value: 'default', hex: '#e2e8f0', hexDark: '#475569', textHex: '#334155', textHexDark: '#f1f5f9' },
  { name: 'Gray', bg: 'bg-gray-200 dark:bg-gray-500', text: 'text-gray-700 dark:text-gray-100', value: 'gray', hex: '#d1d5db', hexDark: '#6b7280', textHex: '#374151', textHexDark: '#f3f4f6' },
  { name: 'Brown', bg: 'bg-amber-200 dark:bg-amber-700', text: 'text-amber-900 dark:text-amber-100', value: 'brown', hex: '#fde68a', hexDark: '#b45309', textHex: '#78350f', textHexDark: '#fef3c7' },
  { name: 'Orange', bg: 'bg-orange-200 dark:bg-orange-600', text: 'text-orange-800 dark:text-orange-100', value: 'orange', hex: '#fed7aa', hexDark: '#ea580c', textHex: '#9a3412', textHexDark: '#ffedd5' },
  { name: 'Yellow', bg: 'bg-yellow-200 dark:bg-yellow-600', text: 'text-yellow-800 dark:text-yellow-100', value: 'yellow', hex: '#fef08a', hexDark: '#ca8a04', textHex: '#854d0e', textHexDark: '#fef9c3' },
  { name: 'Green', bg: 'bg-emerald-200 dark:bg-emerald-600', text: 'text-emerald-800 dark:text-emerald-100', value: 'green', hex: '#a7f3d0', hexDark: '#059669', textHex: '#065f46', textHexDark: '#d1fae5' },
  { name: 'Blue', bg: 'bg-sky-200 dark:bg-sky-600', text: 'text-sky-800 dark:text-sky-100', value: 'blue', hex: '#bae6fd', hexDark: '#0284c7', textHex: '#075985', textHexDark: '#e0f2fe' },
  { name: 'Purple', bg: 'bg-violet-200 dark:bg-violet-600', text: 'text-violet-800 dark:text-violet-100', value: 'purple', hex: '#ddd6fe', hexDark: '#7c3aed', textHex: '#5b21b6', textHexDark: '#ede9fe' },
  { name: 'Pink', bg: 'bg-pink-200 dark:bg-pink-600', text: 'text-pink-800 dark:text-pink-100', value: 'pink', hex: '#fbcfe8', hexDark: '#db2777', textHex: '#9d174d', textHexDark: '#fce7f3' },
  { name: 'Red', bg: 'bg-rose-200 dark:bg-rose-600', text: 'text-rose-800 dark:text-rose-100', value: 'red', hex: '#fecdd3', hexDark: '#e11d48', textHex: '#9f1239', textHexDark: '#ffe4e6' },
]

/**
 * Get default width for a column type
 */
export function getDefaultWidth(type: ColumnType): number {
  switch (type) {
    case 'checkbox':
      return 80
    case 'title':
      return 200
    case 'email':
    case 'url':
      return 200
    case 'number':
      return 100
    case 'currency':
      return 120
    case 'image':
      return 100
    default:
      return 150
  }
}

/**
 * Get Glide Data Grid icon name for a column type
 */
export function getColumnIcon(type: ColumnType): string {
  switch (type) {
    case 'title':
    case 'text':
      return 'headerString'
    case 'number':
    case 'currency':
      return 'headerNumber'
    case 'formula':
      return 'headerMath'
    case 'checkbox':
      return 'headerBoolean'
    case 'email':
      return 'headerString'
    case 'url':
      return 'headerUri'
    case 'date':
      return 'headerDate'
    case 'image':
      return 'headerImage'
    default:
      return 'headerString'
  }
}

/**
 * Convert backend PropertySchema to ColumnDef
 */
export function schemaToColumn(schema: PropertySchema): ColumnDef {
  const type = (schema.type || 'text') as ColumnType
  // Width is stored in options, fallback to default
  const width = (schema.options?.width as number) || getDefaultWidth(type)

  return {
    id: schema.id || '',
    title: schema.name || '',
    type,
    width,
    options: schema.options,
  }
}

/**
 * Convert ColumnDef back to PropertySchema
 */
export function columnToSchema(column: ColumnDef): PropertySchema {
  return {
    id: column.id,
    name: column.title,
    type: column.type,
    options: column.options,
  }
}
