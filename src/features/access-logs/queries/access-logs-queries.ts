import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { accessLogsApi } from '@/features/access-logs/api/access-logs-api'
import type {
  AccessEvent,
  AccessEventDetails,
} from '@/features/access-logs/types'
import { QUERY_KEYS } from '@/shared/constants/query-keys'
import type { FilterParams } from '@/shared/types/filterParams'
import type {
  HTTPError,
  ResponseWithData,
  ResponseWithPagination,
} from '@/shared/types/http'

export const useFetchAccessEvents = (params: FilterParams) =>
  useQuery<ResponseWithPagination<AccessEvent[]>, HTTPError>({
    queryKey: [QUERY_KEYS.ACCESS_EVENTS, params],
    queryFn: () => accessLogsApi.getAll(params),
    // Sahifa almashganda jadval bo'shab qolmasin.
    placeholderData: keepPreviousData,
  })

/** Tafsilotlar oynasi ochilgandagina so'raladi. */
export const useFetchAccessEvent = (id: number | null) =>
  useQuery<ResponseWithData<AccessEventDetails>, HTTPError>({
    queryKey: [QUERY_KEYS.ACCESS_EVENTS, id],
    queryFn: () => accessLogsApi.getOne(id as number),
    enabled: id !== null,
  })
