import { usersApi } from '@/features/users/api/users-api'
import type {
  User,
  UserCreateBody,
  UserListItem,
  UserUpdateBody,
} from '@/features/users/types'
import { QUERY_KEYS } from '@/shared/constants/query-keys'
import { createCrudQueries } from '@/shared/query-client/create-crud-queries'

const queries = createCrudQueries<
  User,
  UserListItem,
  UserCreateBody,
  UserUpdateBody
>(usersApi, { key: QUERY_KEYS.USERS, listKey: QUERY_KEYS.USERS_LIST })

export const useFetchUsers = queries.useFetchAll
export const useFetchUsersList = queries.useFetchList
export const useFetchUser = queries.useFetchOne
export const useCreateUser = queries.useCreate
export const useUpdateUser = queries.useUpdate
export const useDeleteUser = queries.useDelete
