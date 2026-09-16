import type { AuthUser, LoginBody } from '@/features/auth/types'
import { API_ROUTES } from '@/shared/constants/api-routes'
import { ensureCsrfCookie, http } from '@/shared/http'
import type { ResponseWithData, ResponseWithMessage } from '@/shared/types/http'

export const authApi = {
  login: async (body: LoginBody): Promise<ResponseWithData<AuthUser>> => {
    // Sanctum: avval CSRF cookie'si, keyin login.
    await ensureCsrfCookie()

    const { data } = await http.post<ResponseWithData<AuthUser>>(
      API_ROUTES.AUTH_LOGIN,
      body,
    )
    return data
  },

  me: async (): Promise<ResponseWithData<AuthUser>> => {
    const { data } = await http<ResponseWithData<AuthUser>>(API_ROUTES.AUTH_ME)
    return data
  },

  logout: async (): Promise<ResponseWithMessage> => {
    const { data } = await http.post<ResponseWithMessage>(
      API_ROUTES.AUTH_LOGOUT,
    )
    return data
  },
}
