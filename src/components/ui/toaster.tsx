/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react'

type Toast = {
  id: string
  title?: string
  description?: string
  variant?: 'default' | 'success' | 'destructive'
}

type ToastPayload = Omit<Toast, 'id'>

type ToastContextValue = {
  show: (toast: ToastPayload) => void
}

// Global event-based toast so it can be called outside React (e.g. Axios interceptors)
type Listener = (t: ToastPayload) => void
const listeners = new Set<Listener>()

export function toast(payload: ToastPayload) {
  listeners.forEach((fn) => fn(payload))
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export function ToasterProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const show = useCallback((t: ToastPayload) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { id, ...t }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id))
    }, 4000)
  }, [])

  // Subscribe to global toast events
  useEffect(() => {
    listeners.add(show)
    return () => { listeners.delete(show) }
  }, [show])

  const value = useMemo(() => ({ show }), [show])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`animate-in slide-in-from-top-2 fade-in rounded-lg border px-4 py-3 shadow-lg backdrop-blur-sm transition-all ${
              t.variant === 'destructive'
                ? 'border-destructive/50 bg-destructive text-destructive-foreground'
                : t.variant === 'success'
                ? 'border-emerald-600/50 bg-emerald-600 text-white'
                : 'border-border bg-background text-foreground'
            }`}
          >
            {t.title && <div className="text-sm font-semibold">{t.title}</div>}
            {t.description && <div className="text-xs opacity-90 mt-0.5">{t.description}</div>}
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




