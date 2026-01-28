import { Check, Calendar, Clock } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import type { DateFormatOptions, DateFormat, TimeFormat } from '@/lib/database/columnTypes'

interface DateFormatEditorProps {
  currentOptions?: DateFormatOptions
  onUpdate: (options: DateFormatOptions) => void
}

export function DateFormatEditor({ currentOptions, onUpdate }: DateFormatEditorProps) {
  const { t } = useTranslation('database')
  const dateFormat = currentOptions?.dateFormat || 'us'
  const includeTime = currentOptions?.includeTime ?? false
  const timeFormat = currentOptions?.timeFormat || '12h'

  const dateFormatOptions: { value: DateFormat; label: string; example: string }[] = [
    { value: 'us', label: t('dateFormat.us'), example: 'Jan 15, 2024' },
    { value: 'eu', label: t('dateFormat.european'), example: '15 Jan 2024' },
    { value: 'iso', label: t('dateFormat.iso'), example: '2024-01-15' },
    { value: 'relative', label: t('dateFormat.relative'), example: t('dateFormat.relativeExample') },
    { value: 'full', label: t('dateFormat.full'), example: 'Monday, January 15, 2024' },
  ]

  const timeFormatOptions: { value: TimeFormat; label: string; example: string }[] = [
    { value: '12h', label: t('dateFormat.12hour'), example: '2:30 PM' },
    { value: '24h', label: t('dateFormat.24hour'), example: '14:30' },
  ]

  return (
    <div className="p-2 space-y-3" onClick={(e) => e.stopPropagation()}>
      {/* Date format selection */}
      <div>
        <span className="text-xs font-medium text-muted-foreground px-1">{t('dateFormat.dateFormat')}</span>
        <div className="mt-1.5 space-y-0.5">
          {dateFormatOptions.map((option) => (
            <button
              key={option.value}
              onClick={(e) => {
                e.stopPropagation()
                onUpdate({ ...currentOptions, dateFormat: option.value })
              }}
              className={cn(
                'w-full flex items-center justify-between px-2 py-1.5 rounded text-sm hover:bg-muted transition-colors',
                dateFormat === option.value && 'bg-muted'
              )}
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>{option.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">{option.example}</span>
                {dateFormat === option.value && <Check className="w-3.5 h-3.5 text-primary" />}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Include time toggle */}
      <div className="flex items-center justify-between px-1 py-1">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <Label htmlFor="include-time" className="text-sm cursor-pointer">
            {t('dateFormat.includeTime')}
          </Label>
        </div>
        <Switch
          id="include-time"
          checked={includeTime}
          onCheckedChange={(checked) => {
            onUpdate({ ...currentOptions, dateFormat, includeTime: checked })
          }}
        />
      </div>

      {/* Time format - show when includeTime is true */}
      {includeTime && (
        <div className="px-1">
          <span className="text-xs font-medium text-muted-foreground">{t('dateFormat.timeFormat')}</span>
          <div className="mt-1.5 flex gap-1">
            {timeFormatOptions.map((option) => (
              <button
                key={option.value}
                onClick={(e) => {
                  e.stopPropagation()
                  onUpdate({ ...currentOptions, dateFormat, includeTime, timeFormat: option.value })
                }}
                className={cn(
                  'flex-1 px-2 py-1.5 rounded text-sm hover:bg-muted transition-colors text-center',
                  timeFormat === option.value && 'bg-primary text-primary-foreground hover:bg-primary'
                )}
              >
                <div>{option.label}</div>
                <div className="text-xs opacity-70">{option.example}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
