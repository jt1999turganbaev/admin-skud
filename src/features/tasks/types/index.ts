import type { NullableTranslatable, Tone, Translatable } from '@/shared/types'

/** TaskStatusEnum — nofaol topshiriq yangi imtihonlarga biriktirilmaydi. */
export type TaskStatus = 'active' | 'inactive'

/** AdminTaskShowResource */
export interface Task {
  id: number
  name: string
  description: string | null
  status: TaskStatus
  /** Ikkala tildagi asl qiymat — tahrirlash formasi uchun. */
  translations?: { name: Translatable; description: NullableTranslatable }
  created_at: string | null
  updated_at: string | null
}

/** AdminTaskListCollection elementi — select'lar uchun. */
export interface TaskListItem {
  id: number
  name: string
  description?: string | null
}

/** AdminTaskCreateRequest */
export interface TaskCreateBody {
  /** Ikkala tilda majburiy. */
  name: Translatable
  /** Har bir til ixtiyoriy, eng ko'pi 4000 belgi. */
  description?: NullableTranslatable | null
  status?: TaskStatus
}

/** AdminTaskUpdateRequest — hamma maydon ixtiyoriy. */
export type TaskUpdateBody = Partial<TaskCreateBody>

/** Tavsif ovozda o'qiladi — TTS'ning 4096 belgilik chegarasi tufayli 4000. */
export const TASK_DESCRIPTION_MAX = 4000

export const TASK_STATUS_KEY: Record<TaskStatus, string> = {
  active: 'status.active',
  inactive: 'status.inactive',
}

export const TASK_STATUS_TONE: Record<TaskStatus, Tone> = {
  active: 'ok',
  inactive: 'neutral',
}

export const TASK_STATUSES = Object.keys(TASK_STATUS_KEY) as TaskStatus[]
