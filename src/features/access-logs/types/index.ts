import type { TerminalDirection } from '@/features/terminals/types'
import type { Tone } from '@/shared/types'

/** Hodisadagi xona — `AdminAccessEventIndexResource.terminal.room` */
export interface AccessEventRoom {
  id: number
  name: string
  number: string
}

/** Hodisadagi terminal — xonasi bilan birga keladi. */
export interface AccessEventTerminal {
  id: number
  name: string
  direction: TerminalDirection
  ip_address: string | null
  room: AccessEventRoom
}

/** Ro'yxatdagi foydalanuvchi — qisqa shakl. */
export interface AccessEventUser {
  id: number
  first_name: string
  last_name: string
  phone: string
}

/** AdminAccessEventIndexResource */
export interface AccessEvent {
  id: number
  captured_at: string
  granted: boolean
  /** Terminal bergan mehmon identifikatori. */
  visitor_ulid: string
  /** Terminal tanimagan bo'lsa ham ismi kelishi mumkin. */
  reported_name: string | null
  /** Surat bormi — o'zi faqat bitta hodisani olishda qaytadi. */
  has_face_image: boolean
  user: AccessEventUser | null
  terminal: AccessEventTerminal | null
  task: { id: number; name: string } | null
}

/** AdminAccessEventShowResource — bitta hodisaning to'liq ma'lumoti. */
export interface AccessEventDetails {
  id: number
  captured_at: string
  created_at: string | null
  granted: boolean
  visitor_ulid: string
  reported_name: string | null
  terminal_ip: string | null
  /** Qurilma olgan surat — nizoli holatlarni tekshirish uchun. */
  face_image: string | null
  /** Hikvision'ning xom payloadi — diagnostika uchun. */
  terminal_response: string | null
  user:
    | (AccessEventUser & { middle_name: string | null; photo: string | null })
    | null
  terminal: AccessEventTerminal | null
  assignment: {
    id: number
    starts_at: string
    ends_at: string
    task: { id: number; name: string; description: string | null } | null
  } | null
}

/** Natija — ro'yxatdagi filtr va belgilar uchun. */
export type AccessResult = 'granted' | 'denied'

export const ACCESS_RESULT_KEY: Record<AccessResult, string> = {
  granted: 'logs.granted',
  denied: 'logs.denied',
}

export const ACCESS_RESULT_TONE: Record<AccessResult, Tone> = {
  granted: 'ok',
  denied: 'danger',
}

export const ACCESS_RESULTS = Object.keys(ACCESS_RESULT_KEY) as AccessResult[]

/** Hodisada ko'rsatiladigan ism: tanilgan foydalanuvchi yoki terminal bergani. */
export const getEventName = (event: {
  user: AccessEventUser | null
  reported_name: string | null
}) =>
  event.user
    ? `${event.user.last_name} ${event.user.first_name}`
    : (event.reported_name ?? null)
