import { useState } from 'react'
import { Smile, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface IconEmojiSelectorProps {
  currentIcon?: string
  isUpdating: boolean
  onApplyIcon: (icon: string | null) => void
}

const EMOJI_OPTIONS = [
  '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃',
  '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙',
  '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔',
  '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥',
  '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮',
  '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓',
  '🧐', '😕', '😟', '🙁', '☹️', '😮', '😯', '😲', '😳', '🥺',
  '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣',
  '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈',
  '👿', '💀', '☠️', '💩', '🤡',
]

const ICON_OPTIONS = [
  '📄', '📝', '📋', '📊', '📈', '📉', '📁', '📂', '🗂️', '📌',
  '📍', '📎', '🔗', '📚', '📖', '📕', '📗', '📘', '📙', '📓',
  '📔', '📒', '📃', '📰', '🗞️', '📑', '🔖', '🏷️', '💼', '📂',
  '🗃️', '🗄️', '🗑️', '📬', '📭', '📮', '📧', '📨', '📩', '📤',
  '📥', '📦', '📫', '💡', '🔦', '🔬', '🔭', '🗡️', '⚔️', '🛡️',
  '🔧', '🔨', '⚒️', '🛠️', '⚙️', '🔩', '⚖️', '🧰', '🧲', '🧪',
  '🧫', '🧬', '🧯', '🔥', '💧', '🌊', '⚡', '❄️', '💨', '☀️',
  '⭐', '🌟', '✨', '💫', '🌙', '☁️', '🌈', '🎯', '🎨', '🎭',
  '🎪', '🎬', '🎤', '🎧', '🎼', '🎵', '🎶', '🎹', '🥁', '🎸',
  '🎺', '🎷', '🎻', '🎲', '♟️', '🎰', '🎮', '🕹️', '🎳', '🎯',
  '🏆', '🥇', '🥈', '🥉', '🏅', '🎖️', '🏵️', '🎗️', '🎫', '🎟️',
  '🎪', '🎨', '🎬', '🎤', '🎧', '🎼', '🎵', '🎶', '🎹', '🥁',
  '🎸', '🎺', '🎷', '🎻', '🎲', '♟️', '🎰', '🎮', '🕹️', '🎳',
  '🎯', '🚀', '✈️', '🚁', '🚂', '🚃', '🚄', '🚅', '🚆', '🚇',
]

export function IconEmojiSelector({ currentIcon, isUpdating, onApplyIcon }: IconEmojiSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'emoji' | 'icon'>('emoji')

  const options = activeTab === 'emoji' ? EMOJI_OPTIONS : ICON_OPTIONS

  return (
    <div className="border-b pb-4">
      {/* Accordion header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 w-full text-sm font-medium py-2 hover:bg-accent rounded px-2 transition-colors"
      >
        <Smile className="h-4 w-4" />
        <span>Choose your icon</span>
      </button>

      {isOpen && (
        <div className="mt-2 space-y-3">
          {/* Current icon display with remove button */}
          {currentIcon && (
            <div className="flex items-center justify-between px-2">
              <span className="text-2xl">{currentIcon}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onApplyIcon(null)}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <X className="h-4 w-4 mr-1" />
                    Remove
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Tab buttons */}
          <div className="flex gap-2 px-2">
            <Button
              variant={activeTab === 'emoji' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('emoji')}
              className="flex-1"
            >
              Emojis
            </Button>
            <Button
              variant={activeTab === 'icon' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('icon')}
              className="flex-1"
            >
              Icons
            </Button>
          </div>

          {/* Grid of options */}
          <div className="grid grid-cols-5 gap-1 px-2 max-h-60 overflow-y-auto">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => onApplyIcon(option)}
                disabled={isUpdating}
                className={cn(
                  'h-10 w-full text-xl rounded hover:bg-accent transition-colors disabled:opacity-50',
                  currentIcon === option && 'bg-primary/10 ring-2 ring-primary'
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
