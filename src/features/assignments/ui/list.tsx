import { useState } from 'react'
import {
  Button,
  Group,
  Select,
  Stack,
  Switch,
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { IconPlus, IconSearch } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import {
  useDeleteAssignment,
  useFetchAssignments,
} from '@/features/assignments/queries/assignments-queries'
import {
  ASSIGNMENT_STATUS_KEY,
  ASSIGNMENT_STATUSES,
  ASSIGNMENT_STATUS_TONE,
  type Assignment,
} from '@/features/assignments/types'
import { useFetchRoomsList } from '@/features/rooms/queries/rooms-queries'
import { getRoomLabel } from '@/features/rooms/types'
import { useFetchTasksList } from '@/features/tasks/queries/tasks-queries'
import { useFetchUsersList } from '@/features/users/queries/users-queries'
import { getFullName } from '@/features/users/types'
import { buildRoute, ROUTES } from '@/shared/constants/routes'
import { useDebounce, useDeleteConfirm, useFilterParams } from '@/shared/hooks'
import {
  Badge,
  Panel,
  RowActions,
  SortableTh,
  TableFooter,
  TableState,
} from '@/shared/ui'
import { formatDateTime } from '@/shared/utils/format-date'

import { AssignmentDetailsModal } from './assignment-details-modal'

const COLUMNS = 8

export const AssignmentsList = () => {
  const { params, setFilter, setPage, setPerPage, toggleSort } =
    useFilterParams()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [viewId, setViewId] = useState<number | null>(null)
  const debouncedSearch = useDebounce(search)

  const { data, isPending, error, refetch } = useFetchAssignments({
    ...params,
    search: debouncedSearch || null,
  })

  // Filtr select'lari uchun qisqa ro'yxatlar
  const { data: usersData } = useFetchUsersList()
  const { data: roomsData } = useFetchRoomsList()
  const { data: tasksData } = useFetchTasksList()

  const remove = useDeleteAssignment()
  const confirmDelete = useDeleteConfirm()

  const assignments = data?.data ?? []
  const meta = data?.meta

  const openCreate = () => navigate(ROUTES.ASSIGNMENTS_CREATE)

  const openEdit = (assignment: Assignment) =>
    navigate(buildRoute(ROUTES.ASSIGNMENTS_EDIT, { id: assignment.id }))

  return (
    <Stack gap={32}>
      {/* Sarlavha, filtrlar va jadval — bitta panel */}
      <Panel gap={20}>
        <Group justify="space-between" align="flex-start" gap="md" wrap="wrap">
          <Title order={4} fz="md" lh="36px">
            {t('assignments.title')}
          </Title>

          {/* Filtrlar ko'p — ular o'ngga tekislanadi, "biriktirish"
              tugmasi esa qaysi qatorga tushmasin, eng o'ngda qoladi. */}
          <Group gap="sm" wrap="wrap" justify="flex-end" style={{ flex: 1 }}>
            <TextInput
              w={260}
              placeholder={t('assignments.searchPlaceholder')}
              leftSection={<IconSearch size={17} />}
              value={search}
              onChange={(event) => setSearch(event.currentTarget.value)}
              size="sm"
            />

            <Select
              size="sm"
              w={200}
              placeholder={t('common.filterAll', {
                field: t('assignments.user'),
              })}
              data={(usersData?.data ?? []).map((user) => ({
                value: String(user.id),
                label: getFullName(user),
              }))}
              value={params.user_id ? String(params.user_id) : null}
              onChange={(value) => setFilter('user_id', value)}
              searchable
              clearable
            />

            <Select
              size="sm"
              w={190}
              placeholder={t('common.filterAll', {
                field: t('assignments.room'),
              })}
              data={(roomsData?.data ?? []).map((room) => ({
                value: String(room.id),
                label: getRoomLabel(room),
              }))}
              value={params.room_id ? String(params.room_id) : null}
              onChange={(value) => setFilter('room_id', value)}
              searchable
              clearable
            />

            <Select
              size="sm"
              w={190}
              placeholder={t('common.filterAll', {
                field: t('assignments.task'),
              })}
              data={(tasksData?.data ?? []).map((task) => ({
                value: String(task.id),
                label: task.name,
              }))}
              value={params.task_id ? String(params.task_id) : null}
              onChange={(value) => setFilter('task_id', value)}
              searchable
              clearable
            />

            <Select
              size="sm"
              w={170}
              placeholder={t('common.filterAll', {
                field: t('common.status'),
              })}
              data={ASSIGNMENT_STATUSES.map((value) => ({
                value,
                label: t(ASSIGNMENT_STATUS_KEY[value]),
              }))}
              value={params.status ?? null}
              onChange={(value) => setFilter('status', value)}
              clearable
            />

            {/* `valid_now` — faqat ayni damda kuchda bo'lgan biriktirishlar */}
            <Switch
              size="sm"
              label={t('assignments.validNow')}
              checked={Boolean(params.valid_now)}
              onChange={(event) =>
                setFilter('valid_now', event.currentTarget.checked || null)
              }
            />

            <Button
              leftSection={<IconPlus size={20} />}
              px={20}
              h={36}
              ml="auto"
              onClick={openCreate}
            >
              {t('assignments.add')}
            </Button>
          </Group>
        </Group>

        <Table.ScrollContainer minWidth={1180} className="scroll">
          <Table stickyHeader highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>№</Table.Th>
                <Table.Th>{t('assignments.user')}</Table.Th>
                <Table.Th>{t('assignments.room')}</Table.Th>
                <Table.Th>{t('assignments.task')}</Table.Th>
                <SortableTh
                  field="starts_at"
                  params={params}
                  onSort={toggleSort}
                >
                  {t('assignments.startsAt')}
                </SortableTh>
                <SortableTh field="ends_at" params={params} onSort={toggleSort}>
                  {t('assignments.endsAt')}
                </SortableTh>
                <SortableTh field="status" params={params} onSort={toggleSort}>
                  {t('common.status')}
                </SortableTh>
                <Table.Th ta="right">{t('common.actions')}</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              <TableState
                colSpan={COLUMNS}
                isLoading={isPending}
                error={error}
                isEmpty={assignments.length === 0}
                emptyText={t('assignments.notFound')}
                onRetry={refetch}
              />

              {assignments.map((assignment, index) => (
                <Table.Tr key={assignment.id}>
                  <Table.Td>
                    <Text size="sm" c="dimmed">
                      {(meta?.from ?? 1) + index}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" fw={600}>
                      {getFullName(assignment.user)}
                    </Text>
                    <Text size="xs" c="dimmed" className="tabular">
                      {assignment.user?.phone ?? '—'}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{getRoomLabel(assignment.room)}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{assignment.task?.name ?? '—'}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" className="tabular">
                      {formatDateTime(assignment.starts_at)}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" className="tabular">
                      {formatDateTime(assignment.ends_at)}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge tone={ASSIGNMENT_STATUS_TONE[assignment.status]}>
                      {t(ASSIGNMENT_STATUS_KEY[assignment.status])}
                    </Badge>
                  </Table.Td>
                  <Table.Td ta="right">
                    <RowActions
                      onView={() => setViewId(assignment.id)}
                      onEdit={() => openEdit(assignment)}
                      onDelete={() =>
                        confirmDelete({
                          name: getFullName(assignment.user),
                          onConfirm: () => remove.mutate(assignment.id),
                        })
                      }
                    />
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>

        <TableFooter
          page={meta?.current_page ?? 1}
          lastPage={meta?.last_page ?? 1}
          total={meta?.total ?? 0}
          onChange={setPage}
          perPage={params.per_page}
          onPerPageChange={setPerPage}
        />
      </Panel>

      <AssignmentDetailsModal
        assignmentId={viewId}
        onClose={() => setViewId(null)}
      />
    </Stack>
  )
}
