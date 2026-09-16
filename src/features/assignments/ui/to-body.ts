import type { AssignmentCreateBody } from '@/features/assignments/types'
import { toApiDateTime } from '@/shared/utils/format-date'

import type { AssignmentFormValues } from './form'

/**
 * Forma qiymatlarini backend kutgan shaklga o'giradi.
 *
 * Topshiriq biriktirish bilan birga yaratiladi va formada majburiy —
 * shuning uchun `task` doim yuboriladi.
 */
export const toBody = (values: AssignmentFormValues): AssignmentCreateBody => ({
  user_id: Number(values.user_id),
  room_id: Number(values.room_id),
  starts_at: toApiDateTime(values.starts_at),
  ends_at: toApiDateTime(values.ends_at),
  status: values.status,
  task: {
    name: values.task_name.trim(),
    description: values.task_description.trim(),
  },
})
