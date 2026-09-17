import type { AssignmentCreateBody } from '@/features/assignments/types'
import { toApiDateTime } from '@/shared/utils/format-date'

import type { AssignmentFormValues } from './form'

/**
 * Forma qiymatlarini backend kutgan shaklga o'giradi.
 *
 * Topshiriq endi xonaga tegishli (xona formasida) — biriktirish faqat
 * kirish huquqini beradi, shuning uchun `task` yuborilmaydi.
 */
export const toBody = (values: AssignmentFormValues): AssignmentCreateBody => ({
  user_id: Number(values.user_id),
  room_id: Number(values.room_id),
  starts_at: toApiDateTime(values.starts_at),
  ends_at: toApiDateTime(values.ends_at),
  status: values.status,
})
