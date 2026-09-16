/** Base64 boshidagi imzolar — prefiksi yo'q rasm turini aniqlash uchun. */
const SIGNATURES: [string, string][] = [
  ['iVBORw0KGgo', 'image/png'],
  ['/9j/', 'image/jpeg'],
  ['UklGR', 'image/webp'],
  ['R0lGOD', 'image/gif'],
]

/** Faqat base64 belgilari — `data:` prefiksisiz kelgan rasmni ajratish uchun. */
const BASE64 = /^[A-Za-z0-9+/\s]+={0,2}$/

/**
 * Rasmni `<img src>` ga yaroqli ko'rinishga keltiradi.
 *
 * Backend `photo` ni base64 sifatida saqlaydi va odatda `data:image/...`
 * prefiksi bilan qaytaradi. Ba'zi yozuvlarda prefiks bo'lmasligi mumkin —
 * u holda rasm turi base64 imzosidan aniqlanib, prefiks o'zimiz qo'shiladi.
 * Tayyor manzil (`http`, `blob:`, `/yo'l`) o'zgarishsiz qaytadi.
 */
export const resolvePhotoSrc = (
  photo: string | null | undefined,
): string | null => {
  if (!photo) return null

  const value = photo.trim()
  if (!value) return null

  // Tayyor manzil
  if (/^(data:|https?:|blob:)/.test(value)) return value

  const clean = value.replace(/\s/g, '')
  const signature = SIGNATURES.find(([start]) => clean.startsWith(start))

  // JPEG base64 "/9j/" bilan boshlanadi — yo'l deb o'ylab qolmaslik uchun
  // imzo serverdagi yo'ldan oldin tekshiriladi.
  if (signature) return `data:${signature[1]};base64,${clean}`

  if (value.startsWith('/')) return value

  return BASE64.test(value) ? `data:image/jpeg;base64,${clean}` : value
}
