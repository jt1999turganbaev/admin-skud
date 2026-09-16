import type {
  Task,
  TaskCreateBody,
  TaskListItem,
  TaskUpdateBody,
} from '@/features/tasks/types'
import { API_ROUTES } from '@/shared/constants/api-routes'
import { http } from '@/shared/http'
import type { FilterParams } from '@/shared/types/filterParams'
import type {
  ResponseWithData,
  ResponseWithMessage,
  ResponseWithPagination,
} from '@/shared/types/http'

export const tasksApi = {
  getAll: async (
    params: FilterParams,
  ): Promise<ResponseWithPagination<Task[]>> => {
    const { data } = await http<ResponseWithPagination<Task[]>>(
      API_ROUTES.TASKS,
      { params },
    )
    return data
  },

  /** Select'lar uchun qisqa ro'yxat (sahifalanmaydi). */
  getList: async (
    params: Pick<FilterParams, 'status'> = {},
  ): Promise<ResponseWithData<TaskListItem[]>> => {
    const { data } = await http<ResponseWithData<TaskListItem[]>>(
      API_ROUTES.TASKS_LIST,
      { params },
    )
    return data
  },

  getOne: async (id: number): Promise<ResponseWithData<Task>> => {
    const { data } = await http<ResponseWithData<Task>>(API_ROUTES.TASK(id))
    return data
  },

  create: async (body: TaskCreateBody): Promise<ResponseWithMessage> => {
    const { data } = await http.post<ResponseWithMessage>(
      API_ROUTES.TASKS,
      body,
    )
    return data
  },

  update: async ({
    id,
    body,
  }: {
    id: number
    body: TaskUpdateBody
  }): Promise<ResponseWithMessage> => {
    const { data } = await http.patch<ResponseWithMessage>(
      API_ROUTES.TASK(id),
      body,
    )
    return data
  },

  delete: async (id: number): Promise<ResponseWithMessage> => {
    const { data } = await http.delete<ResponseWithMessage>(API_ROUTES.TASK(id))
    return data
  },
}
