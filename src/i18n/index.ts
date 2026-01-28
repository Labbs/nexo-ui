import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Import translations
import commonEn from './locales/en/common.json'
import authEn from './locales/en/auth.json'
import settingsEn from './locales/en/settings.json'
import navigationEn from './locales/en/navigation.json'
import adminEn from './locales/en/admin.json'
import databaseEn from './locales/en/database.json'
import documentEn from './locales/en/document.json'
import drawingEn from './locales/en/drawing.json'

import commonFr from './locales/fr/common.json'
import authFr from './locales/fr/auth.json'
import settingsFr from './locales/fr/settings.json'
import navigationFr from './locales/fr/navigation.json'
import adminFr from './locales/fr/admin.json'
import databaseFr from './locales/fr/database.json'
import documentFr from './locales/fr/document.json'
import drawingFr from './locales/fr/drawing.json'

import commonEs from './locales/es/common.json'
import authEs from './locales/es/auth.json'
import settingsEs from './locales/es/settings.json'
import navigationEs from './locales/es/navigation.json'
import adminEs from './locales/es/admin.json'
import databaseEs from './locales/es/database.json'
import documentEs from './locales/es/document.json'
import drawingEs from './locales/es/drawing.json'

import commonDe from './locales/de/common.json'
import authDe from './locales/de/auth.json'
import settingsDe from './locales/de/settings.json'
import navigationDe from './locales/de/navigation.json'
import adminDe from './locales/de/admin.json'
import databaseDe from './locales/de/database.json'
import documentDe from './locales/de/document.json'
import drawingDe from './locales/de/drawing.json'

import commonIt from './locales/it/common.json'
import authIt from './locales/it/auth.json'
import settingsIt from './locales/it/settings.json'
import navigationIt from './locales/it/navigation.json'
import adminIt from './locales/it/admin.json'
import databaseIt from './locales/it/database.json'
import documentIt from './locales/it/document.json'
import drawingIt from './locales/it/drawing.json'

import commonPt from './locales/pt/common.json'
import authPt from './locales/pt/auth.json'
import settingsPt from './locales/pt/settings.json'
import navigationPt from './locales/pt/navigation.json'
import adminPt from './locales/pt/admin.json'
import databasePt from './locales/pt/database.json'
import documentPt from './locales/pt/document.json'
import drawingPt from './locales/pt/drawing.json'

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
      fr: {
        common: commonFr,
        auth: authFr,
        settings: settingsFr,
        navigation: navigationFr,
        admin: adminFr,
        database: databaseFr,
        document: documentFr,
        drawing: drawingFr,
      },
      es: {
        common: commonEs,
        auth: authEs,
        settings: settingsEs,
        navigation: navigationEs,
        admin: adminEs,
        database: databaseEs,
        document: documentEs,
        drawing: drawingEs,
      },
      de: {
        common: commonDe,
        auth: authDe,
        settings: settingsDe,
        navigation: navigationDe,
        admin: adminDe,
        database: databaseDe,
        document: documentDe,
        drawing: drawingDe,
      },
      it: {
        common: commonIt,
        auth: authIt,
        settings: settingsIt,
        navigation: navigationIt,
        admin: adminIt,
        database: databaseIt,
        document: documentIt,
        drawing: drawingIt,
      },
      pt: {
        common: commonPt,
        auth: authPt,
        settings: settingsPt,
        navigation: navigationPt,
        admin: adminPt,
        database: databasePt,
        document: documentPt,
        drawing: drawingPt,
      },
    },
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: SUPPORTED_LANGUAGES as unknown as string[],
    defaultNS: 'common',
    ns: ['common', 'auth', 'settings', 'navigation', 'admin', 'database', 'document', 'drawing'],

    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: LANGUAGE_STORAGE_KEY,
      caches: ['localStorage'],
    },
  })

export default i18n
