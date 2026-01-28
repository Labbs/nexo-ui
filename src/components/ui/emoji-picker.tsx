import { useState } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

// Common emojis grouped by category
const EMOJI_CATEGORIES = {
  'Recent': ['📄', '📝', '📋', '📁', '📂', '🗂️', '📑', '📰'],
  'Documents': ['📄', '📝', '📋', '📁', '📂', '🗂️', '📑', '📰', '📓', '📔', '📒', '📕', '📗', '📘', '📙'],
  'Objects': ['💡', '🔧', '⚙️', '🔨', '🛠️', '📎', '✂️', '📌', '📍', '🔑', '🔒', '🔓', '💎', '🎯', '🎨'],
  'Symbols': ['✅', '❌', '⭐', '🌟', '💫', '⚡', '🔥', '💥', '❤️', '💙', '💚', '💛', '💜', '🖤', '🤍'],
  'People': ['👤', '👥', '👨‍💻', '👩‍💻', '🧑‍💼', '👨‍💼', '👩‍💼', '🤝', '👋', '✋', '👍', '👎', '👏', '🙌', '💪'],
  'Nature': ['🌱', '🌿', '🍀', '🌳', '🌲', '🌴', '🌵', '🌸', '🌺', '🌻', '🌹', '🍁', '🍂', '🌈', '☀️'],
  'Food': ['🍎', '🍊', '🍋', '🍇', '🍓', '🍒', '🍑', '🥑', '🥕', '🌽', '🍕', '🍔', '🍟', '🍿', '☕'],
  'Travel': ['🏠', '🏢', '🏬', '🏭', '🏛️', '⛪', '🕌', '🏰', '🗼', '🗽', '✈️', '🚗', '🚀', '🛸', '🌍'],
}

interface EmojiPickerProps {
  value?: string | null
  onChange: (emoji: string) => void
  children: React.ReactNode
}

export function EmojiPicker({ value, onChange, children }: EmojiPickerProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const handleSelect = (emoji: string) => {
    onChange(emoji)
    setOpen(false)
    setSearch('')
  }

  // Filter emojis based on search (basic - just checks if emoji is in any category)
  const filteredCategories = search
    ? Object.entries(EMOJI_CATEGORIES).reduce((acc, [category, emojis]) => {
        const filtered = emojis.filter(emoji =>
          emoji.toLowerCase().includes(search.toLowerCase())
        )
        if (filtered.length > 0) {
          acc[category] = filtered
        }
        return acc
      }, {} as Record<string, string[]>)
    : EMOJI_CATEGORIES

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 z-[100]" align="start" side="right" sideOffset={8}>
        <div className="p-2 border-b">
          <Input
            placeholder="Search emoji..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8"
          />
        </div>
        <div className="max-h-64 overflow-y-auto p-2">
          {Object.entries(filteredCategories).map(([category, emojis]) => (
            <div key={category} className="mb-3">
              <div className="text-xs font-medium text-muted-foreground mb-1 px-1">
                {category}
              </div>
              <div className="grid grid-cols-8 gap-0.5">
                {emojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleSelect(emoji)}
                    className={cn(
                      "h-8 w-8 flex items-center justify-center rounded hover:bg-accent text-lg transition-colors",
                      value === emoji && "bg-accent"
                    )}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        {value && (
          <div className="border-t p-2">
            <button
              onClick={() => handleSelect('')}
              className="w-full text-sm text-muted-foreground hover:text-foreground py-1 px-2 rounded hover:bg-accent transition-colors"
            >
              Remove icon
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
