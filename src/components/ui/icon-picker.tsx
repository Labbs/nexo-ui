/* eslint-disable react-refresh/only-export-components */
import { useState, useMemo } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import {
  FileText,
  Folder,
  FolderOpen,
  File,
  FileCode,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  FileSpreadsheet,
  FileType,
  FilePlus,
  FileCheck,
  FileX,
  FileClock,
  FileSearch,
  Star,
  Heart,
  Bookmark,
  Flag,
  Tag,
  Hash,
  AtSign,
  Mail,
  MessageSquare,
  MessageCircle,
  Bell,
  Calendar,
  Clock,
  Timer,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  HelpCircle,
  Lightbulb,
  Zap,
  Flame,
  Sparkles,
  Target,
  Crosshair,
  Award,
  Trophy,
  Medal,
  Crown,
  Gem,
  Gift,
  Package,
  Box,
  Archive,
  Inbox,
  Send,
  Cloud,
  Database,
  Server,
  HardDrive,
  Cpu,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Square,
  Circle,
  Triangle,
  Hexagon,
  Pentagon,
  Octagon,
  Home,
  Building,
  Building2,
  Store,
  Warehouse,
  Factory,
  School,
  Landmark,
  Map,
  MapPin,
  Compass,
  Globe,
  Users,
  User,
  UserPlus,
  UserCheck,
  UserCircle,
  Contact,
  BadgeCheck,
  ShieldCheck,
  Lock,
  Unlock,
  Key,
  Search,
  Filter,
  SlidersHorizontal,
  Settings,
  Wrench,
  Hammer,
  Paintbrush,
  Pencil,
  Pen,
  Eraser,
  Highlighter,
  Ruler,
  Scissors,
  Paperclip,
  Link,
  Share,
  ExternalLink,
  Clipboard,
  ClipboardCheck,
  ClipboardList,
  List,
  ListChecks,
  ListTodo,
  CheckSquare,
  SquareCheck,
  CircleCheck,
  CircleDot,
  Plus,
  Minus,
  X,
  Check,
  Grid,
  LayoutGrid,
  LayoutList,
  Columns,
  Rows,
  Table,
  Kanban,
  PieChart,
  BarChart,
  LineChart,
  TrendingUp,
  TrendingDown,
  Activity,
  Wallet,
  CreditCard,
  DollarSign,
  Euro,
  Banknote,
  Coins,
  Receipt,
  Calculator,
  Percent,
  Shuffle,
  type LucideIcon,
} from 'lucide-react'

// Icon value type - supports both emoji strings and icon objects
export type IconValue = string | { name: string; color: string } | null

// Available icons grouped by category
const ICON_CATEGORIES: Record<string, { name: string; icon: LucideIcon }[]> = {
  'Documents': [
    { name: 'file-text', icon: FileText },
    { name: 'file', icon: File },
    { name: 'file-code', icon: FileCode },
    { name: 'file-image', icon: FileImage },
    { name: 'file-video', icon: FileVideo },
    { name: 'file-audio', icon: FileAudio },
    { name: 'file-archive', icon: FileArchive },
    { name: 'file-spreadsheet', icon: FileSpreadsheet },
    { name: 'file-type', icon: FileType },
    { name: 'file-plus', icon: FilePlus },
    { name: 'file-check', icon: FileCheck },
    { name: 'file-x', icon: FileX },
    { name: 'file-clock', icon: FileClock },
    { name: 'file-search', icon: FileSearch },
    { name: 'folder', icon: Folder },
    { name: 'folder-open', icon: FolderOpen },
  ],
  'Status': [
    { name: 'check-circle', icon: CheckCircle },
    { name: 'x-circle', icon: XCircle },
    { name: 'alert-circle', icon: AlertCircle },
    { name: 'info', icon: Info },
    { name: 'help-circle', icon: HelpCircle },
    { name: 'check-square', icon: CheckSquare },
    { name: 'square-check', icon: SquareCheck },
    { name: 'circle-check', icon: CircleCheck },
    { name: 'circle-dot', icon: CircleDot },
    { name: 'check', icon: Check },
    { name: 'x', icon: X },
    { name: 'plus', icon: Plus },
    { name: 'minus', icon: Minus },
  ],
  'Favorites': [
    { name: 'star', icon: Star },
    { name: 'heart', icon: Heart },
    { name: 'bookmark', icon: Bookmark },
    { name: 'flag', icon: Flag },
    { name: 'tag', icon: Tag },
    { name: 'award', icon: Award },
    { name: 'trophy', icon: Trophy },
    { name: 'medal', icon: Medal },
    { name: 'crown', icon: Crown },
    { name: 'gem', icon: Gem },
  ],
  'Communication': [
    { name: 'mail', icon: Mail },
    { name: 'message-square', icon: MessageSquare },
    { name: 'message-circle', icon: MessageCircle },
    { name: 'bell', icon: Bell },
    { name: 'at-sign', icon: AtSign },
    { name: 'hash', icon: Hash },
    { name: 'send', icon: Send },
    { name: 'share', icon: Share },
    { name: 'link', icon: Link },
    { name: 'external-link', icon: ExternalLink },
  ],
  'Time': [
    { name: 'calendar', icon: Calendar },
    { name: 'clock', icon: Clock },
    { name: 'timer', icon: Timer },
  ],
  'Ideas': [
    { name: 'lightbulb', icon: Lightbulb },
    { name: 'zap', icon: Zap },
    { name: 'flame', icon: Flame },
    { name: 'sparkles', icon: Sparkles },
    { name: 'target', icon: Target },
    { name: 'crosshair', icon: Crosshair },
  ],
  'Objects': [
    { name: 'gift', icon: Gift },
    { name: 'package', icon: Package },
    { name: 'box', icon: Box },
    { name: 'archive', icon: Archive },
    { name: 'inbox', icon: Inbox },
    { name: 'clipboard', icon: Clipboard },
    { name: 'clipboard-check', icon: ClipboardCheck },
    { name: 'clipboard-list', icon: ClipboardList },
    { name: 'paperclip', icon: Paperclip },
    { name: 'scissors', icon: Scissors },
    { name: 'key', icon: Key },
    { name: 'lock', icon: Lock },
    { name: 'unlock', icon: Unlock },
  ],
  'Tools': [
    { name: 'settings', icon: Settings },
    { name: 'wrench', icon: Wrench },
    { name: 'hammer', icon: Hammer },
    { name: 'paintbrush', icon: Paintbrush },
    { name: 'pencil', icon: Pencil },
    { name: 'pen', icon: Pen },
    { name: 'eraser', icon: Eraser },
    { name: 'highlighter', icon: Highlighter },
    { name: 'ruler', icon: Ruler },
    { name: 'search', icon: Search },
    { name: 'filter', icon: Filter },
    { name: 'sliders-horizontal', icon: SlidersHorizontal },
  ],
  'Tech': [
    { name: 'database', icon: Database },
    { name: 'server', icon: Server },
    { name: 'hard-drive', icon: HardDrive },
    { name: 'cpu', icon: Cpu },
    { name: 'cloud', icon: Cloud },
    { name: 'monitor', icon: Monitor },
    { name: 'laptop', icon: Laptop },
    { name: 'smartphone', icon: Smartphone },
    { name: 'tablet', icon: Tablet },
  ],
  'People': [
    { name: 'user', icon: User },
    { name: 'users', icon: Users },
    { name: 'user-plus', icon: UserPlus },
    { name: 'user-check', icon: UserCheck },
    { name: 'user-circle', icon: UserCircle },
    { name: 'contact', icon: Contact },
    { name: 'badge-check', icon: BadgeCheck },
    { name: 'shield-check', icon: ShieldCheck },
  ],
  'Places': [
    { name: 'home', icon: Home },
    { name: 'building', icon: Building },
    { name: 'building-2', icon: Building2 },
    { name: 'store', icon: Store },
    { name: 'warehouse', icon: Warehouse },
    { name: 'factory', icon: Factory },
    { name: 'school', icon: School },
    { name: 'landmark', icon: Landmark },
    { name: 'map', icon: Map },
    { name: 'map-pin', icon: MapPin },
    { name: 'globe', icon: Globe },
    { name: 'compass', icon: Compass },
  ],
  'Finance': [
    { name: 'wallet', icon: Wallet },
    { name: 'credit-card', icon: CreditCard },
    { name: 'dollar-sign', icon: DollarSign },
    { name: 'euro', icon: Euro },
    { name: 'banknote', icon: Banknote },
    { name: 'coins', icon: Coins },
    { name: 'receipt', icon: Receipt },
    { name: 'calculator', icon: Calculator },
    { name: 'percent', icon: Percent },
  ],
  'Charts': [
    { name: 'pie-chart', icon: PieChart },
    { name: 'bar-chart', icon: BarChart },
    { name: 'line-chart', icon: LineChart },
    { name: 'trending-up', icon: TrendingUp },
    { name: 'trending-down', icon: TrendingDown },
    { name: 'activity', icon: Activity },
  ],
  'Lists': [
    { name: 'list', icon: List },
    { name: 'list-checks', icon: ListChecks },
    { name: 'list-todo', icon: ListTodo },
    { name: 'table', icon: Table },
    { name: 'kanban', icon: Kanban },
    { name: 'grid', icon: Grid },
    { name: 'layout-grid', icon: LayoutGrid },
    { name: 'layout-list', icon: LayoutList },
    { name: 'columns', icon: Columns },
    { name: 'rows', icon: Rows },
  ],
  'Shapes': [
    { name: 'circle', icon: Circle },
    { name: 'square', icon: Square },
    { name: 'triangle', icon: Triangle },
    { name: 'hexagon', icon: Hexagon },
    { name: 'pentagon', icon: Pentagon },
    { name: 'octagon', icon: Octagon },
  ],
}

// Emoji categories
const EMOJI_CATEGORIES: Record<string, string[]> = {
  'Smileys': ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '😉', '😌', '😍', '🥰', '😘', '😋'],
  'People': ['👤', '👥', '👨‍💻', '👩‍💻', '🧑‍💼', '👨‍💼', '👩‍💼', '🤝', '👋', '✋', '👍', '👎', '👏', '🙌', '💪', '🙏'],
  'Animals': ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔'],
  'Nature': ['🌱', '🌿', '🍀', '🌳', '🌲', '🌴', '🌵', '🌸', '🌺', '🌻', '🌹', '🍁', '🍂', '🌈', '☀️', '🌙'],
  'Food': ['🍎', '🍊', '🍋', '🍇', '🍓', '🍒', '🍑', '🥑', '🥕', '🌽', '🍕', '🍔', '🍟', '🍿', '☕', '🍺'],
  'Activities': ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🎮', '🎲', '🎯', '🎨', '🎭', '🎪', '🎬', '🎤', '🎧', '🎸'],
  'Travel': ['🏠', '🏢', '🏬', '🏭', '🏛️', '⛪', '🕌', '🏰', '🗼', '🗽', '✈️', '🚗', '🚀', '🛸', '🌍', '🗺️'],
  'Objects': ['💡', '🔧', '⚙️', '🔨', '🛠️', '📎', '✂️', '📌', '📍', '🔑', '🔒', '🔓', '💎', '🎯', '🎨', '📷'],
  'Symbols': ['✅', '❌', '⭐', '🌟', '💫', '⚡', '🔥', '💥', '❤️', '💙', '💚', '💛', '💜', '🖤', '🤍', '💯'],
  'Flags': ['🏳️', '🏴', '🚩', '🎌', '🏁', '🇫🇷', '🇺🇸', '🇬🇧', '🇩🇪', '🇪🇸', '🇮🇹', '🇯🇵', '🇰🇷', '🇨🇳', '🇧🇷', '🇨🇦'],
}

// All icons in a flat array for searching
const ALL_ICONS = Object.values(ICON_CATEGORIES).flat()

// Color palette
const ICON_COLORS = [
  { name: 'Gray', value: '#6b7280' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Yellow', value: '#eab308' },
  { name: 'Lime', value: '#84cc16' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Teal', value: '#14b8a6' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Sky', value: '#0ea5e9' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Violet', value: '#8b5cf6' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Fuchsia', value: '#d946ef' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Rose', value: '#f43f5e' },
]

// Default icon and color
const DEFAULT_ICON = 'file-text'
const DEFAULT_COLOR = '#6b7280'

// Helper to get icon component by name
export function getIconByName(name: string): LucideIcon | null {
  const found = ALL_ICONS.find(i => i.name === name)
  return found?.icon || null
}

// Helper to parse icon value
export function parseIconValue(value: IconValue | undefined): { name: string; color: string } | null {
  if (!value) return null

  // If it's a string, check if it's an emoji or icon name
  if (typeof value === 'string') {
    // Check if it looks like an emoji (not alphanumeric)
    if (!/^[a-z0-9-]+$/i.test(value)) {
      // It's an emoji - return null to show emoji directly
      return null
    }
    // It's an icon name without color
    return { name: value, color: DEFAULT_COLOR }
  }

  // It's an object with name and color
  return value
}

// Helper to check if value is an emoji
export function isEmoji(value: IconValue | undefined): boolean {
  if (!value) return false
  if (typeof value === 'string') {
    return !/^[a-z0-9-]+$/i.test(value)
  }
  return false
}

type TabType = 'emoji' | 'icons'

interface IconPickerProps {
  value?: IconValue
  onChange: (value: IconValue) => void
  children: React.ReactNode
  defaultTab?: TabType
}

export function IconPicker({ value, onChange, children, defaultTab = 'icons' }: IconPickerProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<TabType>(defaultTab)
  const [showColorPicker, setShowColorPicker] = useState(false)

  // Parse current value
  const currentIcon = useMemo(() => parseIconValue(value), [value])
  const currentIconName = currentIcon?.name || DEFAULT_ICON
  const currentColor = currentIcon?.color || DEFAULT_COLOR
  const currentEmoji = isEmoji(value) ? (value as string) : null

  const handleSelectIcon = (iconName: string) => {
    onChange({ name: iconName, color: currentColor })
  }

  const handleSelectEmoji = (emoji: string) => {
    onChange(emoji)
    setOpen(false)
  }

  const handleSelectColor = (color: string) => {
    onChange({ name: currentIconName, color })
    setShowColorPicker(false)
  }

  const handleRandomIcon = () => {
    const randomCategory = Object.keys(ICON_CATEGORIES)[Math.floor(Math.random() * Object.keys(ICON_CATEGORIES).length)]
    const icons = ICON_CATEGORIES[randomCategory]
    const randomIcon = icons[Math.floor(Math.random() * icons.length)]
    const randomColor = ICON_COLORS[Math.floor(Math.random() * ICON_COLORS.length)]
    onChange({ name: randomIcon.name, color: randomColor.value })
  }

  const handleRemove = () => {
    onChange(null)
    setOpen(false)
  }

  // Filter icons based on search
  const filteredIconCategories = useMemo(() => {
    if (!search) return ICON_CATEGORIES

    const searchLower = search.toLowerCase()
    return Object.entries(ICON_CATEGORIES).reduce((acc, [category, icons]) => {
      const filtered = icons.filter(icon =>
        icon.name.toLowerCase().includes(searchLower) ||
        category.toLowerCase().includes(searchLower)
      )
      if (filtered.length > 0) {
        acc[category] = filtered
      }
      return acc
    }, {} as typeof ICON_CATEGORIES)
  }, [search])

  // Filter emojis based on search
  const filteredEmojiCategories = useMemo(() => {
    if (!search) return EMOJI_CATEGORIES

    const searchLower = search.toLowerCase()
    return Object.entries(EMOJI_CATEGORIES).reduce((acc, [category, emojis]) => {
      if (category.toLowerCase().includes(searchLower)) {
        acc[category] = emojis
      }
      return acc
    }, {} as typeof EMOJI_CATEGORIES)
  }, [search])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 z-[100]" align="start" side="right" sideOffset={8}>
        {/* Header with tabs and remove */}
        <div className="flex items-center justify-between px-3 py-2 border-b">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('emoji')}
              className={cn(
                "text-sm font-medium transition-colors",
                activeTab === 'emoji'
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Emoji
            </button>
            <button
              onClick={() => setActiveTab('icons')}
              className={cn(
                "text-sm font-medium transition-colors",
                activeTab === 'icons'
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Icons
            </button>
          </div>
          {value && (
            <button
              onClick={handleRemove}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Remove
            </button>
          )}
        </div>

        {/* Search bar with actions */}
        <div className="p-2 border-b">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Filter..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 pl-8"
              />
            </div>
            {activeTab === 'icons' && (
              <>
                <button
                  onClick={handleRandomIcon}
                  className="h-8 w-8 flex items-center justify-center rounded border hover:bg-accent transition-colors"
                  title="Random icon"
                >
                  <Shuffle className="h-4 w-4" />
                </button>
                <Popover open={showColorPicker} onOpenChange={setShowColorPicker} modal={false}>
                  <PopoverTrigger asChild>
                    <button
                      className="h-8 w-8 flex items-center justify-center rounded border hover:bg-accent transition-colors"
                      title="Pick color"
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowColorPicker(!showColorPicker)
                      }}
                    >
                      <div
                        className="h-4 w-4 rounded-full"
                        style={{ backgroundColor: currentColor }}
                      />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-2 z-[200]"
                    align="end"
                    sideOffset={4}
                    onOpenAutoFocus={(e) => e.preventDefault()}
                    onCloseAutoFocus={(e) => e.preventDefault()}
                  >
                    <div className="grid grid-cols-6 gap-1">
                      {ICON_COLORS.map((color) => (
                        <button
                          key={color.value}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSelectColor(color.value)
                          }}
                          className={cn(
                            "w-6 h-6 rounded-full transition-all hover:scale-110",
                            currentColor === color.value && "ring-2 ring-offset-2 ring-primary"
                          )}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </>
            )}
          </div>
        </div>

        {/* Icons tab content */}
        {activeTab === 'icons' && (
          <div className="max-h-72 overflow-y-auto p-2">
            {Object.entries(filteredIconCategories).map(([category, icons]) => (
              <div key={category} className="mb-3">
                <div className="text-xs font-medium text-muted-foreground mb-1 px-1">
                  {category}
                </div>
                <div className="grid grid-cols-10 gap-0.5">
                  {icons.map(({ name, icon: IconComponent }) => (
                    <button
                      key={name}
                      onClick={() => handleSelectIcon(name)}
                      className={cn(
                        "h-7 w-7 flex items-center justify-center rounded hover:bg-accent transition-colors",
                        currentIconName === name && !currentEmoji && "bg-accent"
                      )}
                      title={name}
                    >
                      <IconComponent
                        className="h-4 w-4"
                        style={{ color: currentIconName === name && !currentEmoji ? currentColor : undefined }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            ))}
            {Object.keys(filteredIconCategories).length === 0 && (
              <div className="text-sm text-muted-foreground text-center py-4">
                No icons found
              </div>
            )}
          </div>
        )}

        {/* Emojis tab content */}
        {activeTab === 'emoji' && (
          <div className="max-h-72 overflow-y-auto p-2">
            {Object.entries(filteredEmojiCategories).map(([category, emojis]) => (
              <div key={category} className="mb-3">
                <div className="text-xs font-medium text-muted-foreground mb-1 px-1">
                  {category}
                </div>
                <div className="grid grid-cols-10 gap-0.5">
                  {emojis.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleSelectEmoji(emoji)}
                      className={cn(
                        "h-7 w-7 flex items-center justify-center rounded hover:bg-accent text-base transition-colors",
                        currentEmoji === emoji && "bg-accent"
                      )}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            {Object.keys(filteredEmojiCategories).length === 0 && (
              <div className="text-sm text-muted-foreground text-center py-4">
                No emojis found
              </div>
            )}
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

// Render icon component - handles both emoji and icon objects
interface DocumentIconProps {
  value?: IconValue
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function DocumentIcon({ value, className, size = 'md' }: DocumentIconProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 text-base',
    md: 'h-5 w-5 text-lg',
    lg: 'h-6 w-6 text-2xl',
    xl: 'h-8 w-8 text-4xl',
  }

  // Handle emoji
  if (isEmoji(value)) {
    return <span className={cn(sizeClasses[size], 'flex items-center justify-center shrink-0 leading-none overflow-hidden', className)}>{value as string}</span>
  }

  // Handle icon object
  const parsed = parseIconValue(value)
  if (!parsed) {
    // Default icon
    return <FileText className={cn(sizeClasses[size], className)} style={{ color: DEFAULT_COLOR }} />
  }

  const IconComponent = getIconByName(parsed.name)
  if (!IconComponent) {
    return <FileText className={cn(sizeClasses[size], className)} style={{ color: parsed.color }} />
  }

  return <IconComponent className={cn(sizeClasses[size], className)} style={{ color: parsed.color }} />
}
