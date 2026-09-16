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
  useDeleteTablet,
  useFetchTablets,
} from '@/features/tablets/queries/tablets-queries'
import {
  DEVICE_STATUS_KEY,
  DEVICE_STATUSES,
  DEVICE_STATUS_TONE,
  type Tablet,
} from '@/features/tablets/types'
import { useFetchTerminalsList } from '@/features/terminals/queries/terminals-queries'
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

import { TabletFormModal } from './tablet-form-modal'

const COLUMNS = 6

export const TabletsList = () => {
  const { params, setFilter, setPage, setPerPage, toggleSort } =
    useFilterParams()
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)

  const [editing, setEditing] = useState<Tablet | null>(null)
  const [modalOpened, setModalOpened] = useState(false)

  const { data, isPending, error, refetch } = useFetchTablets({
    ...params,
    search: debouncedSearch || null,
  })
  const remove = useDeleteTablet()
  const confirmDelete = useDeleteConfirm()
  const { data: terminalsData } = useFetchTerminalsList()

  const tablets = data?.data ?? []
  const meta = data?.meta

  const openCreate = () => {
    setEditing(null)
    setModalOpened(true)
  }

  const openEdit = (tablet: Tablet) => {
    setEditing(tablet)
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
            {t('tablets.title')}
          </Title>
          <Group gap="sm" wrap="wrap">
            <TextInput
              w={300}
              placeholder={t('tablets.searchPlaceholder')}
              leftSection={<IconSearch size={17} />}
              value={search}
              onChange={(event) => setSearch(event.currentTarget.value)}
              size="sm"
            />

            <Select
              size="sm"
              w={220}
              placeholder={t('common.filterAll', {
                field: t('tablets.terminal'),
              })}
              data={(terminalsData?.data ?? []).map((terminal) => ({
                value: String(terminal.id),
                label: terminal.name,
              }))}
              value={params.terminal_id ? String(params.terminal_id) : null}
              onChange={(value) => setFilter('terminal_id', value)}
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
              {t('tablets.add')}
            </Button>
          </Group>
        </Group>

        <Table.ScrollContainer minWidth={880} className="scroll">
          <Table stickyHeader highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>№</Table.Th>
                <SortableTh
                  field="device_identifier"
                  params={params}
                  onSort={toggleSort}
                >
                  {t('tablets.deviceId')}
                </SortableTh>
                <Table.Th>{t('tablets.terminal')}</Table.Th>
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
                isEmpty={tablets.length === 0}
                emptyText={t('tablets.notFound')}
                onRetry={refetch}
              />

              {tablets.map((tablet, index) => (
                <Table.Tr key={tablet.id}>
                  <Table.Td>
                    <Text size="sm" c="dimmed">
                      {(meta?.from ?? 1) + index}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" fw={600} className="tabular">
                      {tablet.device_identifier}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{tablet.terminal?.name ?? '—'}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge tone={DEVICE_STATUS_TONE[tablet.status]}>
                      {t(DEVICE_STATUS_KEY[tablet.status])}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed" className="tabular">
                      {formatDateTime(tablet.last_seen_at)}
                    </Text>
                  </Table.Td>
                  <Table.Td ta="right">
                    <RowActions
                      onEdit={() => openEdit(tablet)}
                      onDelete={() =>
                        confirmDelete({
                          name: tablet.device_identifier,
                          onConfirm: () => remove.mutate(tablet.id),
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

      <TabletFormModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        tablet={editing}
      />
    </Stack>
  )
}
