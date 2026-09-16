import { useEffect, useRef, useState, type PropsWithChildren } from 'react'
import { useNavigate } from 'react-router-dom'

import { ROUTES } from '@/shared/constants/routes'
import {
  ensureCsrfCookie,
  resetCsrfCookie,
  resetSessionExpired,
  setLoggingOut,
  setSessionExpiredHandler,
} from '@/shared/http'
import { queryClient } from '@/shared/query-client/query-client'
import type { HTTPError } from '@/shared/types/http'
import { MainLoader } from '@/shared/ui/main-loader'
import {
  notifyError,
  notifySessionExpired,
  notifySuccess,
} from '@/shared/ui/notifications'

import { authApi } from '../api/auth-api'
import type { AuthUser, LoginBody } from '../types'
import { AuthContext } from './auth-context'

interface AuthProviderProps extends PropsWithChildren {
  authored: boolean
  authorizedUser: AuthUser | null
}

export const AuthProvider = (props: AuthProviderProps) => {
  const { authored, authorizedUser, children } = props

  const [isAuth, setIsAuth] = useState(authored)
  const [user, setUser] = useState<AuthUser | null>(authorizedUser)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const loggingOutRef = useRef(false)

  const navigate = useNavigate()

  useEffect(() => {
    setSessionExpiredHandler(() => {
      notifySessionExpired()
      queryClient.cancelQueries()
      queryClient.clear()
      setIsAuth(false)
      setUser(null)
      navigate(ROUTES.LOGIN, { replace: true })
    })

    return () => setSessionExpiredHandler(null)
  }, [navigate])

  const refreshUser = async () => {
    const { data: nextUser } = await authApi.me()
    setUser(nextUser)
    return nextUser
  }

  const startSession = async (userFromResponse: AuthUser) => {
    // Login javobidagi foydalanuvchi qisqaroq bo'lishi mumkin — to'liqrog'ini
    // olishga urinamiz, bo'lmasa javobdagisi bilan davom etamiz.
    try {
      const { data: me } = await authApi.me()
      setUser(me)
    } catch {
      setUser(userFromResponse)
    }

    setIsAuth(true)
    resetSessionExpired()
  }

  const login = async (body: LoginBody) => {
    try {
      await ensureCsrfCookie()

      const { data } = await authApi.login(body)

      await startSession(data)
    } catch (error) {
      const err = error as HTTPError

      if (err.message) notifyError(err.message, 'Kirish amalga oshmadi')

      return Promise.reject(err)
    }
  }

  const logout = () => {
    // Ketma-ket bosishda ikkinchi so'rov ketmasin. State emas, ref: state
    // keyingi render'gacha eski qiymatda qoladi, ref esa darhol yangilanadi.
    if (loggingOutRef.current) return
    loggingOutRef.current = true
    setIsLoggingOut(true)

    setLoggingOut(true)
    queryClient.cancelQueries()

    authApi
      .logout()
      .then((res) => {
        if (res?.message) notifySuccess(res.message)
      })
      .finally(() => {
        // Keyingi login yangi CSRF tokeni bilan boshlansin.
        resetCsrfCookie()
        queryClient.clear()
        setIsAuth(false)
        setUser(null)
        setLoggingOut(false)
        loggingOutRef.current = false
        setIsLoggingOut(false)
        navigate(ROUTES.LOGIN)
      })
  }

  return (
    <AuthContext.Provider value={{ isAuth, user, login, logout, refreshUser }}>
      {children}
      {/* Chiqish so'rovi davomida ekran yopiladi — jarayon ko'rinadi va
          foydalanuvchi boshqa amal bajara olmaydi */}
      {isLoggingOut && <MainLoader />}
    </AuthContext.Provider>
  )
}
