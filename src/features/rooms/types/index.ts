import type { NullableTranslatable, Tone, Translatable } from '@/shared/types'

export type RoomStatus = 'active' | 'inactive'

/** Xonaning topshirig'i — planshet uni kirishda ham, chiqishda ham oladi. */
export interface RoomTask {
  id: number
  name: string
  description: string | null
  translations?: { name: Translatable; description: NullableTranslatable }
}

/** AdminRoomShowResource */
export interface Room {
  id: number
  name: string
  number: string
  number_station: string | null
  status: RoomStatus
  terminals_count: number
  /** Ikkala tildagi asl qiymat — tahrirlash formasi uchun. */
  translations?: { name: Translatable }
  /** Xonada topshiriq bo'lmasa `null`. */
  task: RoomTask | null
  created_at: string | null
  updated_at: string | null
}

/** AdminRoomListCollection elementi — select'lar uchun. */
export interface RoomListItem {
  id: number
  name: string
  number: string
}

/** AdminRoomCreateRequest */
export interface RoomCreateBody {
  /** Ikkala tilda majburiy. */
  name: Translatable
  number: string
  /** Stansiya raqami — majburiy; formada faqat raqam, backendga satr. */
  number_station: string
  status?: RoomStatus
  /**
   * Ixtiyoriy. Tahrirlashda: berilsa — tahrirlanadi yoki yaratiladi,
   * `null` — olib tashlanadi, yuborilmasa — o'zgarmaydi.
   */
  task?: RoomTaskBody | null
}

export interface RoomTaskBody {
  /** Ikkala tilda majburiy. */
  name: Translatable
  /** Har bir til ixtiyoriy, eng ko'pi 4000 belgi. */
  description: NullableTranslatable
}

/** AdminRoomUpdateRequest — hamma maydon ixtiyoriy. */
export type RoomUpdateBody = Partial<RoomCreateBody>

export const ROOM_STATUS_KEY: Record<RoomStatus, string> = {
  active: 'status.active',
  inactive: 'status.inactive',
}

export const ROOM_STATUS_TONE: Record<RoomStatus, Tone> = {
  active: 'ok',
  inactive: 'neutral',
}

export const ROOM_STATUSES = Object.keys(ROOM_STATUS_KEY) as RoomStatus[]

/**
 * "101 — Reception" ko'rinishidagi yorliq.
 *
 * Xona `null` bo'lishi mumkin: terminal xonasiz qolishi yoki bog'langan
 * xona o'chirilgan bo'lishi mumkin — u holda chiziqcha qaytadi.
 */
export const getRoomLabel = (
  room: { name?: string | null; number?: string | null } | null | undefined,
) => {
  if (!room) return '—'

  const parts = [room.number, room.name].filter(Boolean)
  return parts.length ? parts.join(' — ') : '—'
}
