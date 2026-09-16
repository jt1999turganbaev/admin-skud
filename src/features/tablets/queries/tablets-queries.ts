import { tabletsApi } from '@/features/tablets/api/tablets-api'
import type {
  Tablet,
  TabletCreateBody,
  TabletListItem,
  TabletUpdateBody,
} from '@/features/tablets/types'
import { QUERY_KEYS } from '@/shared/constants/query-keys'
import { createCrudQueries } from '@/shared/query-client/create-crud-queries'

const queries = createCrudQueries<
  Tablet,
  TabletListItem,
  TabletCreateBody,
  TabletUpdateBody
>(tabletsApi, { key: QUERY_KEYS.TABLETS, listKey: QUERY_KEYS.TABLETS_LIST })

export const useFetchTablets = queries.useFetchAll
export const useFetchTabletsList = queries.useFetchList
export const useFetchTablet = queries.useFetchOne
export const useCreateTablet = queries.useCreate
export const useUpdateTablet = queries.useUpdate
export const useDeleteTablet = queries.useDelete
