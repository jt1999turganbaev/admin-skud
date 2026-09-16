import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { ROUTES } from '@/shared/constants/routes'

import { useAuth } from '../auth-context/auth-context'

/** Sessiyasi yo'q foydalanuvchini login sahifasiga uzatadi. */
export const ProtectedRoute = () => {
  const { isAuth } = useAuth()
  const location = useLocation()

  if (!isAuth) {
    // Qayerga kirmoqchi bo'lganini eslab qolamiz — kirgandan keyin qaytaramiz.
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />
  }

  return <Outlet />
}
