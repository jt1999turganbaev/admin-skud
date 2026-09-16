import { defer, type RouteObject } from 'react-router-dom'

import { Auth } from '@/features/auth/ui/auth'
import { AuthRoute } from '@/features/auth/ui/auth-route'
import { ProtectedRoute } from '@/features/auth/ui/protected-route'
import { checkAuth } from '@/features/auth/utils/check-auth'
import NotFound from '@/pages/not-found/not-found'
import { ROUTES } from '@/shared/constants/routes'
import AuthLayout from '@/shared/layouts/auth-layout/auth-layout'
import MainLayout from '@/shared/layouts/main-layout/main/main-layout'
import { RouteError } from '@/shared/ui'

import {
  AccessLogs,
  Assignments,
  AssignmentsCreate,
  AssignmentsEdit,
  Dashboard,
  Login,
  Profile,
  Rooms,
  Tablets,
  Terminals,
  TerminalsShow,
  Users,
  UsersCreate,
  UsersEdit,
} from './lazy-pages'

/**
 * Sahifa render'ida xato bo'lsa, butun ilova emas, faqat shu sahifa
 * o'rniga xato ekrani chiqadi — sidebar va header joyida qoladi.
 */
const withErrorElement = (items: RouteObject[]): RouteObject[] =>
  items.map((item) => ({ ...item, errorElement: <RouteError /> }))

/** Marshrutlar jadvali — router'dan alohida, shuning uchun test qilinadi. */
export const routes: RouteObject[] = [
  {
    // Ildiz: sessiya bir marta tekshiriladi va `AuthProvider` ga uzatiladi.
    element: <Auth />,
    // Loader yoki ildiz komponentidagi xato — oq ekran o'rniga xato sahifasi.
    errorElement: <RouteError />,
    loader: () => defer({ auth: checkAuth() }),
    // Har navigatsiyada qayta tekshirilmasin — sessiya holati kontekstda.
    shouldRevalidate: () => false,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <MainLayout />,
            children: withErrorElement([
              { path: ROUTES.HOME, element: <Dashboard /> },
              { path: ROUTES.USERS, element: <Users /> },
              { path: ROUTES.USERS_CREATE, element: <UsersCreate /> },
              { path: ROUTES.USERS_EDIT, element: <UsersEdit /> },
              { path: ROUTES.ROOMS, element: <Rooms /> },
              { path: ROUTES.TERMINALS, element: <Terminals /> },
              { path: ROUTES.TERMINALS_SHOW, element: <TerminalsShow /> },
              { path: ROUTES.TABLETS, element: <Tablets /> },
              { path: ROUTES.PROFILE, element: <Profile /> },
              // Backendda endpoint bor, sahifasi hali placeholder
              { path: ROUTES.ASSIGNMENTS, element: <Assignments /> },
              {
                path: ROUTES.ASSIGNMENTS_CREATE,
                element: <AssignmentsCreate />,
              },
              { path: ROUTES.ASSIGNMENTS_EDIT, element: <AssignmentsEdit /> },
              { path: ROUTES.ACCESS_LOGS, element: <AccessLogs /> },
            ]),
          },
        ],
      },
      {
        element: <AuthRoute />,
        children: [
          {
            element: <AuthLayout />,
            children: withErrorElement([
              { path: ROUTES.LOGIN, element: <Login /> },
            ]),
          },
        ],
      },
    ],
  },
  // 404 auth daraxtidan tashqarida — Suspense chegarasi yo'q, shuning uchun
  // lazy emas. Chunk yuklash buzilganda ham bu sahifa ochilishi kerak.
  { path: ROUTES.NOT_FOUND, element: <NotFound /> },
]
