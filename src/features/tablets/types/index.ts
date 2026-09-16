import type { DeviceStatus } from '@/features/terminals/types'

export type { DeviceStatus } from '@/features/terminals/types'
export {
  DEVICE_STATUS_KEY,
  DEVICE_STATUSES,
  DEVICE_STATUS_TONE,
} from '@/features/terminals/types'

/** AdminTabletShowResource */
export interface Tablet {
  id: number
  device_identifier: string
  status: DeviceStatus
  last_seen_at: string | null
  terminal: { id: number; name: string; device_identifier: string } | null
  created_at: string | null
  updated_at: string | null
}

/** AdminTabletListCollection elementi. */
export interface TabletListItem {
  id: number
  device_identifier: string
}

/** AdminTabletCreateRequest */
export interface TabletCreateBody {
  terminal_id: number
  device_identifier: string
  status?: DeviceStatus
}

export type TabletUpdateBody = Partial<TabletCreateBody>
