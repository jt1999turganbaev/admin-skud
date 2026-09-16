import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'

import {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  type LanguageCode,
} from '../languages'

/** Saqlangan til faqat ro'yxatdagilardan bo'lishi mumkin. */
const savedLanguage = (() => {
  try {
    const stored = localStorage.getItem('i18nextLng')

    return SUPPORTED_LANGUAGES.includes(stored as LanguageCode)
      ? (stored as LanguageCode)
      : DEFAULT_LANGUAGE
  } catch {
    return DEFAULT_LANGUAGE
  }
})()

export const i18nConfig = i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: DEFAULT_LANGUAGE,
    ns: ['main'],
    defaultNS: 'main',
    supportedLngs: SUPPORTED_LANGUAGES,
    load: 'languageOnly',
    nonExplicitSupportedLngs: true,

    interpolation: {
      escapeValue: false,
    },
    lng: savedLanguage,
  })
