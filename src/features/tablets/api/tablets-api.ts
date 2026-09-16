import type {
  Tablet,
  TabletCreateBody,
  TabletListItem,
  TabletUpdateBody,
} from '@/features/tablets/types'
import { API_ROUTES } from '@/shared/constants/api-routes'
import { http } from '@/shared/http'
import type { FilterParams } from '@/shared/types/filterParams'
import type {
  ResponseWithData,
  ResponseWithMessage,
  ResponseWithPagination,
} from '@/shared/types/http'

export const tabletsApi = {
  getAll: async (
    params: FilterParams,
  ): Promise<ResponseWithPagination<Tablet[]>> => {
    const { data } = await http<ResponseWithPagination<Tablet[]>>(
      API_ROUTES.TABLETS,
      { params },
    )
    return data
  },

  /** Select'lar uchun qisqa ro'yxat (sahifalanmaydi). */
  getList: async (
    params: Pick<FilterParams, 'status' | 'terminal_id'> = {},
  ): Promise<ResponseWithData<TabletListItem[]>> => {
    const { data } = await http<ResponseWithData<TabletListItem[]>>(
      API_ROUTES.TABLETS_LIST,
      { params },
    )
    return data
  },

  getOne: async (id: number): Promise<ResponseWithData<Tablet>> => {
    const { data } = await http<ResponseWithData<Tablet>>(API_ROUTES.TABLET(id))
    return data
  },

  create: async (body: TabletCreateBody): Promise<ResponseWithMessage> => {
    const { data } = await http.post<ResponseWithMessage>(
      API_ROUTES.TABLETS,
      body,
    )
    return data
  },

  update: async ({
    id,
    body,
  }: {
    id: number
    body: TabletUpdateBody
  }): Promise<ResponseWithMessage> => {
    const { data } = await http.patch<ResponseWithMessage>(
      API_ROUTES.TABLET(id),
      body,
    )
    return data
  },

  delete: async (id: number): Promise<ResponseWithMessage> => {
    const { data } = await http.delete<ResponseWithMessage>(
      API_ROUTES.TABLET(id),
    )
    return data
  },
}
