const isDevProxy =
  import.meta.env.DEV && import.meta.env.VITE_API_PROXY === 'true'

// VITE_API_URL yo'q bo'lsa `new URL(undefined, ...)` "/undefined" ga aylanib,
// so'rovlar jimgina noto'g'ri manzilga ketardi — shuning uchun zaxira qiymat.
const apiUrl = new URL(
  import.meta.env.VITE_API_URL || '/api/admin/',
  window.location.origin,
)

/** Proxy rejimida faqat yo'l qoladi — cookie'lar bir xil origin'da bo'lsin. */
export const BASE_URL = isDevProxy ? apiUrl.pathname : apiUrl.href

/** Sanctum CSRF cookie'si API'ning o'zida emas, ildiz domenda turadi. */
export const CSRF_COOKIE_URL = isDevProxy
  ? '/sanctum/csrf-cookie'
  : new URL('/sanctum/csrf-cookie', apiUrl.origin).href
