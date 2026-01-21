// Conditional styling utilities

export interface ConditionalRule {
  condition: 'gt' | 'lt' | 'eq' | 'neq' | 'gte' | 'lte' | 'contains' | 'empty' | 'not_empty'
  value?: string | number
  bgColor?: string
  textColor?: string
}

export interface ConditionalStyleResult {
  bgColor?: string
  textColor?: string
}

/**
 * Evaluate conditional rules for a cell and return the style to apply
 */
export function evaluateConditionalStyle(
  value: unknown,
  rules: ConditionalRule[] | undefined
): ConditionalStyleResult | null {
  if (!rules || rules.length === 0) return null

  for (const rule of rules) {
    let matches = false

    switch (rule.condition) {
      case 'gt':
        matches = typeof value === 'number' && value > Number(rule.value)
        break
      case 'lt':
        matches = typeof value === 'number' && value < Number(rule.value)
        break
      case 'gte':
        matches = typeof value === 'number' && value >= Number(rule.value)
        break
      case 'lte':
        matches = typeof value === 'number' && value <= Number(rule.value)
        break
      case 'eq':
        matches = String(value) === String(rule.value)
        break
      case 'neq':
        matches = String(value) !== String(rule.value)
        break
      case 'contains':
        matches = String(value).toLowerCase().includes(String(rule.value).toLowerCase())
        break
      case 'empty':
        matches = value == null || value === '' || (typeof value === 'number' && isNaN(value))
        break
      case 'not_empty':
        matches = value != null && value !== '' && !(typeof value === 'number' && isNaN(value))
        break
    }

    if (matches) {
      return { bgColor: rule.bgColor, textColor: rule.textColor }
    }
  }

  return null
}
