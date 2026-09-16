import { MutationCache, QueryClient } from '@tanstack/react-query'

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
