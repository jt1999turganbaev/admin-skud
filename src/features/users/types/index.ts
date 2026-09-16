import type { Tone } from '@/shared/types'

export type { UserRole, UserStatus } from '@/features/auth/types'
export {
  getFullName,
  getInitials,
  USER_ROLE_KEY,
  USER_ROLES,
} from '@/features/auth/types'

import type { UserRole, UserStatus } from '@/features/auth/types'

/** AdminUserIndexResource / AdminUserShowResource */
export interface User {
  id: number
  first_name: string
  last_name: string
  middle_name: string | null
  photo?: string | null
  phone: string
  status: UserStatus
  role: UserRole
  created_at: string | null
  updated_at: string | null
}

/** AdminUserListResource — bog'liq ro'yxatlar (select) uchun qisqa shakl. */
export interface UserListItem {
  id: number
  first_name: string
  last_name: string
  phone: string
  role: UserRole
}

/** AdminUserCreateRequest */
export interface UserCreateBody {
  first_name: string
  last_name: string
  middle_name?: string | null
  phone: string
  password: string
  photo?: string | null
  status?: UserStatus
  role?: UserRole
}

/** AdminUserUpdateRequest — hamma maydon ixtiyoriy. */
export type UserUpdateBody = Partial<UserCreateBody>

/** `main` ns dagi kalitlar — matnni komponent `t()` bilan oladi. */
export const USER_STATUS_KEY: Record<UserStatus, string> = {
  active: 'status.active',
  inactive: 'status.inactive',
  blocked: 'status.blocked',
}

export const USER_STATUS_TONE: Record<UserStatus, Tone> = {
  active: 'ok',
  inactive: 'neutral',
  blocked: 'danger',
}

export const USER_STATUSES = Object.keys(USER_STATUS_KEY) as UserStatus[]
