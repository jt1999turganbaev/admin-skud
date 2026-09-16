/**
 * Sessiya holati va uni ushlab turuvchi handler'lar.
 *
 * Backend Sanctum cookie-sessiyasi bilan ishlaydi — frontendda saqlanadigan
 * token yo'q. Shuning uchun bu yerda faqat "sessiya tugadi" hodisasi va uni
 * router'ga ulaydigan handler bor (http.ts router'ga bog'lanmasin).
 */

type Handler = () => void

let sessionExpiredHandler: Handler | null = null
let unauthorizedHandler: Handler | null = null

/** Logout jarayonida 401 kutilgan — ortiqcha bildirishnoma chiqmasin. */
let loggingOut = false
let sessionExpiredNotified = false

export const setSessionExpiredHandler = (handler: Handler | null) => {
  sessionExpiredHandler = handler
}

export const setUnauthorizedHandler = (handler: Handler | null) => {
  unauthorizedHandler = handler
}

export const setLoggingOut = (value: boolean) => {
  loggingOut = value
}

export const resetSessionExpired = () => {
  sessionExpiredNotified = false
}

export const notifyUnauthorized = () => {
  unauthorizedHandler?.()
}

export const notifySessionExpired = () => {
  if (loggingOut || sessionExpiredNotified) return
  sessionExpiredNotified = true

  sessionExpiredHandler?.()
}
