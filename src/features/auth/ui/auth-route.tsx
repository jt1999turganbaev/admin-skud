import { Navigate, Outlet } from 'react-router-dom'

import { ROUTES } from '@/shared/constants/routes'

import { useAuth } from '../auth-context/auth-context'

/**
 * Login sahifasi qo'riqchisi: sessiyasi bor foydalanuvchi bu yerda qolmaydi.
 *
 * Sharti `ProtectedRoute` bilan aynan teskari bo'lishi shart — aks holda
 * ikkalasi bir-biriga cheksiz yo'naltiradi.
 */
export const AuthRoute = () => {
  const { isAuth } = useAuth()

  return isAuth ? <Navigate to={ROUTES.HOME} replace /> : <Outlet />
}
