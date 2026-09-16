import axios from 'axios'

import { CSRF_COOKIE_URL } from './api-config'

/**
 * Sanctum sessiyasi uchun XSRF-TOKEN cookie'sini ta'minlaydi.
 *
 * Keshlanadigan narsa — cookie emas, **so'rov promise'i**: sahifa yuklangach
 * token bir marta olinadi, keyingi chaqiruvlar o'sha promise'ni qaytaradi.
 * Cookie borligiga qarab o'tkazib yuborish mumkin emas — brauzerda oldingi
 * sessiyadan qolgan, serverda allaqachon yaroqsiz token turgan bo'lishi
 * mumkin.
 *
 * `refresh` — 419 dan keyin tokenni majburan yangilash uchun.
 */
let request: Promise<void> | null = null

export const ensureCsrfCookie = (refresh = false): Promise<void> => {
  if (refresh) request = null

  if (!request) {
    request = axios
      .get(CSRF_COOKIE_URL, { withCredentials: true })
      .then(() => undefined)
      .catch((error: unknown) => {
        // Xato bo'lsa keshlamaymiz — keyingi urinish qaytadan so'raydi.
        request = null
        throw error
      })
  }

  return request
}

/** Chiqishdan keyin keyingi login yangi token olishi uchun. */
export const resetCsrfCookie = () => {
  request = null
}
