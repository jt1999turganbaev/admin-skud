import type { LanguageCode } from '@/shared/config/languages'

/**
 * Kontent ikki tilda saqlanadi: `{ uz: "Kutubxona", qr: "Kitapxana" }`.
 * Javobdagi oddiy `name`/`description` — so'ralgan tildagi qiymat,
 * `translations` esa tahrirlash formasi uchun ikkala tildagi asl qiymat.
 */
export type Translatable = Record<LanguageCode, string>

/** Tavsif kabi ixtiyoriy maydon — har bir til bo'sh bo'lishi mumkin. */
export type NullableTranslatable = Record<LanguageCode, string | null>

export const EMPTY_TRANSLATABLE: Translatable = { uz: '', qr: '' }

/** Javobdagi `translations` qiymatini forma uchun bo'sh satrlarga o'giradi. */
export const toTranslatable = (
  value: Partial<NullableTranslatable> | null | undefined,
): Translatable => ({
  uz: value?.uz ?? '',
  qr: value?.qr ?? '',
})
