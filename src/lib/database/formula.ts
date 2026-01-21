// Formula evaluation utilities

export interface ColumnRef {
  id: string
  title: string
  type: string
}

export interface FormulaResult {
  value: number | string | null
  error?: string
}

/**
 * Evaluate a formula expression
 * Supports: column references (prop("column_id")), basic math (+, -, *, /), and functions
 */
export function evaluateFormula(
  formula: string,
  row: Record<string, unknown>,
  columns: ColumnRef[]
): FormulaResult {
  if (!formula) return { value: null }

  try {
    // Replace prop("column_id") or prop("column_name") with actual values
    let expression = formula.replace(/prop\s*\(\s*["']([^"']+)["']\s*\)/g, (_, ref) => {
      // Try to find column by id first, then by name
      const col = columns.find(c => c.id === ref || c.title === ref)
      if (!col) return '0'
      const val = row[col.id]
      if (val == null) return '0'
      if (typeof val === 'number') return String(val)
      if (typeof val === 'boolean') return val ? '1' : '0'
      const num = parseFloat(String(val))
      return isNaN(num) ? '0' : String(num)
    })

    // Handle built-in functions
    // IF(condition, then, else)
    expression = expression.replace(
      /IF\s*\(\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^)]+)\s*\)/gi,
      (_, cond, thenVal, elseVal) => {
        try {
          // Simple condition evaluation (supports >, <, >=, <=, ==, !=)
          const condResult = Function('"use strict"; return (' + cond + ')')()
          return condResult ? thenVal : elseVal
        } catch {
          return '0'
        }
      }
    )

    // ABS(value)
    expression = expression.replace(/ABS\s*\(\s*([^)]+)\s*\)/gi, (_, val) => {
      try {
        const num = Function('"use strict"; return (' + val + ')')()
        return String(Math.abs(num))
      } catch {
        return '0'
      }
    })

    // ROUND(value, decimals)
    expression = expression.replace(/ROUND\s*\(\s*([^,]+)\s*,?\s*([^)]*)\s*\)/gi, (_, val, dec) => {
      try {
        const num = Function('"use strict"; return (' + val + ')')()
        const decimals = dec ? parseInt(dec) : 0
        return String(Number(num.toFixed(decimals)))
      } catch {
        return '0'
      }
    })

    // MIN(a, b, ...)
    expression = expression.replace(/MIN\s*\(\s*([^)]+)\s*\)/gi, (_, args) => {
      try {
        const values = args.split(',').map((v: string) => Function('"use strict"; return (' + v.trim() + ')')())
        return String(Math.min(...values))
      } catch {
        return '0'
      }
    })

    // MAX(a, b, ...)
    expression = expression.replace(/MAX\s*\(\s*([^)]+)\s*\)/gi, (_, args) => {
      try {
        const values = args.split(',').map((v: string) => Function('"use strict"; return (' + v.trim() + ')')())
        return String(Math.max(...values))
      } catch {
        return '0'
      }
    })

    // Evaluate the final expression (basic math only)
    // Security: only allow numbers, operators, parentheses, and whitespace
    if (!/^[\d\s+\-*/.()]+$/.test(expression)) {
      return { value: null, error: 'Invalid formula' }
    }

    const result = Function('"use strict"; return (' + expression + ')')()
    if (typeof result === 'number' && !isNaN(result)) {
      return { value: result }
    }
    return { value: null, error: 'Invalid result' }
  } catch (e) {
    return { value: null, error: String(e) }
  }
}
