export const DEFAULT_LANGUAGE = 'uz'

/** Qo'llab-quvvatlanadigan tillar — el-yurt loyihasidagi to'plam. */
export const LANGUAGES = [
  { code: 'uz', label: 'O’zbekcha' },
  { code: 'qq', label: 'Qaraqalpaqsha' },
  { code: 'ru', label: 'Русский' },
  { code: 'en', label: 'English' },
] as const

export type LanguageCode = (typeof LANGUAGES)[number]['code']

export const SUPPORTED_LANGUAGES = LANGUAGES.map((item) => item.code)
