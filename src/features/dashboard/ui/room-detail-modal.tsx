import { Alert, Center, Loader, Modal, Table, Text } from '@mantine/core'
import { IconDoor } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

import { useFetchDashboardRoom } from '@/features/dashboard/queries/dashboard-queries'
import { getRoomLabel } from '@/features/rooms/types'
import { Badge } from '@/shared/ui'
import { getErrorMessage } from '@/shared/utils/error-message'
import { formatDateTime } from '@/shared/utils/format-date'

import styles from './room-detail-modal.module.css'

interface RoomDetailModalProps {
  /** Ochilgan xona id'si; `null` — oyna yopiq. */
  roomId: number | null
  onClose: () => void
}

/**
 * Bitta xona: kutilayotgan har bir odam va u kirganmi.
 * Kelmaganlar backend tomonidan ro'yxat boshiga chiqariladi.
 */
export const RoomDetailModal = ({ roomId, onClose }: RoomDetailModalProps) => {
  const { t } = useTranslation()
  const { data, isPending, error } = useFetchDashboardRoom(roomId)

  const detail = data?.data
  // Ro'yxat bo'sh kelsa ham (`null`) jadval chizilaveradi.
  const participants = detail?.participants ?? []

  return (
    <Modal
      opened={roomId !== null}
      onClose={onClose}
      size="xl"
      title={
        <span className={styles.heading}>
          <span className={styles.headingIcon}>
            <IconDoor size={22} stroke={1.8} />
          </span>
          <span>
            <span className={styles.headingText}>
              {detail ? getRoomLabel(detail.room) : t('dashboard.roomsStatus')}
            </span>
            <span className={styles.headingMeta}>
              {detail
                ? t('dashboard.roomCounters', {
                    expected: detail.expected,
                    entered: detail.entered,
                    missing: detail.missing,
                  })
                : ''}
            </span>
          </span>
        </span>
      }
    >
      {isPending && (
        <Center py={40}>
          <Loader />
        </Center>
      )}

      {!isPending && error && (
        <Alert color="error" radius="md">
          {getErrorMessage(error)}
        </Alert>
      )}

      {!isPending && detail && (
        <Table.ScrollContainer minWidth={680} className="scroll">
          <Table highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>{t('users.fullName')}</Table.Th>
                <Table.Th>{t('assignments.task')}</Table.Th>
                <Table.Th>{t('assignments.startsAt')}</Table.Th>
                <Table.Th>{t('dashboard.entered')}</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {participants.length === 0 && (
                <Table.Tr>
                  <Table.Td colSpan={4} ta="center" py={24}>
                    <Text size="sm" c="dimmed">
                      {t('dashboard.noParticipants')}
                    </Text>
                  </Table.Td>
                </Table.Tr>
              )}

              {participants.map((item) => (
                <Table.Tr key={item.assignment_id}>
                  <Table.Td>
                    <Text size="sm" fw={600}>
                      {item.user?.full_name ?? '—'}
                    </Text>
                    <Text size="xs" c="dimmed" className="tabular">
                      {item.user?.phone ?? '—'}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{item.task?.name ?? '—'}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" className={styles.nowrap}>
                      {formatDateTime(item.starts_at)}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    {/* Belgi va vaqt ustma-ust — tor ustunda belgi
                        qisqartirilib "K…" bo'lib qolmasin */}
                    <div className={styles.entered}>
                      {item.entered ? (
                        <>
                          <Badge tone="ok">{t('dashboard.entered')}</Badge>
                          <Text size="xs" c="dimmed" className={styles.nowrap}>
                            {formatDateTime(item.entered_at)}
                          </Text>
                        </>
                      ) : (
                        <Badge tone="warn">{t('dashboard.notEntered')}</Badge>
                      )}
                    </div>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      )}
    </Modal>
  )
}
