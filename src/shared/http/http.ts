import axios, { type InternalAxiosRequestConfig } from 'axios'

import { getLocale } from '@/shared/config/locale'
import { notifyWarning } from '@/shared/ui/notifications'

import { BASE_URL } from './api-config'
import { ensureCsrfCookie } from './csrf'
import { getForbiddenMessage } from './forbidden'
import { notifySessionExpired, notifyUnauthorized } from './session'

export { BASE_URL }

/**
 * Backend — Laravel Sanctum (cookie-sessiya). Token yo'q: brauzer sessiya
 * cookie'sini yuboradi, axios esa XSRF-TOKEN cookie'sini `X-XSRF-TOKEN`
 * sarlavhasiga ko'chiradi.
 */
export const http = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  withXSRFToken: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  headers: {
    Accept: 'application/json',
  },
})

/** O'zgartiruvchi so'rovlar CSRF cookie'sisiz 419 bilan qaytadi. */
const MUTATING_METHODS = ['post', 'put', 'patch', 'delete']

http.interceptors.request.use(async (config) => {
  config.headers['locale'] = getLocale()

  if (MUTATING_METHODS.includes((config.method ?? 'get').toLowerCase())) {
    await ensureCsrfCookie()
  }

  return config
})

/** Bu endpoint'larda 401 kutilgan — sessiya tugadi deb hisoblanmaydi. */
const EXPECTED_401_ENDPOINTS = ['/auth/login', '/auth/logout', '/auth/me']

const isExpected401 = (url = '') =>
  EXPECTED_401_ENDPOINTS.some((endpoint) => url.endsWith(endpoint))

type CsrfRetriedConfig = InternalAxiosRequestConfig & { csrfRetried?: boolean }

let rateLimitNotifiedAt = 0

/** 429 haqida ogohlantirish — ketma-ket so'rovlarda takrorlanmasin. */
const notifyRateLimited = (retryAfterSeconds: number) => {
  const now = Date.now()
  if (now - rateLimitNotifiedAt < 3000) return
  rateLimitNotifiedAt = now

  notifyWarning(
    retryAfterSeconds
      ? `Juda ko’p so’rov yuborildi. ${retryAfterSeconds} soniyadan keyin urinib ko’ring.`
      : 'Juda ko’p so’rov yuborildi. Birozdan keyin urinib ko’ring.',
  )
}

http.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error)
    }

    const { response, config } = error

    if (!response) {
      return Promise.reject({ message: error.message || 'Unknown error' })
    }

    // 429 — anti-spam chegarasi. Foydalanuvchiga bir marta yumshoq
    // ogohlantirish ko'rsatiladi, keyingi so'rovlar spam qilmasin.
    if (response.status === 429) {
      notifyRateLimited(Number(response.headers?.['retry-after']) || 0)
      return Promise.reject(response.data)
    }

    // 403 — ruxsat yo'q. Xabar bir xil tushunarli matnga almashtiriladi:
    // o'z `onError` bildirishnomasi bor mutatsiyalar shu matnni ko'rsatadi,
    // qolganlariga query-client'dagi global handler bildirishnoma chiqaradi.
    if (response.status === 403) {
      const data =
        typeof response.data === 'object' && response.data !== null
          ? response.data
          : {}

      return Promise.reject({
        ...data,
        message: getForbiddenMessage(),
        status: 403,
        forbidden: true,
      })
    }

    const request = config as CsrfRetriedConfig | undefined

    // 419 — CSRF tokeni eskirgan. Bir marta yangilab, so'rovni qaytaramiz.
    if (response.status === 419 && request && !request.csrfRetried) {
      request.csrfRetried = true

      try {
        await ensureCsrfCookie(true)
      } catch {
        notifySessionExpired()
        return Promise.reject(response.data)
      }

      return http(request)
    }

    if (response.status === 401 || response.status === 419) {
      notifyUnauthorized()

      if (response.status === 419 || !isExpected401(request?.url)) {
        notifySessionExpired()
      }
    }

    return Promise.reject(response.data)
  },
)
