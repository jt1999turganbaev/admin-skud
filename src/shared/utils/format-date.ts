const pad = (n: number) => String(n).padStart(2, '0')

/** Backend sanani "16-09-2026 06:49" ko'rinishida qaytaradi (ISO emas). */
const API_DATE = /^(\d{2})-(\d{2})-(\d{4})(?:\s+(\d{2}):(\d{2}))?$/

/**
 * Sanani "16.09.2026 06:49" ko'rinishiga keltiradi.
 * Backend formatini ham, ISO'ni ham tushunadi; tanimasa qiymatni
 * o'zgartirmasdan qaytaradi.
 */
export const formatDateTime = (value: string | null | undefined): string => {
  if (!value) return '—'

  const apiMatch = API_DATE.exec(value.trim())
  if (apiMatch) {
    const [, day, month, year, hours, minutes] = apiMatch
    const date = `${day}.${month}.${year}`

    return hours ? `${date} ${hours}:${minutes}` : date
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value

  const day = `${pad(parsed.getDate())}.${pad(parsed.getMonth() + 1)}.${parsed.getFullYear()}`
  const time = `${pad(parsed.getHours())}:${pad(parsed.getMinutes())}`

  return `${day} ${time}`
}

/**
 * Backend qaytargan sanani `Date` ga o'giradi — kalendar (DateTimePicker)
 * shuni kutadi. "16-09-2026 06:49" ham, ISO ham tushuniladi.
 */
export const parseApiDate = (value: string | null | undefined): Date | null => {
  if (!value) return null

  const apiMatch = API_DATE.exec(value.trim())
  if (apiMatch) {
    const [, day, month, year, hours = '0', minutes = '0'] = apiMatch
    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hours),
      Number(minutes),
    )
  }

  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

/**
 * `Date` ni backend kutadigan ko'rinishga o'giradi: "2026-09-16 06:49:00".
 * UTC'ga o'tkazilmaydi — server vaqti bilan ishlanadi, aks holda soat
 * siljib ketadi.
 */
export const toApiDateTime = (value: Date | null | undefined): string => {
  if (!value) return ''

  const date = `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`
  const time = `${pad(value.getHours())}:${pad(value.getMinutes())}:${pad(value.getSeconds())}`

  return `${date} ${time}`
}
