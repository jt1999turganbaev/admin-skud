import { useState } from 'react'
import {
  Button,
  Group,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { IconPlus, IconSearch } from '@tabler/icons-react'

import { USER_ROLE_KEY, USER_ROLES } from '@/features/auth/types'
import {
  useDeleteUser,
  useFetchUsers,
} from '@/features/users/queries/users-queries'
import {
  getFullName,
  USER_STATUS_KEY,
  USER_STATUSES,
  USER_STATUS_TONE,
  type User,
} from '@/features/users/types'
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

const COLUMNS = 7

export const UsersList = () => {
  const navigate = useNavigate()
  const { params, setFilter, setPage, setPerPage, toggleSort } =
    useFilterParams()
  const { t } = useTranslation()

  const roleOptions = USER_ROLES.map((value) => ({
    value,
    label: t(USER_ROLE_KEY[value]),
  }))
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)

  const { data, isPending, error, refetch } = useFetchUsers({
    ...params,
    search: debouncedSearch || null,
  })
  const remove = useDeleteUser()
  const confirmDelete = useDeleteConfirm()

  const users = data?.data ?? []
  const meta = data?.meta

  const openCreate = () => navigate(ROUTES.USERS_CREATE)
  const openEdit = (user: User) =>
    navigate(buildRoute(ROUTES.USERS_EDIT, { id: user.id }))

  return (
    <Stack gap={32}>
      {/* Sarlavha, filtrlar va jadval — bitta panel */}
      <Panel gap={20}>
        {/* Sarlavha chapda, qidiruv va filtrlar o'ngda; tor ekranda
            guruh pastga tushadi (wrap). */}
        <Group justify="space-between" align="flex-start" gap="md" wrap="wrap">
          <Title order={4} fz="md" lh="36px">
            {t('users.title')}
          </Title>
          <Group gap="sm" wrap="wrap">
            <TextInput
              w={300}
              placeholder={t('users.searchPlaceholder')}
              leftSection={<IconSearch size={17} />}
              value={search}
              onChange={(event) => setSearch(event.currentTarget.value)}
              size="sm"
            />

            <Select
              size="sm"
              w={190}
              placeholder={t('common.filterAll', { field: t('users.role') })}
              data={roleOptions}
              value={params.role ?? null}
              onChange={(value) => setFilter('role', value)}
              clearable
            />

            <Select
              size="sm"
              w={190}
              placeholder={t('common.filterAll', {
                field: t('common.status'),
              })}
              data={USER_STATUSES.map((value) => ({
                value,
                label: t(USER_STATUS_KEY[value]),
              }))}
              value={params.status ?? null}
              onChange={(value) => setFilter('status', value)}
              clearable
            />
            <Button
              leftSection={<IconPlus size={20} />}
              px={20}
              h={36}
              onClick={openCreate}
            >
              {t('users.add')}
            </Button>
          </Group>
        </Group>

        <Table.ScrollContainer minWidth={940} className="scroll">
          <Table stickyHeader highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>№</Table.Th>
                <SortableTh
                  field="last_name"
                  params={params}
                  onSort={toggleSort}
                >
                  {t('users.fullName')}
                </SortableTh>
                <SortableTh field="phone" params={params} onSort={toggleSort}>
                  {t('users.phone')}
                </SortableTh>
                <SortableTh field="role" params={params} onSort={toggleSort}>
                  {t('users.role')}
                </SortableTh>
                <SortableTh field="status" params={params} onSort={toggleSort}>
                  {t('common.status')}
                </SortableTh>
                <SortableTh
                  field="created_at"
                  params={params}
                  onSort={toggleSort}
                >
                  {t('common.createdAt')}
                </SortableTh>
                <Table.Th ta="right">{t('common.actions')}</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              <TableState
                colSpan={COLUMNS}
                isLoading={isPending}
                error={error}
                isEmpty={users.length === 0}
                emptyText={t('users.notFound')}
                onRetry={refetch}
              />

              {users.map((user, index) => {
                const fullName = getFullName(user)

                return (
                  <Table.Tr key={user.id}>
                    <Table.Td>
                      <Text size="sm" c="dimmed">
                        {(meta?.from ?? 1) + index}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" fw={600}>
                        {fullName}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c="dimmed" className="tabular">
                        {user.phone}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{t(USER_ROLE_KEY[user.role])}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge tone={USER_STATUS_TONE[user.status]}>
                        {t(USER_STATUS_KEY[user.status])}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c="dimmed" className="tabular">
                        {formatDateTime(user.created_at)}
                      </Text>
                    </Table.Td>
                    <Table.Td ta="right">
                      <RowActions
                        onEdit={() => openEdit(user)}
                        onDelete={() =>
                          confirmDelete({
                            name: fullName,
                            onConfirm: () => remove.mutate(user.id),
                          })
                        }
                      />
                    </Table.Td>
                  </Table.Tr>
                )
              })}
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
    </Stack>
  )
}
