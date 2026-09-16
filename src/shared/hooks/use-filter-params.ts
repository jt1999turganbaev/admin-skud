import { useCallback, useMemo, useRef, useState } from 'react'

import type { FilterParams } from '@/shared/types/filterParams'

/** Backend `per_page` ni 1..100 oralig'ida qabul qiladi. */
export const DEFAULT_PER_PAGE = 15

/** Jadval ostidagi "sahifada nechta" ro'yxati. */
export const PER_PAGE_OPTIONS = [10, 15, 25, 50, 100]

/**
 * Ro'yxat sahifalari uchun umumiy filtr holati: filtr o'zgarsa sahifa
 * birinchisiga qaytadi, sahifa o'zgarsa filtrlar saqlanadi.
 */
export const useFilterParams = <T extends FilterParams = FilterParams>(
  initial: T = {} as T,
) => {
  // Boshlang'ich qiymatlar `reset` uchun saqlanadi — chaqiruvchi har renderda
  // yangi obyekt uzatsa ham eskisiga yopishib qolmaslik uchun ref'da.
  const initialRef = useRef(initial)

  const [params, setParams] = useState<T>({
    page: 1,
    per_page: DEFAULT_PER_PAGE,
    ...initial,
  })

  const setFilter = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setParams((current) => ({ ...current, [key]: value, page: 1 }))
  }, [])

  const setPage = useCallback((page: number) => {
    setParams((current) => ({ ...current, page }))
  }, [])

  /** Sahifadagi yozuvlar soni o'zgarsa, birinchi sahifaga qaytiladi. */
  const setPerPage = useCallback((perPage: number) => {
    setParams((current) => ({ ...current, per_page: perPage, page: 1 }))
  }, [])

  /**
   * Ustun sarlavhasi bosilganda saralash aylanadi:
   * saralanmagan -> o'sish -> kamayish -> saralanmagan.
   * Backend `order_by` + `sort` juftligini kutadi.
   */
  const toggleSort = useCallback((field: string) => {
    setParams((current) => {
      if (current.order_by !== field) {
        return { ...current, order_by: field, sort: 'asc', page: 1 }
      }

      if (current.sort === 'asc') {
        return { ...current, order_by: field, sort: 'desc', page: 1 }
      }

      return { ...current, order_by: null, sort: null, page: 1 }
    })
  }, [])

  const reset = useCallback(() => {
    setParams({
      page: 1,
      per_page: DEFAULT_PER_PAGE,
      ...initialRef.current,
    })
  }, [])

  return useMemo(
    () => ({ params, setFilter, setPage, setPerPage, toggleSort, reset }),
    [params, setFilter, setPage, setPerPage, toggleSort, reset],
  )
}
