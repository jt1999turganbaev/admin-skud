/**
 * Backend endpoint'lari bitta joyda.
 * Manba: http://192.168.1.250:8000/docs/admin (AccessControl Admin API 0.0.1)
 */
export const API_ROUTES = {
  AUTH_LOGIN: '/auth/login',
  AUTH_LOGOUT: '/auth/logout',
  AUTH_ME: '/auth/me',

  USERS: '/users',
  USERS_LIST: '/users/list',
  USER: (id: number) => `/users/${id}`,

  ROOMS: '/rooms',
  ROOMS_LIST: '/rooms/list',
  ROOM: (id: number) => `/rooms/${id}`,

  TERMINALS: '/terminals',
  TERMINALS_LIST: '/terminals/list',
  TERMINAL: (id: number) => `/terminals/${id}`,

  TABLETS: '/tablets',
  TABLETS_LIST: '/tablets/list',
  TABLET: (id: number) => `/tablets/${id}`,

  TASKS: '/tasks',
  TASKS_LIST: '/tasks/list',
  TASK: (id: number) => `/tasks/${id}`,

  // Backendda resurs nomi `room-user-assignments`
  ASSIGNMENTS: '/room-user-assignments',
  ASSIGNMENTS_LIST: '/room-user-assignments/list',
  ASSIGNMENT: (id: number) => `/room-user-assignments/${id}`,

  // Bosh sahifa ko'rsatkichlari — backendda tayyor hisoblanadi
  DASHBOARD_SUMMARY: '/dashboard/summary',
  DASHBOARD_ROOMS: '/dashboard/rooms',
  DASHBOARD_ROOM: (id: number) => `/dashboard/rooms/${id}`,
  DASHBOARD_TERMINALS: '/dashboard/terminals',
  DASHBOARD_TABLETS: '/dashboard/tablets',

  // Kirish jurnali — terminal yuborgan identifikatsiya hodisalari
  ACCESS_EVENTS: '/access-events',
  ACCESS_EVENT: (id: number) => `/access-events/${id}`,
} as const
