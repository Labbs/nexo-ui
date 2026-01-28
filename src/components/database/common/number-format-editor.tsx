import { Check, Hash, Percent, DollarSign } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { currencyOptions } from '@/lib/database/formatters'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { NumberFormatOptions, NumberFormat } from '@/lib/database/columnTypes'

interface NumberFormatEditorProps {
  currentOptions?: NumberFormatOptions
  onUpdate: (options: NumberFormatOptions) => void
}

const decimalOptions = [
  { value: 1, label: '1', example: '1.0' },
  { value: 2, label: '2', example: '1.00' },
  { value: 3, label: '3', example: '1.000' },
  { value: 4, label: '4', example: '1.0000' },
]

export function NumberFormatEditor({ currentOptions, onUpdate }: NumberFormatEditorProps) {
  const { t } = useTranslation('database')
  const format = currentOptions?.format || 'integer'
  const decimals = currentOptions?.decimals ?? 2
  const currency = currentOptions?.currency || 'USD'

  const formatOptions: { value: NumberFormat; label: string; icon: React.ElementType; example: string }[] = [
    { value: 'integer', label: t('numberFormat.integer'), icon: Hash, example: '1,234' },
    { value: 'decimal', label: t('numberFormat.decimal'), icon: Hash, example: '1,234.56' },
    { value: 'percent', label: t('numberFormat.percent'), icon: Percent, example: '85%' },
    { value: 'currency', label: t('numberFormat.currency'), icon: DollarSign, example: '$1,234.56' },
  ]

  const handleFormatChange = (newFormat: NumberFormat) => {
    const newOptions: NumberFormatOptions = { format: newFormat }
    if (newFormat === 'decimal' || newFormat === 'percent') {
      newOptions.decimals = decimals
    }
    if (newFormat === 'currency') {
      newOptions.decimals = decimals
      newOptions.currency = currency
    }
    onUpdate(newOptions)
  }

  return (
    <div className="p-2 space-y-3" onClick={(e) => e.stopPropagation()}>
      {/* Format type selection */}
      <div>
        <span className="text-xs font-medium text-muted-foreground px-1">{t('numberFormat.format')}</span>
        <div className="mt-1.5 space-y-0.5">
          {formatOptions.map((option) => {
            const Icon = option.icon
            return (
              <button
                key={option.value}
                onClick={(e) => {
                  e.stopPropagation()
                  handleFormatChange(option.value)
                }}
                className={cn(
                  'w-full flex items-center justify-between px-2 py-1.5 rounded text-sm hover:bg-muted transition-colors',
                  format === option.value && 'bg-muted'
                )}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                  <span>{option.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-xs">{option.example}</span>
                  {format === option.value && <Check className="w-3.5 h-3.5 text-primary" />}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Decimal places - show for decimal, percent, currency */}
      {(format === 'decimal' || format === 'percent' || format === 'currency') && (
        <div>
          <span className="text-xs font-medium text-muted-foreground px-1">{t('numberFormat.decimalPlaces')}</span>
          <div className="mt-1.5 flex gap-1 px-1">
            {decimalOptions.map((option) => (
              <button
                key={option.value}
                onClick={(e) => {
                  e.stopPropagation()
                  onUpdate({ ...currentOptions!, decimals: option.value as 1 | 2 | 3 | 4 })
                }}
                className={cn(
                  'flex-1 px-2 py-1.5 rounded text-sm hover:bg-muted transition-colors',
                  decimals === option.value && 'bg-primary text-primary-foreground hover:bg-primary'
                )}
              >
                {option.value}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Currency selection - show for currency */}
      {format === 'currency' && (
        <div className="px-1">
          <span className="text-xs font-medium text-muted-foreground">{t('numberFormat.currencyLabel')}</span>
          <Select
            value={currency}
            onValueChange={(value) => {
              onUpdate({ ...currentOptions!, currency: value })
            }}
          >
            <SelectTrigger className="h-8 mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currencyOptions.map((curr) => (
                <SelectItem key={curr.code} value={curr.code}>
                  <span className="flex items-center gap-2">
                    <span className="font-mono">{curr.symbol}</span>
                    <span>{curr.code}</span>
                    <span className="text-muted-foreground text-xs">- {curr.name}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  )
}
