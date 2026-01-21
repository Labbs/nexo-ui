// Currency formatting utilities

export interface CurrencyOption {
  code: string
  symbol: string
  locale: string
}

export const currencyOptions: CurrencyOption[] = [
  { code: 'USD', symbol: '$', locale: 'en-US' },
  { code: 'EUR', symbol: '€', locale: 'fr-FR' },
  { code: 'GBP', symbol: '£', locale: 'en-GB' },
  { code: 'JPY', symbol: '¥', locale: 'ja-JP' },
  { code: 'CAD', symbol: 'CA$', locale: 'en-CA' },
  { code: 'CHF', symbol: 'CHF', locale: 'de-CH' },
]

export function formatCurrency(
  value: number | null | undefined,
  options?: Record<string, unknown>
): string {
  if (value == null) return ''
  const currency = (options?.currency as string) || 'USD'
  const currencyInfo = currencyOptions.find(c => c.code === currency) || currencyOptions[0]
  try {
    return new Intl.NumberFormat(currencyInfo.locale, {
      style: 'currency',
      currency: currencyInfo.code,
    }).format(value)
  } catch {
    return `${currencyInfo.symbol}${value.toFixed(2)}`
  }
}
