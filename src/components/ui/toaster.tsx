/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState, ReactNode } from 'react'

type Toast = {
  id: string
  title?: string
  description?: string
  variant?: 'default' | 'success' | 'destructive'
}

type ToastContextValue = {
  show: (toast: Omit<Toast, 'id'>) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export function ToasterProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const show = useCallback((t: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { id, ...t }])
    // auto-dismiss after 2.5s
    setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id))
    }, 2500)
  }, [])

  const value = useMemo(() => ({ show }), [show])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-4 right-4 z-[9999] space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`rounded border px-3 py-2 shadow bg-background text-foreground ${
              t.variant === 'destructive'
                ? 'border-destructive bg-destructive text-destructive-foreground'
                : t.variant === 'success'
                ? 'border-emerald-600 bg-emerald-600 text-white'
                : 'border-border'
            }`}
          >
            {t.title && <div className="text-sm font-medium">{t.title}</div>}
            {t.description && <div className="text-xs opacity-90">{t.description}</div>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToasterProvider')
  return ctx
}




