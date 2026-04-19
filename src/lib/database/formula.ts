export interface ColumnRef {
  id: string
  title: string
  type: string
}

export interface FormulaResult {
  value: number | string | null
  error?: string
}

// Safe recursive-descent parser — no eval() or Function() constructor.
function safeEval(expr: string): number {
  expr = expr.replace(/\s+/g, '')
  let pos = 0

  function parseExpr(): number { return parseAddSub() }

  function parseAddSub(): number {
    let left = parseMulDiv()
    while (pos < expr.length && (expr[pos] === '+' || expr[pos] === '-')) {
      const op = expr[pos++]
      const right = parseMulDiv()
      left = op === '+' ? left + right : left - right
    }
    return left
  }

  function parseMulDiv(): number {
    let left = parseUnary()
    while (pos < expr.length && (expr[pos] === '*' || expr[pos] === '/')) {
      const op = expr[pos++]
      const right = parseUnary()
      if (op === '/') {
        if (right === 0) throw new Error('division by zero')
        left = left / right
      } else {
        left = left * right
      }
    }
    return left
  }

  function parseUnary(): number {
    if (pos < expr.length && expr[pos] === '-') { pos++; return -parsePrimary() }
    if (pos < expr.length && expr[pos] === '+') { pos++; return parsePrimary() }
    return parsePrimary()
  }

  function parsePrimary(): number {
    if (pos < expr.length && expr[pos] === '(') {
      pos++
      const val = parseExpr()
      if (pos >= expr.length || expr[pos] !== ')') throw new Error("missing ')'")
      pos++
      return val
    }
    const start = pos
    if (pos < expr.length && (expr[pos] === '-' || expr[pos] === '+')) pos++
    while (pos < expr.length && (expr[pos] >= '0' && expr[pos] <= '9' || expr[pos] === '.')) pos++
    if (pos === start) throw new Error(`unexpected token at ${pos}`)
    const n = parseFloat(expr.slice(start, pos))
    if (isNaN(n)) throw new Error('invalid number')
    return n
  }

  const result = parseExpr()
  if (pos !== expr.length) throw new Error(`unexpected character '${expr[pos]}' at ${pos}`)
  return result
}

function safeEvalCondition(expr: string): boolean {
  const m = expr.replace(/\s+/g, '').match(/^(.+?)(>=|<=|==|!=|>|<)(.+)$/)
  if (m) {
    const l = safeEval(m[1]), r = safeEval(m[3])
    switch (m[2]) {
      case '>':  return l > r
      case '<':  return l < r
      case '>=': return l >= r
      case '<=': return l <= r
      case '==': return l === r
      case '!=': return l !== r
    }
  }
  return safeEval(expr) !== 0
}

/**
 * Evaluate a formula expression.
 * Supports: prop("column_id"), basic math (+, -, *, /), and IF/ABS/ROUND/MIN/MAX.
 * Does NOT use eval() or Function() — fully safe against code injection.
 */
export function evaluateFormula(
  formula: string,
  row: Record<string, unknown>,
  columns: ColumnRef[]
): FormulaResult {
  if (!formula) return { value: null }

  try {
    // Replace prop("column_id") with numeric values
    let expression = formula.replace(/prop\s*\(\s*["']([^"']+)["']\s*\)/g, (_, ref) => {
      const col = columns.find(c => c.id === ref || c.title === ref)
      if (!col) return '0'
      const val = row[col.id]
      if (val == null) return '0'
      if (typeof val === 'number') return String(val)
      if (typeof val === 'boolean') return val ? '1' : '0'
      const num = parseFloat(String(val))
      return isNaN(num) ? '0' : String(num)
    })

    // IF(condition, thenVal, elseVal)
    expression = expression.replace(
      /IF\s*\(\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^)]+)\s*\)/gi,
      (_, cond, thenVal, elseVal) => {
        try { return safeEvalCondition(cond) ? thenVal : elseVal } catch { return '0' }
      }
    )

    // ABS(value)
    expression = expression.replace(/ABS\s*\(\s*([^)]+)\s*\)/gi, (_, val) => {
      try { return String(Math.abs(safeEval(val))) } catch { return '0' }
    })

    // ROUND(value, decimals?)
    expression = expression.replace(/ROUND\s*\(\s*([^,)]+)\s*,?\s*([^)]*)\s*\)/gi, (_, val, dec) => {
      try {
        const n = safeEval(val)
        const d = dec ? parseInt(dec, 10) : 0
        return String(Number(n.toFixed(isNaN(d) ? 0 : d)))
      } catch { return '0' }
    })

    // MIN(a, b, ...)
    expression = expression.replace(/MIN\s*\(\s*([^)]+)\s*\)/gi, (_, args) => {
      try {
        const vals = args.split(',').map((v: string) => safeEval(v.trim()))
        return String(Math.min(...vals))
      } catch { return '0' }
    })

    // MAX(a, b, ...)
    expression = expression.replace(/MAX\s*\(\s*([^)]+)\s*\)/gi, (_, args) => {
      try {
        const vals = args.split(',').map((v: string) => safeEval(v.trim()))
        return String(Math.max(...vals))
      } catch { return '0' }
    })

    const result = safeEval(expression)
    if (!isNaN(result)) return { value: result }
    return { value: null, error: 'Invalid result' }
  } catch (e) {
    return { value: null, error: String(e) }
  }
}
