/** Laravel resurs javoblari: `{ data: ... }`. */
export interface ResponseWithData<T> {
  data: T
}

export interface ResponseWithMessage {
  message: string
}

/** Laravel standart sahifalash javobi. */
export interface ResponseWithPagination<T> {
  data: T
  links: {
    first: string | null
    last: string | null
    prev: string | null
    next: string | null
  }
  meta: {
    current_page: number
    from: number | null
    last_page: number
    path: string
    per_page: number
    to: number | null
    total: number
    links: { url: string | null; label: string; active: boolean }[]
  }
}

type ValidationsError = Record<string, string[] | string>

/** Laravel xatolari: 422 da `errors`, qolganlarida `message`. */
export interface HTTPError {
  message: string
  errors?: ValidationsError
  status?: number
  forbidden?: boolean
}
