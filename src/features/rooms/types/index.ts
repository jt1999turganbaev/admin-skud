import type { Tone } from '@/shared/types'

export type RoomStatus = 'active' | 'inactive'

/** AdminRoomShowResource */
export interface Room {
  id: number
  name: string
  number: string
  status: RoomStatus
  terminals_count: number
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
  name: string
  number: string
  status?: RoomStatus
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
