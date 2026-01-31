import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/auth-context'
import { apiClient } from '@/api/client'
import { SUPPORTED_LANGUAGES, LANGUAGE_STORAGE_KEY, DEFAULT_LANGUAGE, type SupportedLanguage } from './index'

import { enUS, fr, es, de, it, pt } from 'date-fns/locale'
import type { Locale } from 'date-fns'

const DATE_FNS_LOCALES: Record<SupportedLanguage, Locale> = {
  en: enUS,
  fr: fr,
  es: es,
  de: de,
  it: it,
  pt: pt,
}

interface LanguageContextType {
  language: SupportedLanguage
  setLanguage: (lang: SupportedLanguage) => Promise<void>
  isChangingLanguage: boolean
  dateFnsLocale: Locale
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation()
  const { user, token } = useAuth()
  const [isChangingLanguage, setIsChangingLanguage] = useState(false)

  const language = (
    SUPPORTED_LANGUAGES.includes(i18n.language as SupportedLanguage)
      ? i18n.language
      : DEFAULT_LANGUAGE
  ) as SupportedLanguage

  // Sync language from user preferences on login
  useEffect(() => {
    if (user) {
      const prefs = (user as Record<string, unknown>).preferences as Record<string, unknown> | undefined
      const userLang = prefs?.language as string | undefined
      if (userLang && SUPPORTED_LANGUAGES.includes(userLang as SupportedLanguage)) {
        i18n.changeLanguage(userLang)
      }
    }
  }, [user, i18n])

  const setLanguage = useCallback(async (newLang: SupportedLanguage) => {
    if (newLang === language) return

    setIsChangingLanguage(true)
    try {
      await i18n.changeLanguage(newLang)
      localStorage.setItem(LANGUAGE_STORAGE_KEY, newLang)
      document.documentElement.lang = newLang

      if (token) {
        await apiClient.put('/user/profile', {
          preferences: { language: newLang },
        })
      }
    } catch (error) {
      console.error('Failed to change language:', error)
      await i18n.changeLanguage(language)
    } finally {
      setIsChangingLanguage(false)
    }
  }, [language, token, i18n])

  const dateFnsLocale = DATE_FNS_LOCALES[language]

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isChangingLanguage, dateFnsLocale }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
