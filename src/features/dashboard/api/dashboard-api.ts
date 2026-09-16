import type {
  DashboardRoomDetail,
  DashboardRoomStatus,
  DashboardSummary,
  DashboardTabletHealth,
  DashboardTerminalHealth,
} from '@/features/dashboard/types'
import { API_ROUTES } from '@/shared/constants/api-routes'
import { http } from '@/shared/http'
import type { ResponseWithData } from '@/shared/types/http'

/**
 * Bosh sahifa ko'rsatkichlari backendda tayyor hisoblanadi
 * (`GET /dashboard/*`) — avvalgidek ro'yxat endpoint'laridan yig'ilmaydi.
 */
export const dashboardApi = {
  getSummary: async (): Promise<ResponseWithData<DashboardSummary>> => {
    const { data } = await http<ResponseWithData<DashboardSummary>>(
      API_ROUTES.DASHBOARD_SUMMARY,
    )
    return data
  },

  getRooms: async (): Promise<ResponseWithData<DashboardRoomStatus[]>> => {
    const { data } = await http<ResponseWithData<DashboardRoomStatus[]>>(
      API_ROUTES.DASHBOARD_ROOMS,
    )
    return data
  },

  getRoom: async (
    id: number,
  ): Promise<ResponseWithData<DashboardRoomDetail>> => {
    const { data } = await http<ResponseWithData<DashboardRoomDetail>>(
      API_ROUTES.DASHBOARD_ROOM(id),
    )
    return data
  },

  getTablets: async (
    params: { room_id?: number | string | null } = {},
  ): Promise<ResponseWithData<DashboardTabletHealth[]>> => {
    const { data } = await http<ResponseWithData<DashboardTabletHealth[]>>(
      API_ROUTES.DASHBOARD_TABLETS,
      { params },
    )
    return data
  },

  getTerminals: async (
    params: { room_id?: number | string | null } = {},
  ): Promise<ResponseWithData<DashboardTerminalHealth[]>> => {
    const { data } = await http<ResponseWithData<DashboardTerminalHealth[]>>(
      API_ROUTES.DASHBOARD_TERMINALS,
      { params },
    )
    return data
  },
}
