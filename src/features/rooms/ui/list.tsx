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

import {
  useDeleteRoom,
  useFetchRooms,
} from '@/features/rooms/queries/rooms-queries'
import {
  getRoomLabel,
  ROOM_STATUS_KEY,
  ROOM_STATUSES,
  ROOM_STATUS_TONE,
  type Room,
} from '@/features/rooms/types'
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

import { RoomFormModal } from './room-form-modal'

const COLUMNS = 8

export const RoomsList = () => {
  const { params, setFilter, setPage, setPerPage, toggleSort } =
    useFilterParams()
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)

  const [editing, setEditing] = useState<Room | null>(null)
  const [modalOpened, setModalOpened] = useState(false)

  const { data, isPending, error, refetch } = useFetchRooms({
    ...params,
    search: debouncedSearch || null,
  })
  const remove = useDeleteRoom()
  const confirmDelete = useDeleteConfirm()

  const rooms = data?.data ?? []
  const meta = data?.meta

  const openCreate = () => {
    setEditing(null)
    setModalOpened(true)
  }

  const openEdit = (room: Room) => {
    setEditing(room)
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
            {t('rooms.title')}
          </Title>
          <Group gap="sm" wrap="wrap">
            <TextInput
              w={300}
              placeholder={t('rooms.searchPlaceholder')}
              leftSection={<IconSearch size={17} />}
              value={search}
              onChange={(event) => setSearch(event.currentTarget.value)}
              size="sm"
            />

            <Select
              size="sm"
              w={190}
              placeholder={t('common.filterAll', {
                field: t('common.status'),
              })}
              data={ROOM_STATUSES.map((value) => ({
                value,
                label: t(ROOM_STATUS_KEY[value]),
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
              {t('rooms.add')}
            </Button>
          </Group>
        </Group>

        <Table.ScrollContainer minWidth={820} className="scroll">
          <Table stickyHeader highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>№</Table.Th>
                <SortableTh field="number" params={params} onSort={toggleSort}>
                  {t('rooms.number')}
                </SortableTh>
                <Table.Th>{t('rooms.numberStation')}</Table.Th>
                <SortableTh field="name" params={params} onSort={toggleSort}>
                  {t('rooms.name')}
                </SortableTh>
                <Table.Th>{t('rooms.terminalsCount')}</Table.Th>
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
                isEmpty={rooms.length === 0}
                emptyText={t('rooms.notFound')}
                onRetry={refetch}
              />

              {rooms.map((room, index) => (
                <Table.Tr key={room.id}>
                  <Table.Td>
                    <Text size="sm" c="dimmed">
                      {(meta?.from ?? 1) + index}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" fw={600} className="tabular">
                      {room.number}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" className="tabular">
                      {room.number_station ?? '—'}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{room.name}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" fw={700}>
                      {room.terminals_count ?? '—'}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge tone={ROOM_STATUS_TONE[room.status]}>
                      {t(ROOM_STATUS_KEY[room.status])}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed" className="tabular">
                      {formatDateTime(room.created_at)}
                    </Text>
                  </Table.Td>
                  <Table.Td ta="right">
                    <RowActions
                      onEdit={() => openEdit(room)}
                      onDelete={() =>
                        confirmDelete({
                          name: getRoomLabel(room),
                          onConfirm: () => remove.mutate(room.id),
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

      <RoomFormModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        room={editing}
      />
    </Stack>
  )
}
