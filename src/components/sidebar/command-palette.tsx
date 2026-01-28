import { useState, useRef, useEffect, useMemo } from 'react'
import { Search, FileText, FolderKanban } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useUIState } from '@/contexts/ui-state-context'
import { useCurrentSpace } from '@/contexts/space-context'
import { useDocuments, useCreateDocument } from '@/hooks/use-documents'
import { useFavorites } from '@/hooks/use-favorites'
import { useSpaces } from '@/hooks/use-spaces'
import { Kbd } from '@/components/ui/kbd'
import { parseStoredIcon } from '@/lib/utils'
import { DocumentIcon } from '@/components/ui/icon-picker'

export function CommandPalette() {
  const { t } = useTranslation('navigation')
  const { isCommandPaletteOpen, setCommandPaletteOpen } = useUIState()
  const navigate = useNavigate()
  const { currentSpace } = useCurrentSpace()
  const { data: documents = [] } = useDocuments(currentSpace?.id)
  const { data: favorites = [] } = useFavorites()
  const { data: spaces = [] } = useSpaces()
  const { mutateAsync: createDocument } = useCreateDocument()

  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  // Reset state when opening
  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isCommandPaletteOpen])

  // Build items list
  const items = useMemo(() => {
    const result: PaletteItem[] = []

    if (query.trim()) {
      // Search in documents
      const q = query.toLowerCase()
      const matchedDocs = documents.filter((doc: any) =>
        doc.name?.toLowerCase().includes(q)
      )
      matchedDocs.forEach((doc: any) => {
        result.push({
          id: `doc-${doc.id}`,
          type: 'document',
          title: doc.name || t('common:untitled'),
          icon: doc.config?.icon,
          action: () => {
            if (currentSpace?.id && doc.slug) {
              navigate(`/space/${currentSpace.id}/${doc.slug}`)
            }
            setCommandPaletteOpen(false)
          },
        })
      })
    } else {
      // Show recent (favorites)
      if (favorites.length > 0) {
        result.push({ id: 'section-recent', type: 'section', title: t('commandPalette.recent') })
        favorites.slice(0, 5).forEach((fav: any) => {
          const doc = fav.document
          if (!doc) return
          result.push({
            id: `fav-${fav.id}`,
            type: 'document',
            title: doc.name || t('common:untitled'),
            icon: doc.config?.icon,
            action: () => {
              if (currentSpace?.id && doc.slug) {
                navigate(`/space/${currentSpace.id}/${doc.slug}`)
              }
              setCommandPaletteOpen(false)
            },
          })
        })
      }

      // Quick actions
      result.push({ id: 'section-actions', type: 'section', title: t('commandPalette.quickActions') })
      result.push({
        id: 'action-new-doc',
        type: 'action',
        title: t('commandPalette.newDocument'),
        shortcut: '⌘N',
        action: async () => {
          if (!currentSpace?.id) return
          try {
            const doc = await createDocument({ spaceId: currentSpace.id })
            const slug = (doc as any).slug
            if (slug) navigate(`/space/${currentSpace.id}/${slug}`)
          } catch {
            // ignore
          }
          setCommandPaletteOpen(false)
        },
      })
    }

    return result
  }, [query, documents, favorites, currentSpace, spaces, navigate, setCommandPaletteOpen, createDocument, t])

  // Selectable items (exclude sections)
  const selectableItems = items.filter((item) => item.type !== 'section')

  // Keyboard navigation
  useEffect(() => {
    if (!isCommandPaletteOpen) return

    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => Math.min(prev + 1, selectableItems.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => Math.max(prev - 1, 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        selectableItems[selectedIndex]?.action?.()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        setCommandPaletteOpen(false)
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isCommandPaletteOpen, selectableItems, selectedIndex, setCommandPaletteOpen])

  // Reset selected index when items change
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  if (!isCommandPaletteOpen) return null

  let selectableIndex = -1

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setCommandPaletteOpen(false)}
      />

      {/* Modal */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-[560px]">
        <div className="bg-popover border border-border rounded-xl overflow-hidden shadow-2xl">
          {/* Search input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('commandPalette.placeholder')}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <button
              onClick={() => setCommandPaletteOpen(false)}
              className="shrink-0"
            >
              <Kbd>ESC</Kbd>
            </button>
          </div>

          {/* Results */}
          <div className="max-h-80 overflow-y-auto py-2">
            {query.trim() && selectableItems.length === 0 ? (
              <div className="px-4 py-6 text-sm text-muted-foreground text-center">
                {t('commandPalette.noResults')}
              </div>
            ) : (
              items.map((item) => {
                if (item.type === 'section') {
                  return (
                    <div
                      key={item.id}
                      className="px-4 pt-3 pb-1 text-[11px] font-medium text-muted-foreground uppercase tracking-wider"
                    >
                      {item.title}
                    </div>
                  )
                }

                selectableIndex++
                const isSelected = selectableIndex === selectedIndex
                const iconValue = item.icon ? parseStoredIcon(item.icon) : null

                return (
                  <button
                    key={item.id}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                      isSelected ? 'bg-accent text-foreground' : 'text-foreground/80 hover:bg-accent'
                    }`}
                    onClick={() => item.action?.()}
                    onMouseEnter={() => setSelectedIndex(selectableIndex)}
                  >
                    {item.type === 'document' && (
                      iconValue ? (
                        <DocumentIcon value={iconValue} size="sm" />
                      ) : (
                        <FileText className="h-4 w-4 shrink-0 opacity-60" />
                      )
                    )}
                    {item.type === 'action' && (
                      <FolderKanban className="h-4 w-4 shrink-0 opacity-60" />
                    )}
                    <span className="flex-1 text-left truncate">{item.title}</span>
                    {item.shortcut && <Kbd>{item.shortcut}</Kbd>}
                  </button>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

interface PaletteItem {
  id: string
  type: 'document' | 'action' | 'section'
  title: string
  icon?: string
  shortcut?: string
  action?: (() => void) | (() => Promise<void>)
}
