import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import resourcesToBackend from 'i18next-resources-to-backend'

// English is bundled statically as the fallback language so the UI is never empty.
import commonEn from './locales/en/common.json'
import authEn from './locales/en/auth.json'
import settingsEn from './locales/en/settings.json'
import navigationEn from './locales/en/navigation.json'
import adminEn from './locales/en/admin.json'
import databaseEn from './locales/en/database.json'
import documentEn from './locales/en/document.json'
import drawingEn from './locales/en/drawing.json'

// Non-English translations are lazy-loaded via Vite glob import (code-split per chunk).
// Excluding 'en' avoids the "statically + dynamically imported" Vite warning.
const lazyTranslations = import.meta.glob<Record<string, unknown>>(
  './locales/!(en)/*.json'
)

export const SUPPORTED_LANGUAGES = ['en', 'fr', 'es', 'de', 'it', 'pt'] as const
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

export const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  en: 'English',
  fr: 'Français',
  es: 'Español',
  de: 'Deutsch',
  it: 'Italiano',
  pt: 'Português',
}

export const DEFAULT_LANGUAGE: SupportedLanguage = 'en'
export const LANGUAGE_STORAGE_KEY = 'nexo_language'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  // Lazy-load non-English translations via the pre-built glob map
  .use(
    resourcesToBackend((language: string, namespace: string) => {
      const key = `./locales/${language}/${namespace}.json`
      const loader = lazyTranslations[key]
      if (!loader) return Promise.resolve({})
      return loader()
    })
  )
  .init({
    resources: {
      en: {
        common: commonEn,
        auth: authEn,
        settings: settingsEn,
        navigation: navigationEn,
        admin: adminEn,
        database: databaseEn,
        document: documentEn,
        drawing: drawingEn,
      },
    },
    // Only load the detected language (+ fallback). Non-English resources come from the backend plugin.
    partialBundledLanguages: true,

    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: SUPPORTED_LANGUAGES as unknown as string[],
    defaultNS: 'common',
    ns: ['common', 'auth', 'settings', 'navigation', 'admin', 'database', 'document', 'drawing'],

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false,
      bindI18n: 'languageChanged loaded',
      bindI18nStore: 'added removed',
    },

    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: LANGUAGE_STORAGE_KEY,
      caches: ['localStorage'],
    },
  })

export default i18n
