export function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="text-[11px] text-muted-foreground bg-muted/50 border border-border/50 rounded px-1 py-0.5 font-mono">
      {children}
    </kbd>
  )
}
