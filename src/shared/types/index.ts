export type { FilterParams } from './filterParams'
export type { NullableTranslatable, Translatable } from './translatable'
export type {
  HTTPError,
  ResponseWithData,
  ResponseWithMessage,
  ResponseWithPagination,
} from './http'

/** Badge va status ranglari uchun umumiy tur. */
export type Tone = 'ok' | 'danger' | 'warn' | 'info' | 'neutral'
