import { useEffect, useState } from 'react'

/** Qidiruv maydonida har bosilishda so'rov ketmasligi uchun. */
export const useDebounce = <T>(value: T, delay = 400): T => {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}
