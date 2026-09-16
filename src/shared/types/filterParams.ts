/**
 * Ro'yxat endpoint'larining query parametrlari.
 * Manba: AccessControl Admin API (GET /users, /rooms, /terminals, /tablets,
 * /tasks, /room-user-assignments, /access-events).
 */
export type FilterParams = {
  page?: number
  per_page?: number
  search?: string | null
  order_by?: string | null
  sort?: 'asc' | 'desc' | null

  /** /users */
  role?: string | null
  /** /users, /rooms, /terminals, /tablets */
  status?: string | null
  /** /terminals */
  room_id?: number | string | null
  /** /tablets */
  terminal_id?: number | string | null
  /** /room-user-assignments */
  user_id?: number | string | null
  /** /room-user-assignments */
  task_id?: number | string | null
  /** /room-user-assignments — faqat ayni damda kuchda bo'lganlari */
  valid_now?: boolean | null

  /** /access-events — ruxsat berilgan/rad etilgan */
  granted?: boolean | null
  /** /access-events, /terminals */
  direction?: string | null
  /** /access-events — vaqt oralig'i (ISO yoki "YYYY-MM-DD HH:mm:ss") */
  from?: string | null
  to?: string | null
}
