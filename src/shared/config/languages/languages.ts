export const DEFAULT_LANGUAGE = 'qr'

/** Faqat shu ikki til — qoraqalpoqcha birinchi va standart. */
export const LANGUAGES = [
  { code: 'qr', label: 'Qaraqalpaqsha' },
  { code: 'uz', label: 'O’zbekcha' },
] as const

export type LanguageCode = (typeof LANGUAGES)[number]['code']

export const SUPPORTED_LANGUAGES = LANGUAGES.map((item) => item.code)
