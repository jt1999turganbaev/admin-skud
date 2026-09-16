import type {
  AccessEvent,
  AccessEventDetails,
} from '@/features/access-logs/types'
import { API_ROUTES } from '@/shared/constants/api-routes'
import { http } from '@/shared/http'
import type { FilterParams } from '@/shared/types/filterParams'
import type {
  ResponseWithData,
  ResponseWithPagination,
} from '@/shared/types/http'

/**
 * Kirish jurnali faqat o'qish uchun — backendda `POST`/`PATCH`/`DELETE`
 * yo'q, shuning uchun umumiy CRUD fabrikasi ishlatilmaydi.
 */
export const accessLogsApi = {
  getAll: async (
    params: FilterParams,
  ): Promise<ResponseWithPagination<AccessEvent[]>> => {
    const { data } = await http<ResponseWithPagination<AccessEvent[]>>(
      API_ROUTES.ACCESS_EVENTS,
      { params },
    )
    return data
  },

  getOne: async (id: number): Promise<ResponseWithData<AccessEventDetails>> => {
    const { data } = await http<ResponseWithData<AccessEventDetails>>(
      API_ROUTES.ACCESS_EVENT(id),
    )
    return data
  },
}
