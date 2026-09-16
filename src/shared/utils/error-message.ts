import type { HTTPError } from '@/shared/types/http'

const FALLBACK = 'Kutilmagan xatolik yuz berdi.'

/** Turli shakldagi xatolardan foydalanuvchiga ko'rsatiladigan matnni ajratadi. */
export const getErrorMessage = (error: unknown): string => {
  if (!error) return FALLBACK
  if (typeof error === 'string') return error

  const candidate = error as Partial<HTTPError> & { errors?: unknown }

  if (candidate.errors && typeof candidate.errors === 'object') {
    const first = Object.values(
      candidate.errors as Record<string, string[] | string>,
    )[0]
    if (Array.isArray(first) && first[0]) return first[0]
    if (typeof first === 'string') return first
  }

  return candidate.message || FALLBACK
}
