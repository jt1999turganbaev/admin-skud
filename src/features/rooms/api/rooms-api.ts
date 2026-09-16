import type {
  Room,
  RoomCreateBody,
  RoomListItem,
  RoomUpdateBody,
} from '@/features/rooms/types'
import { API_ROUTES } from '@/shared/constants/api-routes'
import { http } from '@/shared/http'
import type { FilterParams } from '@/shared/types/filterParams'
import type {
  ResponseWithData,
  ResponseWithMessage,
  ResponseWithPagination,
} from '@/shared/types/http'

export const roomsApi = {
  getAll: async (
    params: FilterParams,
  ): Promise<ResponseWithPagination<Room[]>> => {
    const { data } = await http<ResponseWithPagination<Room[]>>(
      API_ROUTES.ROOMS,
      { params },
    )
    return data
  },

  /** Select'lar uchun qisqa ro'yxat (sahifalanmaydi). */
  getList: async (
    params: Pick<FilterParams, 'status'> = {},
  ): Promise<ResponseWithData<RoomListItem[]>> => {
    const { data } = await http<ResponseWithData<RoomListItem[]>>(
      API_ROUTES.ROOMS_LIST,
      { params },
    )
    return data
  },

  getOne: async (id: number): Promise<ResponseWithData<Room>> => {
    const { data } = await http<ResponseWithData<Room>>(API_ROUTES.ROOM(id))
    return data
  },

  create: async (body: RoomCreateBody): Promise<ResponseWithMessage> => {
    const { data } = await http.post<ResponseWithMessage>(
      API_ROUTES.ROOMS,
      body,
    )
    return data
  },

  update: async ({
    id,
    body,
  }: {
    id: number
    body: RoomUpdateBody
  }): Promise<ResponseWithMessage> => {
    const { data } = await http.patch<ResponseWithMessage>(
      API_ROUTES.ROOM(id),
      body,
    )
    return data
  },

  delete: async (id: number): Promise<ResponseWithMessage> => {
    const { data } = await http.delete<ResponseWithMessage>(API_ROUTES.ROOM(id))
    return data
  },
}
