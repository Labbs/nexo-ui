import { Plus, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { selectOptionColors } from '@/lib/database/columnTypes'
import type { ConditionalRule } from '@/lib/database/conditionalStyles'

interface ConditionalFormatEditorProps {
  rules: ConditionalRule[]
  columnType: string
  onUpdate: (rules: ConditionalRule[]) => void
}

type ConditionType = ConditionalRule['condition']

// Conditions available per type
const numericConditions: ConditionType[] = ['gt', 'lt', 'gte', 'lte', 'eq', 'neq', 'empty', 'not_empty']
const textConditions: ConditionType[] = ['eq', 'neq', 'contains', 'empty', 'not_empty']
const dateConditions: ConditionType[] = ['eq', 'neq', 'gt', 'lt', 'empty', 'not_empty']
const checkboxConditions: ConditionType[] = ['eq', 'empty', 'not_empty']

function getConditionsForType(columnType: string): ConditionType[] {
  switch (columnType) {
    case 'number':
    case 'currency':
      return numericConditions
    case 'date':
      return dateConditions
    case 'checkbox':
      return checkboxConditions
    default:
      return textConditions
  }
}

function needsValue(condition: ConditionType): boolean {
  return !['empty', 'not_empty'].includes(condition)
}

export function ConditionalFormatEditor({
  rules,
  columnType,
  onUpdate,
}: ConditionalFormatEditorProps) {
  const { t } = useTranslation('database')
  const availableConditions = getConditionsForType(columnType)

  const conditionLabels: Record<ConditionType, string> = {
    gt: t('conditionalFormat.greaterThan'),
    lt: t('conditionalFormat.lessThan'),
    gte: t('conditionalFormat.greaterOrEqual'),
    lte: t('conditionalFormat.lessOrEqual'),
    eq: t('conditionalFormat.equals'),
    neq: t('conditionalFormat.notEquals'),
    contains: t('conditionalFormat.contains'),
    empty: t('conditionalFormat.isEmpty'),
    not_empty: t('conditionalFormat.isNotEmpty'),
  }

  const addRule = () => {
    const newRule: ConditionalRule = {
      condition: availableConditions[0],
      value: columnType === 'number' || columnType === 'currency' ? 0 : '',
      bgColor: 'default',
      textColor: undefined,
    }
    onUpdate([...rules, newRule])
  }

  const updateRule = (index: number, updates: Partial<ConditionalRule>) => {
    const newRules = rules.map((rule, i) =>
      i === index ? { ...rule, ...updates } : rule
    )
    onUpdate(newRules)
  }

  const deleteRule = (index: number) => {
    onUpdate(rules.filter((_, i) => i !== index))
  }

  return (
    <div className="p-2 space-y-3" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-medium text-muted-foreground">{t('conditionalFormat.rules')}</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs"
          onClick={(e) => {
            e.stopPropagation()
            addRule()
          }}
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          {t('conditionalFormat.addRule')}
        </Button>
      </div>

      {rules.length === 0 ? (
        <div className="text-xs text-muted-foreground text-center py-4 px-2">
          {t('conditionalFormat.noRules')}
        </div>
      ) : (
        <div className="space-y-2">
          {rules.map((rule, index) => (
            <div
              key={index}
              className="p-2 rounded-md border bg-muted/30 space-y-2"
            >
              {/* Condition row */}
              <div className="flex items-center gap-2">
                <Select
                  value={rule.condition}
                  onValueChange={(condition) =>
                    updateRule(index, { condition: condition as ConditionType })
                  }
                >
                  <SelectTrigger className="h-7 flex-1 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableConditions.map((cond) => (
                      <SelectItem key={cond} value={cond} className="text-xs">
                        {conditionLabels[cond]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteRule(index)
                  }}
                  className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Value input */}
              {needsValue(rule.condition) && (
                <Input
                  value={String(rule.value ?? '')}
                  onChange={(e) => {
                    const newValue = (columnType === 'number' || columnType === 'currency')
                      ? (e.target.value === '' ? '' : Number(e.target.value))
                      : e.target.value
                    updateRule(index, { value: newValue })
                  }}
                  placeholder={t('conditionalFormat.value')}
                  type={(columnType === 'number' || columnType === 'currency') ? 'number' : 'text'}
                  className="h-7 text-xs"
                  onClick={(e) => e.stopPropagation()}
                />
              )}

              {/* Color pickers */}
              <div className="space-y-2">
                <div>
                  <span className="text-xs text-muted-foreground">{t('conditionalFormat.backgroundColor')}</span>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        updateRule(index, { bgColor: undefined })
                      }}
                      className={cn(
                        'w-5 h-5 rounded border-2 border-dashed border-muted-foreground/30',
                        !rule.bgColor && 'ring-2 ring-primary ring-offset-1'
                      )}
                      title={t('conditionalFormat.none')}
                    />
                    {selectOptionColors.map((color) => (
                      <button
                        key={color.value}
                        onClick={(e) => {
                          e.stopPropagation()
                          updateRule(index, { bgColor: color.value })
                        }}
                        className={cn(
                          'w-5 h-5 rounded',
                          color.bg,
                          rule.bgColor === color.value && 'ring-2 ring-primary ring-offset-1'
                        )}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">{t('conditionalFormat.textColor')}</span>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        updateRule(index, { textColor: undefined })
                      }}
                      className={cn(
                        'w-5 h-5 rounded border-2 border-dashed border-muted-foreground/30',
                        !rule.textColor && 'ring-2 ring-primary ring-offset-1'
                      )}
                      title={t('conditionalFormat.none')}
                    />
                    {selectOptionColors.map((color) => (
                      <button
                        key={color.value}
                        onClick={(e) => {
                          e.stopPropagation()
                          updateRule(index, { textColor: color.value })
                        }}
                        className={cn(
                          'w-5 h-5 rounded',
                          color.bg,
                          rule.textColor === color.value && 'ring-2 ring-primary ring-offset-1'
                        )}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
