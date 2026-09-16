import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import type { FilterParams } from '@/shared/types/filterParams'
import type {
  HTTPError,
  ResponseWithData,
  ResponseWithMessage,
  ResponseWithPagination,
} from '@/shared/types/http'
import { notifyError, notifySuccess } from '@/shared/ui/notifications'
import { getErrorMessage } from '@/shared/utils/error-message'

/** Resurs api'si — `usersApi`, `roomsApi` va h.k. shu shaklda. */
export interface CrudApi<TItem, TListItem, TCreate, TUpdate> {
  getAll: (params: FilterParams) => Promise<ResponseWithPagination<TItem[]>>
  getList?: (params: FilterParams) => Promise<ResponseWithData<TListItem[]>>
  getOne: (id: number) => Promise<ResponseWithData<TItem>>
  create: (body: TCreate) => Promise<ResponseWithMessage>
  update: (args: { id: number; body: TUpdate }) => Promise<ResponseWithMessage>
  delete: (id: number) => Promise<ResponseWithMessage>
}

/** Backend `message` qaytarmasa ham bildirishnoma bo'sh chiqmasin. */
const DONE = 'Bajarildi.'

interface CrudOptions {
  /** Asosiy query kaliti — invalidate shu bo'yicha ketadi. */
  key: string
  /** `getList` uchun alohida kalit. */
  listKey?: string
}

/**
 * Users / Rooms / Terminals / Tablets — to'rttasi ham bir xil CRUD naqshiga
 * ega (Laravel resurs kontrollerlari). Takrorlamaslik uchun hook'lar shu
 * fabrikadan yasaladi; har bir feature o'z faylida uni chaqiradi.
 */
export const createCrudQueries = <TItem, TListItem, TCreate, TUpdate>(
  api: CrudApi<TItem, TListItem, TCreate, TUpdate>,
  { key, listKey = `${key}-list` }: CrudOptions,
) => {
  const useFetchAll = (params: FilterParams) =>
    useQuery<ResponseWithPagination<TItem[]>, HTTPError>({
      queryKey: [key, params],
      queryFn: () => api.getAll(params),
      // Sahifa almashganda jadval bo'shab qolmasin.
      placeholderData: keepPreviousData,
    })

  const useFetchList = (params: FilterParams = {}, enabled = true) =>
    useQuery<ResponseWithData<TListItem[]>, HTTPError>({
      queryKey: [listKey, params],
      queryFn: () => api.getList!(params),
      enabled: enabled && Boolean(api.getList),
      // Select'lar uchun — kamdan-kam o'zgaradi.
      staleTime: 5 * 60_000,
    })

  const useFetchOne = (id: number) =>
    useQuery<ResponseWithData<TItem>, HTTPError>({
      queryKey: [key, id],
      queryFn: () => api.getOne(id),
      staleTime: 0,
      enabled: Number.isFinite(id),
    })

  /** Muvaffaqiyatdan keyin ro'yxat ham, select ro'yxati ham yangilanadi. */
  const useInvalidate = () => {
    const queryClient = useQueryClient()

    return () => {
      queryClient.invalidateQueries({ queryKey: [key] })
      queryClient.invalidateQueries({ queryKey: [listKey] })
    }
  }

  const useCreate = () => {
    const invalidate = useInvalidate()

    return useMutation<ResponseWithMessage, HTTPError, TCreate>({
      mutationFn: api.create,
      onSuccess: (data) => {
        invalidate()
        notifySuccess(data?.message || DONE)
      },
      onError: (error) => notifyError(getErrorMessage(error)),
    })
  }

  const useUpdate = () => {
    const invalidate = useInvalidate()

    return useMutation<
      ResponseWithMessage,
      HTTPError,
      { id: number; body: TUpdate }
    >({
      mutationFn: api.update,
      onSuccess: (data) => {
        invalidate()
        notifySuccess(data?.message || DONE)
      },
      onError: (error) => notifyError(getErrorMessage(error)),
    })
  }

  const useDelete = () => {
    const invalidate = useInvalidate()

    return useMutation<ResponseWithMessage, HTTPError, number>({
      mutationFn: api.delete,
      onSuccess: (data) => {
        invalidate()
        notifySuccess(data?.message || DONE)
      },
      onError: (error) => notifyError(getErrorMessage(error)),
    })
  }

  return {
    useFetchAll,
    useFetchList,
    useFetchOne,
    useCreate,
    useUpdate,
    useDelete,
  }
}
