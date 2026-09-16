import { Suspense } from 'react'
import { Await, Outlet, useLoaderData } from 'react-router-dom'

import { MainLoader } from '@/shared/ui/main-loader'

import { AuthProvider } from '../auth-context/auth-provider'
import type { checkAuth } from '../utils/check-auth'

type AuthLoaderData = { auth: Promise<Awaited<ReturnType<typeof checkAuth>>> }

/**
 * Ilova ildizi: router loader'i sessiyani tekshirib bo'lguncha kutadi,
 * so'ng natijani `AuthProvider` ga uzatadi.
 */
export const Auth = () => {
  const { auth } = useLoaderData() as AuthLoaderData

  return (
    <Suspense fallback={<MainLoader />}>
      <Await resolve={auth}>
        {(resolved: Awaited<ReturnType<typeof checkAuth>>) => (
          <AuthProvider
            authored={resolved.isAuth}
            authorizedUser={resolved.user}
          >
            <Outlet />
          </AuthProvider>
        )}
      </Await>
    </Suspense>
  )
}
