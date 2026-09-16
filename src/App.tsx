import { MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { Notifications } from '@mantine/notifications'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider } from 'react-router-dom'

import { AppDatesProvider } from '@/shared/config/dates'
import { queryClient } from '@/shared/query-client/query-client'
import { router } from '@/shared/router/router'
import { theme } from '@/shared/theme'
import { ErrorBoundary } from '@/shared/ui'

/**
 * Sessiya tugagandagi yo'naltirish `AuthProvider` ichida ulanadi — u yerda
 * auth holati ham tozalanadi, shuning uchun handler bitta joyda turadi.
 */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <MantineProvider theme={theme} defaultColorScheme="light">
      <AppDatesProvider>
        <ModalsProvider>
          <Notifications position="top-right" />
          <ErrorBoundary>
            <RouterProvider router={router} />
          </ErrorBoundary>
        </ModalsProvider>
      </AppDatesProvider>
    </MantineProvider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
)

export default App
