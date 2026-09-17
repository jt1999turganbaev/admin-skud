export const ROUTES = {
  HOME: '/',

  LOGIN: '/login',

  // Backend ulangan bo'limlar
  USERS: '/users',
  USERS_CREATE: '/users/create',
  USERS_EDIT: '/users/edit/:id',
  ROOMS: '/rooms',
  ROOMS_CREATE: '/rooms/create',
  ROOMS_EDIT: '/rooms/edit/:id',
  TERMINALS: '/terminals',
  TERMINALS_SHOW: '/terminals/:id',
  TABLETS: '/tablets',
  PROFILE: '/profile',

  // "Xonaga biriktirish" — foydalanuvchiga xonaga kirish huquqini beradi.
  // Vazifa endi xonaga tegishli (xona formasida); manzil eskicha `/tasks`.
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
