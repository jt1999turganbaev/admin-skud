import type {
  Terminal,
  TerminalCreateBody,
  TerminalListItem,
  TerminalUpdateBody,
} from '@/features/terminals/types'
import { API_ROUTES } from '@/shared/constants/api-routes'
import { http } from '@/shared/http'
import type { FilterParams } from '@/shared/types/filterParams'
import type {
  ResponseWithData,
  ResponseWithMessage,
  ResponseWithPagination,
} from '@/shared/types/http'

export const terminalsApi = {
  getAll: async (
    params: FilterParams,
  ): Promise<ResponseWithPagination<Terminal[]>> => {
    const { data } = await http<ResponseWithPagination<Terminal[]>>(
      API_ROUTES.TERMINALS,
      { params },
    )
    return data
  },

  /** Select'lar uchun qisqa ro'yxat (sahifalanmaydi). */
  getList: async (
    params: Pick<FilterParams, 'status' | 'room_id'> = {},
  ): Promise<ResponseWithData<TerminalListItem[]>> => {
    const { data } = await http<ResponseWithData<TerminalListItem[]>>(
      API_ROUTES.TERMINALS_LIST,
      { params },
    )
    return data
  },

  getOne: async (id: number): Promise<ResponseWithData<Terminal>> => {
    const { data } = await http<ResponseWithData<Terminal>>(
      API_ROUTES.TERMINAL(id),
    )
    return data
  },

  create: async (body: TerminalCreateBody): Promise<ResponseWithMessage> => {
    const { data } = await http.post<ResponseWithMessage>(
      API_ROUTES.TERMINALS,
      body,
    )
    return data
  },

  update: async ({
    id,
    body,
  }: {
    id: number
    body: TerminalUpdateBody
  }): Promise<ResponseWithMessage> => {
    const { data } = await http.patch<ResponseWithMessage>(
      API_ROUTES.TERMINAL(id),
      body,
    )
    return data
  },

  delete: async (id: number): Promise<ResponseWithMessage> => {
    const { data } = await http.delete<ResponseWithMessage>(
      API_ROUTES.TERMINAL(id),
    )
    return data
  },
}
