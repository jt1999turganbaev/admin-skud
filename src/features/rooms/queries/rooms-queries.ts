import { roomsApi } from '@/features/rooms/api/rooms-api'
import type {
  Room,
  RoomCreateBody,
  RoomListItem,
  RoomUpdateBody,
} from '@/features/rooms/types'
import { QUERY_KEYS } from '@/shared/constants/query-keys'
import { createCrudQueries } from '@/shared/query-client/create-crud-queries'

const queries = createCrudQueries<
  Room,
  RoomListItem,
  RoomCreateBody,
  RoomUpdateBody
>(roomsApi, { key: QUERY_KEYS.ROOMS, listKey: QUERY_KEYS.ROOMS_LIST })

export const useFetchRooms = queries.useFetchAll
export const useFetchRoomsList = queries.useFetchList
export const useFetchRoom = queries.useFetchOne
export const useCreateRoom = queries.useCreate
export const useUpdateRoom = queries.useUpdate
export const useDeleteRoom = queries.useDelete
