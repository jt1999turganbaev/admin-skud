import type { HTTPError } from '@/shared/types/http'

/**
 * Laravel 422 javobi: `{ errors: { phone: ["..."], photo: "..." } }`.
 * Mantine formasi har maydonga bitta matn kutadi — massivdan birinchisi
 * olinadi. Maydon nomlari backend bilan bir xil bo'lgani uchun qo'shimcha
 * moslashtirish kerak emas.
 */
export const toFormErrors = (error: HTTPError): Record<string, string> =>
  Object.fromEntries(
    Object.entries(error?.errors ?? {}).map(([field, message]) => [
      field,
      Array.isArray(message) ? (message[0] ?? '') : message,
    ]),
  )
