import { terminalsApi } from '@/features/terminals/api/terminals-api'
import type {
  Terminal,
  TerminalCreateBody,
  TerminalListItem,
  TerminalUpdateBody,
} from '@/features/terminals/types'
import { QUERY_KEYS } from '@/shared/constants/query-keys'
import { createCrudQueries } from '@/shared/query-client/create-crud-queries'

const queries = createCrudQueries<
  Terminal,
  TerminalListItem,
  TerminalCreateBody,
  TerminalUpdateBody
>(terminalsApi, {
  key: QUERY_KEYS.TERMINALS,
  listKey: QUERY_KEYS.TERMINALS_LIST,
})

export const useFetchTerminals = queries.useFetchAll
export const useFetchTerminalsList = queries.useFetchList
export const useFetchTerminal = queries.useFetchOne
export const useCreateTerminal = queries.useCreate
export const useUpdateTerminal = queries.useUpdate
export const useDeleteTerminal = queries.useDelete
