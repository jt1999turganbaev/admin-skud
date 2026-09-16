import type { Tone } from '@/shared/types'

export type DeviceStatus = 'active' | 'inactive'
export type TerminalDirection = 'in' | 'out'
/** Backend `TerminalManufacturerEnum`. */
export type TerminalManufacturer = string

/** AdminTerminalShowResource */
export interface Terminal {
  id: number
  name: string
  direction: TerminalDirection
  device_identifier: string
  status: DeviceStatus
  last_seen_at: string | null
  /** Aloqa rekvizitlari. `password` hech qachon qaytmaydi — `has_password`. */
  ip_address: string | null
  port: number | null
  login: string | null
  manufacturer: TerminalManufacturer | null
  has_password: boolean
  /** Rekvizitlar to'liq — qurilmani sozlash va unga odam yozish mumkin. */
  is_configured: boolean
  room: { id: number; name: string; number: string } | null
  /** Ro'yxat javobida qaytmasligi mumkin. */
  tablets_count?: number
  created_at: string | null
  updated_at: string | null
}

/** AdminTerminalListCollection elementi — select'lar uchun. */
export interface TerminalListItem {
  id: number
  name: string
  device_identifier: string
}

/** AdminTerminalCreateRequest */
export interface TerminalCreateBody {
  room_id: number
  name: string
  direction: TerminalDirection
  device_identifier: string
  status?: DeviceStatus | null
  ip_address?: string | null
  port?: number | null
  login?: string | null
  /** Faqat yuboriladi, javobda qaytmaydi. */
  password?: string | null
  manufacturer?: TerminalManufacturer | null
}

export type TerminalUpdateBody = Partial<TerminalCreateBody>

export const DEVICE_STATUS_KEY: Record<DeviceStatus, string> = {
  active: 'status.active',
  inactive: 'status.inactive',
}

export const DEVICE_STATUS_TONE: Record<DeviceStatus, Tone> = {
  active: 'ok',
  inactive: 'neutral',
}

export const DEVICE_STATUSES = Object.keys(DEVICE_STATUS_KEY) as DeviceStatus[]

export const DIRECTION_KEY: Record<TerminalDirection, string> = {
  in: 'terminals.in',
  out: 'terminals.out',
}

export const DIRECTION_TONE: Record<TerminalDirection, Tone> = {
  in: 'info',
  out: 'warn',
}

export const DIRECTIONS = Object.keys(DIRECTION_KEY) as TerminalDirection[]
