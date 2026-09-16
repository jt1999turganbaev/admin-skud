import { useQuery } from '@tanstack/react-query'

import { dashboardApi } from '@/features/dashboard/api/dashboard-api'
import type {
  DashboardRoomDetail,
  DashboardRoomStatus,
  DashboardSummary,
  DashboardTabletHealth,
  DashboardTerminalHealth,
} from '@/features/dashboard/types'
import { QUERY_KEYS } from '@/shared/constants/query-keys'
import type { HTTPError, ResponseWithData } from '@/shared/types/http'

/** Holat tez eskiradi — sahifaga qaytilganda yangilanadi. */
const REFETCH = { staleTime: 30_000 }

export const useFetchDashboardSummary = () =>
  useQuery<ResponseWithData<DashboardSummary>, HTTPError>({
    queryKey: [QUERY_KEYS.DASHBOARD, 'summary'],
    queryFn: dashboardApi.getSummary,
    ...REFETCH,
  })

export const useFetchDashboardRooms = () =>
  useQuery<ResponseWithData<DashboardRoomStatus[]>, HTTPError>({
    queryKey: [QUERY_KEYS.DASHBOARD, 'rooms'],
    queryFn: dashboardApi.getRooms,
    ...REFETCH,
  })

export const useFetchDashboardTerminals = () =>
  useQuery<ResponseWithData<DashboardTerminalHealth[]>, HTTPError>({
    queryKey: [QUERY_KEYS.DASHBOARD, 'terminals'],
    queryFn: () => dashboardApi.getTerminals(),
    ...REFETCH,
  })

export const useFetchDashboardTablets = () =>
  useQuery<ResponseWithData<DashboardTabletHealth[]>, HTTPError>({
    queryKey: [QUERY_KEYS.DASHBOARD, 'tablets'],
    queryFn: () => dashboardApi.getTablets(),
    ...REFETCH,
  })

/** Xona tafsilotlari — oyna ochilgandagina so'raladi. */
export const useFetchDashboardRoom = (id: number | null) =>
  useQuery<ResponseWithData<DashboardRoomDetail>, HTTPError>({
    queryKey: [QUERY_KEYS.DASHBOARD, 'room', id],
    queryFn: () => dashboardApi.getRoom(id as number),
    enabled: id !== null,
  })
