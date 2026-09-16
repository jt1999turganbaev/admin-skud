import { createContext, useContext } from 'react'

import type { AuthUser, LoginBody } from '../types'

export interface AuthContextValue {
  isAuth: boolean
  user: AuthUser | null
  login: (body: LoginBody) => Promise<unknown>
  refreshUser: () => Promise<AuthUser>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('Ilovani AuthProvider bilan o’rab chiqing.')
  }

  return context
}
