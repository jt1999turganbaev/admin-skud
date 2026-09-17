import { lazyWithRetry as lazy } from '@/shared/utils/lazy-with-retry'

export const Login = lazy(() => import('@/pages/auth/auth'))
export const Dashboard = lazy(() => import('@/pages/dashboard/dashboard'))

// Backend ulangan bo'limlar
export const Users = lazy(() => import('@/pages/users/users'))
export const UsersCreate = lazy(() => import('@/pages/users/users-create'))
export const UsersEdit = lazy(() => import('@/pages/users/users-edit'))
export const Rooms = lazy(() => import('@/pages/rooms/rooms'))
export const RoomsCreate = lazy(() => import('@/pages/rooms/rooms-create'))
export const RoomsEdit = lazy(() => import('@/pages/rooms/rooms-edit'))
export const Terminals = lazy(() => import('@/pages/terminals/terminals'))
export const TerminalsShow = lazy(
  () => import('@/pages/terminals/terminals-show'),
)
export const Tablets = lazy(() => import('@/pages/tablets/tablets'))
export const Profile = lazy(() => import('@/pages/profile/profile'))

// Endpoint bor, lekin sahifasi hali placeholder
export const Assignments = lazy(() => import('@/pages/assignments/assignments'))
export const AssignmentsCreate = lazy(
  () => import('@/pages/assignments/assignments-create'),
)
export const AssignmentsEdit = lazy(
  () => import('@/pages/assignments/assignments-edit'),
)
export const AccessLogs = lazy(() => import('@/pages/access-logs/access-logs'))
