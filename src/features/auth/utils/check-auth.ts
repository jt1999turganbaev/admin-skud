import { authApi } from '../api/auth-api'

/**
 * Ilova ishga tushganda sessiyani bir marta tekshiradi (router loader'i).
 * Sessiya cookie'da — uni faqat backend tasdiqlay oladi.
 */
export const checkAuth = async () => {
  try {
    const { data: user } = await authApi.me()

    // `isAuth: true` + `user: null` bo'lishi mumkin emas — AuthRoute va
    // ProtectedRoute shu holatda bir-biriga cheksiz yo'naltiradi.
    return { isAuth: !!user, user: user ?? null }
  } catch {
    return { isAuth: false, user: null }
  }
}
