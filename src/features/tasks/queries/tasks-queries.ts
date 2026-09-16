import { tasksApi } from '@/features/tasks/api/tasks-api'
import type {
  Task,
  TaskCreateBody,
  TaskListItem,
  TaskUpdateBody,
} from '@/features/tasks/types'
import { QUERY_KEYS } from '@/shared/constants/query-keys'
import { createCrudQueries } from '@/shared/query-client/create-crud-queries'

const queries = createCrudQueries<
  Task,
  TaskListItem,
  TaskCreateBody,
  TaskUpdateBody
>(tasksApi, { key: QUERY_KEYS.TASKS, listKey: QUERY_KEYS.TASKS_LIST })

export const useFetchTasks = queries.useFetchAll
export const useFetchTasksList = queries.useFetchList
export const useFetchTask = queries.useFetchOne
export const useCreateTask = queries.useCreate
export const useUpdateTask = queries.useUpdate
export const useDeleteTask = queries.useDelete
