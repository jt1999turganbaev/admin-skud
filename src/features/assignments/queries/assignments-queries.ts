import { assignmentsApi } from '@/features/assignments/api/assignments-api'
import type {
  Assignment,
  AssignmentCreateBody,
  AssignmentListItem,
  AssignmentUpdateBody,
} from '@/features/assignments/types'
import { QUERY_KEYS } from '@/shared/constants/query-keys'
import { createCrudQueries } from '@/shared/query-client/create-crud-queries'

const queries = createCrudQueries<
  Assignment,
  AssignmentListItem,
  AssignmentCreateBody,
  AssignmentUpdateBody
>(assignmentsApi, {
  key: QUERY_KEYS.ASSIGNMENTS,
  listKey: QUERY_KEYS.ASSIGNMENTS_LIST,
})

export const useFetchAssignments = queries.useFetchAll
export const useFetchAssignmentsList = queries.useFetchList
export const useFetchAssignment = queries.useFetchOne
export const useCreateAssignment = queries.useCreate
export const useUpdateAssignment = queries.useUpdate
export const useDeleteAssignment = queries.useDelete
