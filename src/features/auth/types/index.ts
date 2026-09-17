export type UserRole = 'admin' | 'nazoratchi' | 'user'
export type UserStatus = 'active' | 'inactive' | 'blocked'

/** AdminAuthLoginRequest */
export interface LoginBody {
  phone: string
  password: string
}

/** AdminAuthGetMeResource */
export interface AuthUser {
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

/** `main` ns dagi kalitlar — matnni komponent `t()` bilan oladi. */
export const USER_ROLE_KEY: Record<UserRole, string> = {
  admin: 'role.admin',
  nazoratchi: 'role.nazoratchi',
  user: 'role.user',
}

export const USER_ROLES = Object.keys(USER_ROLE_KEY) as UserRole[]

/** Ism maydonlari — bog'lanish o'chirilgan bo'lsa butunlay `null` kelishi mumkin. */
type NamedUser = {
  first_name?: string | null
  last_name?: string | null
  middle_name?: string | null
}

/** "Aliyev Alisher Baxtiyorovich" ko'rinishidagi to'liq ism. */
export const getFullName = (user: NamedUser | null | undefined): string => {
  if (!user) return '—'

  const full = [user.last_name, user.first_name, user.middle_name]
    .filter(Boolean)
    .join(' ')

  return full || '—'
}

/** Avatar uchun bosh harflar; ism bo'lmasa — savol belgisi. */
export const getInitials = (user: NamedUser | null | undefined): string => {
  const letters = [user?.last_name, user?.first_name]
    .map((part) => part?.trim().charAt(0) ?? '')
    .join('')

  return letters.toUpperCase() || '?'
}
