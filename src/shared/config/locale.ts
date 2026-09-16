import i18n from 'i18next'

import { DEFAULT_LANGUAGE, type LanguageCode } from './languages'

/**
 * Backend `locale` sarlavhasini kutadi — u i18next tanlagan til bilan
 * bir xil bo'lishi kerak, shuning uchun manba bitta.
 */
export const getLocale = (): LanguageCode =>
  (i18n.resolvedLanguage as LanguageCode) ?? DEFAULT_LANGUAGE

export const setLocale = (locale: LanguageCode) => {
  void i18n.changeLanguage(locale)
}
