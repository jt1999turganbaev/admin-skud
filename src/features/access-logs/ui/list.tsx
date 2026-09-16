import { useState } from 'react'
import {
  ActionIcon,
  Group,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'
import { IconEye, IconSearch } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

import { useFetchAccessEvents } from '@/features/access-logs/queries/access-logs-queries'
import {
  ACCESS_RESULT_KEY,
  ACCESS_RESULT_TONE,
  ACCESS_RESULTS,
  getEventName,
} from '@/features/access-logs/types'
import { useFetchRoomsList } from '@/features/rooms/queries/rooms-queries'
import { getRoomLabel } from '@/features/rooms/types'
import { useFetchTerminalsList } from '@/features/terminals/queries/terminals-queries'
import {
  DIRECTION_KEY,
  DIRECTION_TONE,
  DIRECTIONS,
} from '@/features/terminals/types'
import { useDebounce, useFilterParams } from '@/shared/hooks'
import type { FilterParams } from '@/shared/types/filterParams'
import { Badge, Panel, SortableTh, TableFooter, TableState } from '@/shared/ui'
import {
  formatDateTime,
  parseApiDate,
  toApiDateTime,
} from '@/shared/utils/format-date'

import { EventDetailsModal } from './event-details-modal'

const COLUMNS = 8

export const AccessLogsList = () => {
  const { params, setFilter, setPage, setPerPage, toggleSort } =
    useFilterParams<FilterParams>({
      // Jurnal eng yangi hodisadan boshlanadi.
      order_by: 'captured_at',
      sort: 'desc',
    })
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)
  const [openedId, setOpenedId] = useState<number | null>(null)

  const { data, isPending, error, refetch } = useFetchAccessEvents({
    ...params,
    search: debouncedSearch || null,
  })

  const { data: roomsData } = useFetchRoomsList()
  const { data: terminalsData } = useFetchTerminalsList()

  const events = data?.data ?? []
  const meta = data?.meta

  return (
    <Stack gap={32}>
      {/* Sarlavha, filtrlar va jadval — bitta panel */}
      <Panel gap={20}>
        <Group justify="space-between" align="flex-start" gap="md" wrap="wrap">
          <Title order={4} fz="md" lh="36px">
            {t('logs.title')}
          </Title>

          <Group gap="sm" wrap="wrap" justify="flex-end" style={{ flex: 1 }}>
            <TextInput
              w={260}
              placeholder={t('logs.searchPlaceholder')}
              leftSection={<IconSearch size={17} />}
              value={search}
              onChange={(event) => setSearch(event.currentTarget.value)}
              size="sm"
            />

            <Select
              size="sm"
              w={190}
              placeholder={t('common.filterAll', { field: t('logs.room') })}
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
              placeholder={t('common.filterAll', { field: t('logs.terminal') })}
              data={(terminalsData?.data ?? []).map((terminal) => ({
                value: String(terminal.id),
                label: terminal.name,
              }))}
              value={params.terminal_id ? String(params.terminal_id) : null}
              onChange={(value) => setFilter('terminal_id', value)}
              searchable
              clearable
            />

            <Select
              size="sm"
              w={170}
              placeholder={t('common.filterAll', { field: t('logs.result') })}
              data={ACCESS_RESULTS.map((value) => ({
                value,
                label: t(ACCESS_RESULT_KEY[value]),
              }))}
              value={
                params.granted === null || params.granted === undefined
                  ? null
                  : params.granted
                    ? 'granted'
                    : 'denied'
              }
              onChange={(value) =>
                setFilter(
                  'granted',
                  value === null ? null : value === 'granted',
                )
              }
              clearable
            />

            <Select
              size="sm"
              w={170}
              placeholder={t('common.filterAll', {
                field: t('terminals.direction'),
              })}
              data={DIRECTIONS.map((value) => ({
                value,
                label: t(DIRECTION_KEY[value]),
              }))}
              value={params.direction ?? null}
              onChange={(value) => setFilter('direction', value)}
              clearable
            />

            {/* Vaqt oralig'i — backend `from` va `to` ni kutadi */}
            <DateTimePicker
              size="sm"
              w={200}
              placeholder={t('logs.from')}
              valueFormat="DD.MM.YYYY HH:mm"
              clearable
              value={parseApiDate(params.from)}
              onChange={(value) =>
                setFilter('from', toApiDateTime(value) || null)
              }
            />

            <DateTimePicker
              size="sm"
              w={200}
              placeholder={t('logs.to')}
              valueFormat="DD.MM.YYYY HH:mm"
              clearable
              minDate={parseApiDate(params.from) ?? undefined}
              value={parseApiDate(params.to)}
              onChange={(value) =>
                setFilter('to', toApiDateTime(value) || null)
              }
            />
          </Group>
        </Group>

        <Table.ScrollContainer minWidth={1220} className="scroll">
          <Table stickyHeader highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>№</Table.Th>
                <SortableTh
                  field="captured_at"
                  params={params}
                  onSort={toggleSort}
                >
                  {t('logs.capturedAt')}
                </SortableTh>
                <Table.Th>{t('logs.person')}</Table.Th>
                <Table.Th>{t('logs.room')}</Table.Th>
                <Table.Th>{t('logs.terminal')}</Table.Th>
                <Table.Th>{t('terminals.direction')}</Table.Th>
                <Table.Th>{t('logs.result')}</Table.Th>
                <Table.Th ta="right">{t('common.actions')}</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              <TableState
                colSpan={COLUMNS}
                isLoading={isPending}
                error={error}
                isEmpty={events.length === 0}
                emptyText={t('logs.notFound')}
                onRetry={refetch}
              />

              {events.map((event, index) => {
                const result = event.granted ? 'granted' : 'denied'
                const name = getEventName(event)

                return (
                  <Table.Tr key={event.id}>
                    <Table.Td>
                      <Text size="sm" c="dimmed">
                        {(meta?.from ?? 1) + index}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" className="tabular">
                        {formatDateTime(event.captured_at)}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" fw={600}>
                        {name ?? t('logs.unknownPerson')}
                      </Text>
                      {event.user && (
                        <Text size="xs" c="dimmed" className="tabular">
                          {event.user.phone}
                        </Text>
                      )}
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">
                        {event.terminal
                          ? getRoomLabel(event.terminal.room)
                          : '—'}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{event.terminal?.name ?? '—'}</Text>
                    </Table.Td>
                    <Table.Td>
                      {event.terminal ? (
                        <Badge tone={DIRECTION_TONE[event.terminal.direction]}>
                          {t(DIRECTION_KEY[event.terminal.direction])}
                        </Badge>
                      ) : (
                        <Text size="sm">—</Text>
                      )}
                    </Table.Td>
                    <Table.Td>
                      <Badge tone={ACCESS_RESULT_TONE[result]}>
                        {t(ACCESS_RESULT_KEY[result])}
                      </Badge>
                    </Table.Td>
                    <Table.Td ta="right">
                      <Tooltip label={t('logs.details')} withArrow>
                        <ActionIcon
                          variant="subtle"
                          color="brand"
                          size="lg"
                          aria-label={t('logs.details')}
                          onClick={() => setOpenedId(event.id)}
                        >
                          <IconEye size={20} />
                        </ActionIcon>
                      </Tooltip>
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

      <EventDetailsModal eventId={openedId} onClose={() => setOpenedId(null)} />
    </Stack>
  )
}
