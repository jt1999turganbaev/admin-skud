export const ROUTES = {
  HOME: '/',

  LOGIN: '/login',

  // Backend ulangan bo'limlar
  USERS: '/users',
  USERS_CREATE: '/users/create',
  USERS_EDIT: '/users/edit/:id',
  ROOMS: '/rooms',
  TERMINALS: '/terminals',
  TERMINALS_SHOW: '/terminals/:id',
  TABLETS: '/tablets',
  PROFILE: '/profile',

  // Vazifa endi biriktirish bilan birga yaratiladi — alohida "Vazifalar"
  // sahifasi yo'q, `/tasks` biriktirilgan vazifalar ro'yxatini ochadi.
  ASSIGNMENTS: '/tasks',
  ASSIGNMENTS_CREATE: '/tasks/create',
  ASSIGNMENTS_EDIT: '/tasks/edit/:id',
  ACCESS_LOGS: '/logs',

  NOT_FOUND: '*',
} as const

/** `/users/edit/:id` kabi shablonlarni to'ldirish uchun. */
export const buildRoute = (
  route: string,
  params: Record<string, string | number>,
): string =>
  Object.entries(params).reduce(
    (path, [key, value]) => path.replace(`:${key}`, String(value)),
    route,
  )
