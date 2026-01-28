import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useDebouncedCallback } from 'use-debounce'
import { formatDistanceToNow } from 'date-fns'
import { useLanguage } from '@/i18n/LanguageContext'
import { IconPicker, DocumentIcon, type IconValue } from '@/components/ui/icon-picker'
import { Button } from '@/components/ui/button'
import {
  Loader2,
  Star,
  Lock,
  Unlock,
  ChevronRight,
  MoreHorizontal,
  History,
} from 'lucide-react'

// Types for breadcrumb items
export interface BreadcrumbItem {
  label: string
  href?: string
  icon?: string
}

// Props for the unified content header
export interface ContentHeaderProps {
  // Required
  title: string
  onTitleChange: (title: string) => void
  onSettingsClick: () => void
  placeholder?: string

  // Breadcrumbs (document only)
  breadcrumbs?: BreadcrumbItem[]

  // Icon picker (document only)
  icon?: IconValue
  onIconChange?: (icon: IconValue) => void

  // Favorites (document only)
  isFavorited?: boolean
  onFavoriteToggle?: () => void

  // Lock/Unlock (document only)
  isLocked?: boolean
  temporaryUnlock?: boolean
  onTemporaryUnlockToggle?: () => void

  // Status indicators
  updatedAt?: string
  isUpdating?: boolean

  // History (document only)
  onHistoryClick?: () => void

  // Layout control
  maxWidth?: string
  isFullWidth?: boolean

  // Loading/States
  isEditable?: boolean
}

export function ContentHeader({
  title,
  onTitleChange,
  onSettingsClick,
  placeholder,
  breadcrumbs,
  icon,
  onIconChange,
  isFavorited,
  onFavoriteToggle,
  isLocked = false,
  temporaryUnlock = false,
  onTemporaryUnlockToggle,
  updatedAt,
  isUpdating,
  onHistoryClick,
  maxWidth = '720px',
  isFullWidth = false,
  isEditable = true,
}: ContentHeaderProps) {
  const { t } = useTranslation('document')
  const { dateFnsLocale } = useLanguage()

  // Local state for title editing with debounce
  const [localTitle, setLocalTitle] = useState(title)

  // Sync local title with prop when it changes externally
  useEffect(() => {
    setLocalTitle(title)
  }, [title])

  // Debounced title save
  const debouncedTitleChange = useDebouncedCallback((newTitle: string) => {
    onTitleChange(newTitle)
  }, 800)

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setLocalTitle(newTitle)
    debouncedTitleChange(newTitle)
  }

  // Handle icon change
  const handleIconChange = (newIcon: IconValue) => {
    if (onIconChange) {
      onIconChange(newIcon)
    }
  }

  // Determine if input should be editable
  const inputEditable = isEditable && (!isLocked || temporaryUnlock)

  // Check if we have breadcrumbs
  const hasBreadcrumbs = breadcrumbs && breadcrumbs.length > 0

  // Content max width
  const contentMaxWidth = isFullWidth ? '100%' : maxWidth

  return (
    <div className="sticky top-0 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top bar with breadcrumbs and actions */}
      <div className="px-4 py-1.5 flex items-center text-sm text-muted-foreground">
        {/* Breadcrumbs */}
        {hasBreadcrumbs ? (
          <nav className="flex items-center gap-1 min-w-0 flex-1">
            {breadcrumbs!.map((crumb, index) => (
              <span key={index} className="flex items-center gap-1">
                {index > 0 && (
                  <ChevronRight className="h-3 w-3 shrink-0 opacity-50" />
                )}
                {crumb.href ? (
                  <Link
                    to={crumb.href}
                    className="hover:text-foreground transition-colors truncate max-w-[200px]"
                  >
                    {crumb.icon && <span className="mr-1">{crumb.icon}</span>}
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-foreground font-medium truncate">
                    {crumb.icon && <span className="mr-1">{crumb.icon}</span>}
                    {crumb.label}
                  </span>
                )}
              </span>
            ))}
          </nav>
        ) : (
          <div className="flex-1" />
        )}

        {/* Right side actions */}
        <div className="flex items-center gap-1 shrink-0 ml-2">
          {/* Last updated */}
          {updatedAt && (
            <div className="flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground">
              <span>
                {t('contentHeader.edited', { time: formatDistanceToNow(new Date(updatedAt), { addSuffix: true, locale: dateFnsLocale }) })}
              </span>
            </div>
          )}

          {/* Saving indicator */}
          {isUpdating && (
            <div className="flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>{t('contentHeader.saving')}</span>
            </div>
          )}

          {/* Lock button */}
          {isLocked && onTemporaryUnlockToggle && (
            <Button
              variant="ghost"
              size="icon"
              className={`h-7 w-7 ${temporaryUnlock ? 'text-green-500' : 'text-muted-foreground'}`}
              title={
                temporaryUnlock
                  ? t('contentHeader.unlockTooltip')
                  : t('contentHeader.lockTooltip')
              }
              onClick={onTemporaryUnlockToggle}
            >
              {temporaryUnlock ? (
                <Unlock className="h-4 w-4" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
            </Button>
          )}

          {/* Favorites button */}
          {onFavoriteToggle && (
            <Button
              variant="ghost"
              size="icon"
              className={'h-7 w-7 ' + (isFavorited ? 'text-amber-500' : '')}
              type="button"
              title={
                isFavorited ? t('contentHeader.removeFromFavorites') : t('contentHeader.addToFavorites')
              }
              onClick={onFavoriteToggle}
            >
              <Star
                className="h-4 w-4"
                fill={isFavorited ? 'currentColor' : 'none'}
              />
            </Button>
          )}

          {/* Version history button */}
          {onHistoryClick && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              title={t('contentHeader.versionHistory')}
              onClick={onHistoryClick}
            >
              <History className="h-4 w-4" />
            </Button>
          )}

          {/* Settings button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            title={t('contentHeader.settings')}
            onClick={onSettingsClick}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Icon and Title row */}
      <div
        className="mx-auto px-8 py-2"
        style={{ maxWidth: contentMaxWidth }}
      >
        <div className="flex items-center gap-3">
          {/* Icon picker (if onIconChange provided) */}
          {onIconChange && (
            <IconPicker value={icon} onChange={handleIconChange}>
              <button
                className="shrink-0 hover:bg-accent rounded p-1 transition-colors"
                title={t('contentHeader.changeIcon')}
              >
                <DocumentIcon value={icon} size="xl" />
              </button>
            </IconPicker>
          )}

          {/* Title input */}
          <input
            type="text"
            value={localTitle}
            onChange={handleTitleChange}
            placeholder={placeholder ?? t('common:untitled')}
            className="text-3xl font-bold bg-transparent border-none outline-none placeholder:text-muted-foreground/50 min-w-0 flex-1"
            disabled={!inputEditable}
          />
        </div>
      </div>
    </div>
  )
}
