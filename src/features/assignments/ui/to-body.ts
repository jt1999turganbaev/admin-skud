import type { AssignmentCreateBody } from '@/features/assignments/types'
import { toApiDateTime } from '@/shared/utils/format-date'

import type { AssignmentFormValues } from './form'

/** Bo'sh tavsif `null` bo'lib ketadi — u tilda tavsif yo'q. */
const toDescription = (value: string) => value.trim() || null

/**
 * Forma qiymatlarini backend kutgan shaklga o'giradi.
 *
 * Topshiriq biriktirish bilan birga yaratiladi va nomi formada majburiy —
 * shuning uchun `task` doim ikkala tilda yuboriladi.
 */
export const toBody = (values: AssignmentFormValues): AssignmentCreateBody => ({
  user_id: Number(values.user_id),
  room_id: Number(values.room_id),
  starts_at: toApiDateTime(values.starts_at),
  ends_at: toApiDateTime(values.ends_at),
  status: values.status,
  task: {
    name: {
      uz: values.task.name.uz.trim(),
      qr: values.task.name.qr.trim(),
    },
    description: {
      uz: toDescription(values.task.description.uz),
      qr: toDescription(values.task.description.qr),
    },
  },
})
