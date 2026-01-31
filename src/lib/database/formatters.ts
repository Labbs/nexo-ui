// Formatting utilities for database columns
import { formatDistanceToNow, format as formatDateFns, isValid, parseISO } from 'date-fns'
import type { Locale } from 'date-fns'
import type { NumberFormatOptions, DateFormatOptions } from './columnTypes'

// ============================================
// CURRENCY OPTIONS
// ============================================

export interface CurrencyOption {
  code: string
  symbol: string
  locale: string
  name: string
}

export const currencyOptions: CurrencyOption[] = [
  { code: 'USD', symbol: '$', locale: 'en-US', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', locale: 'fr-FR', name: 'Euro' },
  { code: 'GBP', symbol: '£', locale: 'en-GB', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', locale: 'ja-JP', name: 'Japanese Yen' },
  { code: 'CAD', symbol: 'CA$', locale: 'en-CA', name: 'Canadian Dollar' },
  { code: 'CHF', symbol: 'CHF', locale: 'de-CH', name: 'Swiss Franc' },
  { code: 'AUD', symbol: 'A$', locale: 'en-AU', name: 'Australian Dollar' },
  { code: 'CNY', symbol: '¥', locale: 'zh-CN', name: 'Chinese Yuan' },
  { code: 'INR', symbol: '₹', locale: 'en-IN', name: 'Indian Rupee' },
  { code: 'BRL', symbol: 'R$', locale: 'pt-BR', name: 'Brazilian Real' },
]

// ============================================
// NUMBER FORMATTING
// ============================================

/**
 * Format a number according to the specified options
 */
export function formatNumber(
  value: number | null | undefined,
  options?: NumberFormatOptions
): string {
  if (value == null || (typeof value === 'number' && isNaN(value))) return ''

  const numValue = Number(value)
  if (isNaN(numValue)) return ''

  const format = options?.format || 'integer'
  const decimals = options?.decimals ?? 2
  const showSeparator = options?.showThousandsSeparator !== false

  switch (format) {
    case 'currency': {
      const currencyCode = options?.currency || 'USD'
      const currencyInfo = currencyOptions.find(c => c.code === currencyCode) || currencyOptions[0]
      try {
        return new Intl.NumberFormat(currencyInfo.locale, {
          style: 'currency',
          currency: currencyInfo.code,
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }).format(numValue)
      } catch {
        return `${currencyInfo.symbol}${numValue.toFixed(decimals)}`
      }
    }

    case 'percent': {
      const percentValue = numValue * 100
      if (showSeparator) {
        return new Intl.NumberFormat('en-US', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }).format(percentValue) + '%'
      }
      return percentValue.toFixed(decimals) + '%'
    }

    case 'decimal': {
      if (showSeparator) {
        return new Intl.NumberFormat('en-US', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }).format(numValue)
      }
      return numValue.toFixed(decimals)
    }

    case 'integer':
    default: {
      const intValue = Math.round(numValue)
      if (showSeparator) {
        return new Intl.NumberFormat('en-US', {
          maximumFractionDigits: 0,
        }).format(intValue)
      }
      return String(intValue)
    }
  }
}

// Legacy function for backward compatibility
export function formatCurrency(
  value: number | null | undefined,
  options?: Record<string, unknown>
): string {
  return formatNumber(value, {
    format: 'currency',
    currency: (options?.currency as string) || 'USD',
    decimals: 2,
  })
}

// ============================================
// DATE FORMATTING
// ============================================

/**
 * Format a date according to the specified options
 */
export function formatDate(
  value: string | Date | null | undefined,
  options?: DateFormatOptions,
  locale?: Locale
): string {
  if (value == null) return ''

  const date = typeof value === 'string' ? parseISO(value) : value
  if (!isValid(date)) return ''

  const dateFormat = options?.dateFormat || 'us'
  const includeTime = options?.includeTime ?? false
  const timeFormat = options?.timeFormat || '12h'

  // Time format string
  const timeStr = timeFormat === '24h' ? 'HH:mm' : 'h:mm a'

  switch (dateFormat) {
    case 'relative':
      return formatDistanceToNow(date, { addSuffix: true, locale })

    case 'iso': {
      const dateStr = formatDateFns(date, 'yyyy-MM-dd')
      return includeTime ? `${dateStr} ${formatDateFns(date, timeStr)}` : dateStr
    }

    case 'eu': {
      const dateStr = formatDateFns(date, 'd MMM yyyy')
      return includeTime ? `${dateStr}, ${formatDateFns(date, timeStr)}` : dateStr
    }

    case 'full': {
      const dateStr = formatDateFns(date, 'EEEE, MMMM d, yyyy')
      return includeTime ? `${dateStr} at ${formatDateFns(date, timeStr)}` : dateStr
    }

    case 'us':
    default: {
      const dateStr = formatDateFns(date, 'MMM d, yyyy')
      return includeTime ? `${dateStr}, ${formatDateFns(date, timeStr)}` : dateStr
    }
  }
}
