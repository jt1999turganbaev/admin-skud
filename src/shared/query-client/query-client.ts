import { MutationCache, QueryClient } from '@tanstack/react-query'
import i18n from 'i18next'

import { isForbiddenError, notifyForbidden } from '@/shared/http/forbidden'

export const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    // O'z `onError` bildirishnomasi yo'q mutatsiyalar uchun 403 ni bu yerda
    // bir marta ko'rsatamiz — aks holda hech qanday xabar chiqmasdi.
    onError: (error, _variables, _context, mutation) => {
      if (isForbiddenError(error) && !mutation.options.onError) {
        notifyForbidden()
      }
    },
  }),
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 60_000,
    },
  },
})

/**
 * Backend nom va tavsiflarni `locale` bo'yicha bitta tilda qaytaradi —
 * til almashganda yuklangan ma'lumotlar yangi tilda qayta so'raladi.
 */
i18n.on('languageChanged', () => {
  void queryClient.invalidateQueries()
})
