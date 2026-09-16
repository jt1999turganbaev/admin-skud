import type { Tone } from '@/shared/types'

/**
 * AssignmentStatusEnum — faqat `active` biriktirish kirish huquqini beradi,
 * nofaol biriktirish tarixda qoladi, lekin terminalga yozilmaydi.
 */
export type AssignmentStatus = 'active' | 'inactive'

/** AdminRoomUserAssignmentShowResource.user */
export interface AssignmentUser {
  id: number
  first_name: string
  last_name: string
  middle_name: string | null
  phone: string
}

/** AdminRoomUserAssignmentShowResource.room */
export interface AssignmentRoom {
  id: number
  name: string
  number: string
}

/** AdminRoomUserAssignmentShowResource.task */
export interface AssignmentTask {
  id: number
  name: string
  description: string | null
}

/** AdminRoomUserAssignmentShowResource */
export interface Assignment {
  id: number
  user: AssignmentUser
  room: AssignmentRoom
  /** Nazoratchi kabi topshiriqsiz biriktirish ham bo'ladi. */
  task: AssignmentTask | null
  starts_at: string
  ends_at: string
  status: AssignmentStatus
  created_at: string | null
  updated_at: string | null
}

/** AdminRoomUserAssignmentListCollection elementi. */
export interface AssignmentListItem {
  id: number
  user?: AssignmentUser
  room?: AssignmentRoom
}

/**
 * Biriktirish bilan birga yaratiladigan topshiriq.
 *
 * Backend mantig'i o'zgargan: endi mavjud topshiriqni ulash yo'q —
 * "umumiy topshiriqni bitta biriktirish bilan o'chirish boshqalarnikini
 * ham yo'q qilardi". Topshiriq har bir biriktirishga tegishli.
 */
export interface AssignmentTaskBody {
  name: string
  description: string | null
}

/** AdminRoomUserAssignmentCreateRequest */
export interface AssignmentCreateBody {
  user_id: number
  room_id: number
  /** Topshiriqsiz biriktirish ham bo'ladi (masalan, nazoratchi). */
  task?: AssignmentTaskBody
  starts_at: string
  ends_at: string
  status?: AssignmentStatus
}

/** AdminRoomUserAssignmentUpdateRequest — hamma maydon ixtiyoriy. */
export type AssignmentUpdateBody = Partial<AssignmentCreateBody>

export const ASSIGNMENT_STATUS_KEY: Record<AssignmentStatus, string> = {
  active: 'status.active',
  inactive: 'status.inactive',
}

export const ASSIGNMENT_STATUS_TONE: Record<AssignmentStatus, Tone> = {
  active: 'ok',
  inactive: 'neutral',
}

export const ASSIGNMENT_STATUSES = Object.keys(
  ASSIGNMENT_STATUS_KEY,
) as AssignmentStatus[]
