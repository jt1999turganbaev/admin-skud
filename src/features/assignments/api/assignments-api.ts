import type {
  Assignment,
  AssignmentCreateBody,
  AssignmentListItem,
  AssignmentUpdateBody,
} from '@/features/assignments/types'
import { API_ROUTES } from '@/shared/constants/api-routes'
import { http } from '@/shared/http'
import type { FilterParams } from '@/shared/types/filterParams'
import type {
  ResponseWithData,
  ResponseWithMessage,
  ResponseWithPagination,
} from '@/shared/types/http'

export const assignmentsApi = {
  getAll: async (
    params: FilterParams,
  ): Promise<ResponseWithPagination<Assignment[]>> => {
    const { data } = await http<ResponseWithPagination<Assignment[]>>(
      API_ROUTES.ASSIGNMENTS,
      { params },
    )
    return data
  },

  /**
   * Qisqa ro'yxat (sahifalanmaydi). Spetsifikatsiyada faqat ikkita filtr
   * bor: `room_id` va `valid_now`.
   */
  getList: async (
    params: Pick<FilterParams, 'room_id' | 'valid_now'> = {},
  ): Promise<ResponseWithData<AssignmentListItem[]>> => {
    const { data } = await http<ResponseWithData<AssignmentListItem[]>>(
      API_ROUTES.ASSIGNMENTS_LIST,
      { params },
    )
    return data
  },

  getOne: async (id: number): Promise<ResponseWithData<Assignment>> => {
    const { data } = await http<ResponseWithData<Assignment>>(
      API_ROUTES.ASSIGNMENT(id),
    )
    return data
  },

  create: async (body: AssignmentCreateBody): Promise<ResponseWithMessage> => {
    const { data } = await http.post<ResponseWithMessage>(
      API_ROUTES.ASSIGNMENTS,
      body,
    )
    return data
  },

  update: async ({
    id,
    body,
  }: {
    id: number
    body: AssignmentUpdateBody
  }): Promise<ResponseWithMessage> => {
    const { data } = await http.patch<ResponseWithMessage>(
      API_ROUTES.ASSIGNMENT(id),
      body,
    )
    return data
  },

  delete: async (id: number): Promise<ResponseWithMessage> => {
    const { data } = await http.delete<ResponseWithMessage>(
      API_ROUTES.ASSIGNMENT(id),
    )
    return data
  },
}
