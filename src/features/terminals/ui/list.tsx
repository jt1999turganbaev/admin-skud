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
import { IconPlus, IconSearch } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useFetchRoomsList } from '@/features/rooms/queries/rooms-queries'
import { getRoomLabel } from '@/features/rooms/types'
import {
  useDeleteTerminal,
  useFetchTerminals,
} from '@/features/terminals/queries/terminals-queries'
import {
  DEVICE_STATUS_KEY,
  DEVICE_STATUSES,
  DEVICE_STATUS_TONE,
  DIRECTION_KEY,
  DIRECTION_TONE,
  type Terminal,
} from '@/features/terminals/types'
import { ROUTES, buildRoute } from '@/shared/constants/routes'
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

import { TerminalFormModal } from './terminal-form-modal'

const COLUMNS = 9

export const TerminalsList = () => {
  const { params, setFilter, setPage, setPerPage, toggleSort } =
    useFilterParams()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)

  const [editing, setEditing] = useState<Terminal | null>(null)
  const [modalOpened, setModalOpened] = useState(false)

  const { data, isPending, error, refetch } = useFetchTerminals({
    ...params,
    search: debouncedSearch || null,
  })
  const remove = useDeleteTerminal()
  const confirmDelete = useDeleteConfirm()
  const { data: roomsData } = useFetchRoomsList()

  const terminals = data?.data ?? []
  const meta = data?.meta

  const openCreate = () => {
    setEditing(null)
    setModalOpened(true)
  }

  const openView = (terminal: Terminal) =>
    navigate(buildRoute(ROUTES.TERMINALS_SHOW, { id: terminal.id }))

  const openEdit = (terminal: Terminal) => {
    setEditing(terminal)
    setModalOpened(true)
  }

  return (
    <Stack gap={32}>
      {/* Sarlavha, filtrlar va jadval — bitta panel */}
      <Panel gap={20}>
        {/* Sarlavha chapda, qidiruv va filtrlar o'ngda; tor ekranda
            guruh pastga tushadi (wrap). */}
        <Group justify="space-between" align="flex-start" gap="md" wrap="wrap">
          <Title order={4} fz="md" lh="36px">
            {t('terminals.title')}
          </Title>
          <Group gap="sm" wrap="wrap">
            <TextInput
              w={300}
              placeholder={t('terminals.searchPlaceholder')}
              leftSection={<IconSearch size={17} />}
              value={search}
              onChange={(event) => setSearch(event.currentTarget.value)}
              size="sm"
            />

            <Select
              size="sm"
              w={220}
              placeholder={t('common.filterAll', {
                field: t('terminals.room'),
              })}
              data={(roomsData?.data ?? []).map((room) => ({
                value: String(room.id),
                label: getRoomLabel(room),
              }))}
              value={params.room_id ? String(params.room_id) : null}
              onChange={(value) => setFilter('room_id', value)}
              clearable
              searchable
            />

            <Select
              size="sm"
              w={170}
              placeholder={t('common.filterAll', {
                field: t('common.status'),
              })}
              data={DEVICE_STATUSES.map((value) => ({
                value,
                label: t(DEVICE_STATUS_KEY[value]),
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
              {t('terminals.add')}
            </Button>
          </Group>
        </Group>

        <Table.ScrollContainer minWidth={1100} className="scroll">
          <Table stickyHeader highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>№</Table.Th>
                <SortableTh field="name" params={params} onSort={toggleSort}>
                  {t('terminals.name')}
                </SortableTh>
                <Table.Th>{t('terminals.room')}</Table.Th>
                <SortableTh
                  field="direction"
                  params={params}
                  onSort={toggleSort}
                >
                  {t('terminals.direction')}
                </SortableTh>
                <SortableTh
                  field="device_identifier"
                  params={params}
                  onSort={toggleSort}
                >
                  {t('terminals.deviceId')}
                </SortableTh>
                <Table.Th>{t('terminals.tabletsCount')}</Table.Th>
                <SortableTh field="status" params={params} onSort={toggleSort}>
                  {t('common.status')}
                </SortableTh>
                <SortableTh
                  field="last_seen_at"
                  params={params}
                  onSort={toggleSort}
                >
                  {t('common.lastSeen')}
                </SortableTh>
                <Table.Th ta="right">{t('common.actions')}</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              <TableState
                colSpan={COLUMNS}
                isLoading={isPending}
                error={error}
                isEmpty={terminals.length === 0}
                emptyText={t('terminals.notFound')}
                onRetry={refetch}
              />

              {terminals.map((terminal, index) => (
                <Table.Tr
                  key={terminal.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => openView(terminal)}
                >
                  <Table.Td>
                    <Text size="sm" c="dimmed">
                      {(meta?.from ?? 1) + index}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" fw={600}>
                      {terminal.name}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">
                      {terminal.room ? getRoomLabel(terminal.room) : '—'}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge tone={DIRECTION_TONE[terminal.direction]}>
                      {t(DIRECTION_KEY[terminal.direction])}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed" className="tabular">
                      {terminal.device_identifier}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" fw={700}>
                      {terminal.tablets_count ?? '—'}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge tone={DEVICE_STATUS_TONE[terminal.status]}>
                      {t(DEVICE_STATUS_KEY[terminal.status])}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed" className="tabular">
                      {formatDateTime(terminal.last_seen_at)}
                    </Text>
                  </Table.Td>
                  <Table.Td ta="right">
                    <RowActions
                      onView={() => openView(terminal)}
                      onEdit={() => openEdit(terminal)}
                      onDelete={() =>
                        confirmDelete({
                          name: terminal.name,
                          onConfirm: () => remove.mutate(terminal.id),
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

      <TerminalFormModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        terminal={editing}
      />
    </Stack>
  )
}
