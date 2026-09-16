import type {
  User,
  UserCreateBody,
  UserListItem,
  UserUpdateBody,
} from '@/features/users/types'
import { API_ROUTES } from '@/shared/constants/api-routes'
import { http } from '@/shared/http'
import type { FilterParams } from '@/shared/types/filterParams'
import type {
  ResponseWithData,
  ResponseWithMessage,
  ResponseWithPagination,
} from '@/shared/types/http'

export const usersApi = {
  getAll: async (
    params: FilterParams,
  ): Promise<ResponseWithPagination<User[]>> => {
    const { data } = await http<ResponseWithPagination<User[]>>(
      API_ROUTES.USERS,
      { params },
    )
    return data
  },

  /** Select'lar uchun qisqa ro'yxat (sahifalanmaydi). */
  getList: async (
    params: Pick<FilterParams, 'status' | 'role'> = {},
  ): Promise<ResponseWithData<UserListItem[]>> => {
    const { data } = await http<ResponseWithData<UserListItem[]>>(
      API_ROUTES.USERS_LIST,
      { params },
    )
    return data
  },

  getOne: async (id: number): Promise<ResponseWithData<User>> => {
    const { data } = await http<ResponseWithData<User>>(API_ROUTES.USER(id))
    return data
  },

  create: async (body: UserCreateBody): Promise<ResponseWithMessage> => {
    const { data } = await http.post<ResponseWithMessage>(
      API_ROUTES.USERS,
      body,
    )
    return data
  },

  update: async ({
    id,
    body,
  }: {
    id: number
    body: UserUpdateBody
  }): Promise<ResponseWithMessage> => {
    const { data } = await http.patch<ResponseWithMessage>(
      API_ROUTES.USER(id),
      body,
    )
    return data
  },

  delete: async (id: number): Promise<ResponseWithMessage> => {
    const { data } = await http.delete<ResponseWithMessage>(API_ROUTES.USER(id))
    return data
  },
}
