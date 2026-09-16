// Telefon raqamini ko'rsatish uchun formatlaydi.
// - 12 xonali va 998 bilan boshlansa: "+998 XX XXX XX XX".
// - 9 xonali (998siz kelgan raqamlar): oldiga 998 qo'shib xuddi shu ko'rinishda.
// - Aks holda: qirqilmasdan "+<raqam>" ko'rinishida qaytariladi.
export const formatPhone = (raw: string | number | null | undefined) => {
  if (raw === null || raw === undefined || raw === '') return ''

  const digits = String(raw).replace(/\D/g, '')

  const local =
    digits.length === 12 && digits.startsWith('998')
      ? digits.slice(3)
      : digits.length === 9
        ? digits
        : null

  if (local) {
    return `+998 ${local.slice(0, 2)} ${local.slice(2, 5)} ${local.slice(5, 7)} ${local.slice(7, 9)}`
  }

  return `+${digits}`
}

// Formaning +998 prefiksli maydoni uchun 998siz lokal qism.
// Faqat 12 xonali va 998 bilan boshlangan raqamdan 998 qirqiladi;
// 998siz kelgan raqamlar o'zgarishsiz qoladi.
export const toLocalPhone = (raw: string | number | null | undefined) => {
  if (raw === null || raw === undefined || raw === '') return ''

  const digits = String(raw).replace(/\D/g, '')

  return digits.length === 12 && digits.startsWith('998')
    ? digits.slice(3)
    : digits
}

/**
 * Nusxalab qo'yilgan matndan lokal (998siz) 9 xonani ajratadi.
 * "+998 90 123 45 67", "998901234567", "90 123 45 67" — hammasi ishlaydi.
 */
export const pastedLocalPhone = (raw: string) => {
  const digits = String(raw).replace(/\D/g, '')

  const local =
    digits.length > 9 && digits.startsWith('998') ? digits.slice(3) : digits

  return local.slice(0, 9)
}
