import type {
  DeviceStatus,
  TerminalDirection,
} from '@/features/terminals/types'
import type { Tone } from '@/shared/types'

/** Dashboard resurslaridagi qisqa xona shakli. */
export interface DashboardRoom {
  id: number
  name: string
  number: string
}

/** AdminDashboardSummaryResource — bugungi ko'rsatkichlar. */
export interface DashboardSummary {
  /** Mahalliy kun (backend hisoblaydi). */
  date: string
  timezone: string
  today: {
    identifications: number
    granted: number
    denied: number
    unknown_faces: number
  }
  active_assignments: number
  rooms: number
  terminals: {
    total: number
    online: number
    offline: number
    unknown: number
    not_configured: number
  }
  tablets: {
    total: number
    online: number
    offline: number
    never_seen: number
  }
}

/** AdminDashboardRoomStatusResource — xonalar kesimidagi holat. */
export interface DashboardRoomStatus {
  room: DashboardRoom
  /** Ayni damda kuchda bo'lgan biriktirishi bor odamlar. */
  expected: number
  /** Biriktirish boshlangach kirish terminalidan ruxsat bilan o'tganlar. */
  entered: number
  missing: number
  last_event_at: string | null
  terminals: { total: number; online: number }
  /** Spetsifikatsiyada `string`, amalda son — Scramble noto'g'ri aniqlagan. */
  tablets: { total: number | string; online: number | string }
}

/** AdminDashboardRoomDetailResource — bitta xona bo'yicha ro'yxat. */
export interface DashboardRoomDetail {
  room: DashboardRoom
  expected: number
  entered: number
  missing: number
  participants: {
    assignment_id: number
    user: { id: number; full_name: string; phone: string }
    task: { id: number; name: string } | null
    starts_at: string
    ends_at: string
    entered: boolean
    entered_at: string | null
  }[]
}

/** TerminalHealthEnum — saqlanmaydi, har safar hisoblanadi. */
export type TerminalHealth = 'online' | 'offline' | 'unknown' | 'not_configured'

/** AdminDashboardTerminalHealthResource */
export interface DashboardTerminalHealth {
  id: number
  name: string
  direction: TerminalDirection
  ip_address: string | null
  room: DashboardRoom
  health: TerminalHealth
  last_checked_at: string | null
  /** Masalan: "[503] Failed to connect". */
  last_check_error: string | null
  /** Oxirgi marta push kelgan vaqt (odam o'tganda). */
  last_seen_at: string | null
  provisioned: number | string
  expected: number | string
  /** Ruxsati bor, lekin qurilmaga yozilmagan — eshik oldida qoladi. */
  pending_provision: number
  /** Ruxsati tugagan, lekin qurilmada hali bor — eshikni ocha oladi. */
  pending_removal: number
  in_sync: boolean | string
}

/** TabletHealthEnum — `last_seen_at` dan hisoblanadi, saqlanmaydi. */
export type TabletHealth = 'online' | 'offline' | 'never_seen'

/** AdminDashboardTabletHealthResource */
export interface DashboardTabletHealth {
  id: number
  device_identifier: string
  status: DeviceStatus
  terminal: { id: number; name: string; direction: TerminalDirection }
  room: DashboardRoom
  health: TabletHealth
  last_seen_at: string | null
  /** Planshet oxirgi marta ulangan xona. */
  connected_room: { id: number; number: string } | null
  /** O'rnatilgan xonadan boshqa xonani ko'rsatyapti — sozlashda xato. */
  room_mismatch: boolean | string
}

export const TABLET_HEALTH_KEY: Record<TabletHealth, string> = {
  online: 'dashboard.health.online',
  offline: 'dashboard.health.offline',
  never_seen: 'dashboard.health.neverSeen',
}

export const TABLET_HEALTH_TONE: Record<TabletHealth, Tone> = {
  online: 'ok',
  offline: 'danger',
  never_seen: 'neutral',
}

export const TERMINAL_HEALTH_KEY: Record<TerminalHealth, string> = {
  online: 'dashboard.health.online',
  offline: 'dashboard.health.offline',
  unknown: 'dashboard.health.unknown',
  not_configured: 'dashboard.health.notConfigured',
}

export const TERMINAL_HEALTH_TONE: Record<TerminalHealth, Tone> = {
  online: 'ok',
  offline: 'danger',
  unknown: 'neutral',
  not_configured: 'warn',
}
