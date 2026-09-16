import { useState } from 'react'
import {
  Alert,
  Group,
  SimpleGrid,
  Stack,
  Table,
  Text,
  Title,
  Tooltip,
} from '@mantine/core'
import {
  IconAlertTriangle,
  IconCheck,
  IconClipboardList,
  IconDeviceDesktop,
  IconDeviceTablet,
  IconScan,
  IconUserQuestion,
  IconX,
  type Icon,
} from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

import {
  useFetchDashboardRooms,
  useFetchDashboardSummary,
  useFetchDashboardTablets,
  useFetchDashboardTerminals,
} from '@/features/dashboard/queries/dashboard-queries'
import {
  TABLET_HEALTH_KEY,
  TABLET_HEALTH_TONE,
  TERMINAL_HEALTH_KEY,
  TERMINAL_HEALTH_TONE,
} from '@/features/dashboard/types'
import { getRoomLabel } from '@/features/rooms/types'
import { DIRECTION_KEY, DIRECTION_TONE } from '@/features/terminals/types'
import { ROUTES } from '@/shared/constants/routes'
import { Badge, Panel } from '@/shared/ui'
import { getErrorMessage } from '@/shared/utils/error-message'
import { formatDateTime } from '@/shared/utils/format-date'

import { DashboardSkeleton } from './dashboard-skeleton'
import { RoomDetailModal } from './room-detail-modal'
import { StatCard, type StatTone } from './stat-card'

interface StatCardData {
  key: string
  label: string
  Glyph: Icon
  tone: StatTone
  value: number | string
  hint?: string
  to?: string
}

export const Dashboard = () => {
  const { t } = useTranslation()
  const [roomId, setRoomId] = useState<number | null>(null)

  const summaryQuery = useFetchDashboardSummary()
  const roomsQuery = useFetchDashboardRooms()
  const terminalsQuery = useFetchDashboardTerminals()
  const tabletsQuery = useFetchDashboardTablets()

  if (summaryQuery.isPending) return <DashboardSkeleton />

  if (summaryQuery.error || !summaryQuery.data) {
    return (
      <Alert color="error" radius="md">
        {getErrorMessage(summaryQuery.error)}
      </Alert>
    )
  }

  /**
   * Backend bo'limlari (`today`, `terminals`, `tablets`) — eski versiyada
   * yoki qisman deploy'da yetishmasligi mumkin. Bosh sahifa shundan
   * yiqilmasligi uchun hamma o'qish ixtiyoriy zanjir orqali.
   */
  const summary = summaryQuery.data.data
  const today = summary.today
  const rooms = roomsQuery.data?.data ?? []
  const terminals = terminalsQuery.data?.data ?? []
  const tablets = tabletsQuery.data?.data ?? []

  const cards: StatCardData[] = [
    {
      key: 'identifications',
      label: t('dashboard.identifications'),
      Glyph: IconScan,
      tone: 'brand',
      value: today?.identifications ?? 0,
      to: ROUTES.ACCESS_LOGS,
    },
    {
      key: 'granted',
      label: t('logs.granted'),
      Glyph: IconCheck,
      tone: 'green',
      value: today?.granted ?? 0,
      to: ROUTES.ACCESS_LOGS,
    },
    {
      key: 'denied',
      label: t('logs.denied'),
      Glyph: IconX,
      tone: 'red',
      value: today?.denied ?? 0,
      to: ROUTES.ACCESS_LOGS,
    },
    {
      key: 'unknown',
      label: t('dashboard.unknownFaces'),
      Glyph: IconUserQuestion,
      tone: 'orange',
      value: today?.unknown_faces ?? 0,
      to: ROUTES.ACCESS_LOGS,
    },
    {
      key: 'assignments',
      label: t('dashboard.activeAssignments'),
      Glyph: IconClipboardList,
      tone: 'violet',
      value: summary.active_assignments ?? 0,
      to: ROUTES.ASSIGNMENTS,
    },
    {
      key: 'terminals',
      label: t('terminals.title'),
      Glyph: IconDeviceDesktop,
      tone: 'cyan',
      value: `${summary.terminals?.online ?? 0}/${summary.terminals?.total ?? 0}`,
      hint: t('dashboard.onlineHint'),
      to: ROUTES.TERMINALS,
    },
    {
      key: 'tablets',
      label: t('tablets.title'),
      Glyph: IconDeviceTablet,
      tone: 'teal',
      value: `${summary.tablets?.online ?? 0}/${summary.tablets?.total ?? 0}`,
      hint: t('dashboard.onlineHint'),
      to: ROUTES.TABLETS,
    },
  ]

  return (
    <Stack gap={32}>
      <div>
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3, xl: 4 }} spacing="md">
          {cards.map(({ key, ...card }) => (
            <StatCard key={key} {...card} />
          ))}
        </SimpleGrid>

        {/* Ko'rsatkichlar mahalliy kun chegarasi bo'yicha hisoblanadi */}
        <Text size="xs" c="dimmed" mt={10}>
          {t('dashboard.summaryHint', {
            date: summary.date ?? '—',
            timezone: summary.timezone ?? '—',
          })}
        </Text>
      </div>

      <SimpleGrid cols={{ base: 1, xl: 2 }} spacing={32}>
        {/* ---------- xonalar holati ---------- */}
        <Panel gap={16}>
          <Group justify="space-between">
            <Title order={4} fz="md">
              {t('dashboard.roomsStatus')}
            </Title>
            <Text size="xs" c="dimmed">
              {t('dashboard.roomsHint')}
            </Text>
          </Group>

          <Table.ScrollContainer minWidth={700} className="scroll">
            <Table stickyHeader highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>{t('logs.room')}</Table.Th>
                  <Table.Th>{t('dashboard.expected')}</Table.Th>
                  <Table.Th>{t('dashboard.entered')}</Table.Th>
                  <Table.Th>{t('dashboard.missing')}</Table.Th>
                  <Table.Th>{t('terminals.title')}</Table.Th>
                  <Table.Th>{t('tablets.title')}</Table.Th>
                  <Table.Th>{t('dashboard.lastEvent')}</Table.Th>
                </Table.Tr>
              </Table.Thead>

              <Table.Tbody>
                {rooms.length === 0 && (
                  <Table.Tr>
                    <Table.Td colSpan={7} ta="center" py={24}>
                      <Text size="sm" c="dimmed">
                        {t('dashboard.noActiveRooms')}
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                )}

                {rooms.map((row, index) => (
                  <Table.Tr
                    key={row.room?.id ?? index}
                    onClick={() => setRoomId(row.room?.id ?? null)}
                    style={{ cursor: 'pointer' }}
                  >
                    <Table.Td>
                      <Text size="sm" fw={600}>
                        {getRoomLabel(row.room)}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{row.expected ?? 0}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" fw={700} c="var(--success-dark)">
                        {row.entered ?? 0}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      {(row.missing ?? 0) > 0 ? (
                        <Badge tone="warn">{row.missing}</Badge>
                      ) : (
                        <Text size="sm" c="dimmed">
                          0
                        </Text>
                      )}
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" className="tabular">
                        {row.terminals?.online ?? 0}/{row.terminals?.total ?? 0}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" className="tabular">
                        {row.tablets?.online ?? 0}/{row.tablets?.total ?? 0}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c="dimmed" className="tabular">
                        {formatDateTime(row.last_event_at)}
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </Panel>

        {/* ---------- terminallar holati ---------- */}
        <Panel gap={16}>
          <Group justify="space-between">
            <Title order={4} fz="md">
              {t('dashboard.terminalsHealth')}
            </Title>
            <Text size="xs" c="dimmed">
              {t('dashboard.syncHint')}
            </Text>
          </Group>

          <Table.ScrollContainer minWidth={620} className="scroll">
            <Table stickyHeader highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>{t('terminals.name')}</Table.Th>
                  <Table.Th>{t('logs.room')}</Table.Th>
                  <Table.Th>{t('terminals.direction')}</Table.Th>
                  <Table.Th>{t('common.status')}</Table.Th>
                  <Table.Th>{t('dashboard.sync')}</Table.Th>
                  <Table.Th>{t('dashboard.lastCheck')}</Table.Th>
                </Table.Tr>
              </Table.Thead>

              <Table.Tbody>
                {terminals.length === 0 && (
                  <Table.Tr>
                    <Table.Td colSpan={6} ta="center" py={24}>
                      <Text size="sm" c="dimmed">
                        {t('terminals.notFound')}
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                )}

                {terminals.map((terminal) => {
                  const pending =
                    (terminal.pending_provision ?? 0) +
                    (terminal.pending_removal ?? 0)

                  return (
                    <Table.Tr key={terminal.id}>
                      <Table.Td>
                        <Text size="sm" fw={600}>
                          {terminal.name}
                        </Text>
                        <Text size="xs" c="dimmed" className="tabular">
                          {terminal.ip_address ?? '—'}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{getRoomLabel(terminal.room)}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge tone={DIRECTION_TONE[terminal.direction]}>
                          {t(DIRECTION_KEY[terminal.direction])}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Tooltip
                          label={terminal.last_check_error}
                          disabled={!terminal.last_check_error}
                          withArrow
                          multiline
                          w={260}
                        >
                          <span>
                            <Badge tone={TERMINAL_HEALTH_TONE[terminal.health]}>
                              {t(TERMINAL_HEALTH_KEY[terminal.health])}
                            </Badge>
                          </span>
                        </Tooltip>
                      </Table.Td>
                      <Table.Td>
                        {pending > 0 ? (
                          <Tooltip
                            label={t('dashboard.pendingHint', {
                              add: terminal.pending_provision,
                              remove: terminal.pending_removal,
                            })}
                            withArrow
                          >
                            <span>
                              <Badge tone="warn">
                                <IconAlertTriangle
                                  size={12}
                                  style={{ marginRight: 4 }}
                                />
                                {pending}
                              </Badge>
                            </span>
                          </Tooltip>
                        ) : (
                          <Badge tone="ok">{t('dashboard.inSync')}</Badge>
                        )}
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" c="dimmed" className="tabular">
                          {formatDateTime(terminal.last_checked_at)}
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  )
                })}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </Panel>
      </SimpleGrid>

      {/* ---------- planshetlar holati ---------- */}
      <Panel gap={16}>
        <Group justify="space-between">
          <Title order={4} fz="md">
            {t('dashboard.tabletsHealth')}
          </Title>
          <Text size="xs" c="dimmed">
            {t('dashboard.tabletsHint')}
          </Text>
        </Group>

        <Table.ScrollContainer minWidth={900} className="scroll">
          <Table stickyHeader highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>{t('tablets.deviceId')}</Table.Th>
                <Table.Th>{t('logs.room')}</Table.Th>
                <Table.Th>{t('logs.terminal')}</Table.Th>
                <Table.Th>{t('terminals.direction')}</Table.Th>
                <Table.Th>{t('common.status')}</Table.Th>
                <Table.Th>{t('dashboard.connectedRoom')}</Table.Th>
                <Table.Th>{t('common.lastSeen')}</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {tablets.length === 0 && (
                <Table.Tr>
                  <Table.Td colSpan={7} ta="center" py={24}>
                    <Text size="sm" c="dimmed">
                      {t('tablets.notFound')}
                    </Text>
                  </Table.Td>
                </Table.Tr>
              )}

              {tablets.map((tablet) => {
                // Spetsifikatsiyada `string`, amalda mantiqiy qiymat
                const mismatch =
                  Boolean(tablet.room_mismatch) &&
                  tablet.room_mismatch !== 'false'

                return (
                  <Table.Tr key={tablet.id}>
                    <Table.Td>
                      <Text size="sm" fw={600} className="tabular">
                        {tablet.device_identifier}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{getRoomLabel(tablet.room)}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{tablet.terminal?.name ?? '—'}</Text>
                    </Table.Td>
                    <Table.Td>
                      {tablet.terminal ? (
                        <Badge tone={DIRECTION_TONE[tablet.terminal.direction]}>
                          {t(DIRECTION_KEY[tablet.terminal.direction])}
                        </Badge>
                      ) : (
                        <Text size="sm">—</Text>
                      )}
                    </Table.Td>
                    <Table.Td>
                      <Badge tone={TABLET_HEALTH_TONE[tablet.health]}>
                        {t(TABLET_HEALTH_KEY[tablet.health])}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      {mismatch ? (
                        <Tooltip label={t('dashboard.roomMismatch')} withArrow>
                          <span>
                            <Badge tone="warn">
                              <IconAlertTriangle
                                size={12}
                                style={{ marginRight: 4 }}
                              />
                              {tablet.connected_room?.number ?? '—'}
                            </Badge>
                          </span>
                        </Tooltip>
                      ) : (
                        <Text size="sm" c="dimmed">
                          {tablet.connected_room?.number ?? '—'}
                        </Text>
                      )}
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c="dimmed" className="tabular">
                        {formatDateTime(tablet.last_seen_at)}
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                )
              })}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Panel>

      <RoomDetailModal roomId={roomId} onClose={() => setRoomId(null)} />
    </Stack>
  )
}
