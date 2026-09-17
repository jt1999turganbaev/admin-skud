import i18n from 'i18next'

import {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  type LanguageCode,
} from './languages'

/** i18next tanlangan tilni shu kalit bilan localStorage'da saqlaydi. */
const LANGUAGE_STORAGE_KEY = 'i18nextLng'

/**
 * Backend `locale` sarlavhasini kutadi (access-client'dagi kabi). Til
 * to'g'ridan-to'g'ri localStorage'dan olinadi — i18next hali ishga
 * tushmagan birinchi so'rovlarda ham to'g'ri til ketadi.
 */
export const getLocale = (): LanguageCode => {
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY)?.slice(0, 2)

    if (SUPPORTED_LANGUAGES.includes(stored as LanguageCode)) {
      return stored as LanguageCode
    }
  } catch {
    // localStorage yopiq bo'lsa — i18next yoki standart til.
  }

  const resolved = i18n.resolvedLanguage as LanguageCode | undefined

  return resolved && SUPPORTED_LANGUAGES.includes(resolved)
    ? resolved
    : DEFAULT_LANGUAGE
}

export const setLocale = (locale: LanguageCode) => {
  void i18n.changeLanguage(locale)
}
