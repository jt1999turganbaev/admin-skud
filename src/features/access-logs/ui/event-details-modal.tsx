import { Alert, Center, Loader, Modal } from '@mantine/core'
import { IconFileText, IconPhoto } from '@tabler/icons-react'
import { useEffect, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { useFetchAccessEvent } from '@/features/access-logs/queries/access-logs-queries'
import {
  ACCESS_RESULT_KEY,
  ACCESS_RESULT_TONE,
  getEventName,
} from '@/features/access-logs/types'
import { getRoomLabel } from '@/features/rooms/types'
import { DIRECTION_KEY, DIRECTION_TONE } from '@/features/terminals/types'
import { Badge } from '@/shared/ui'
import { getErrorMessage } from '@/shared/utils/error-message'
import { formatDateTime } from '@/shared/utils/format-date'
import { resolvePhotoSrc } from '@/shared/utils/photo'

import styles from './event-details-modal.module.css'

interface EventDetailsModalProps {
  /** Ochilgan hodisa id'si; `null` — oyna yopiq. */
  eventId: number | null
  onClose: () => void
}

interface RowProps {
  label: string
  children: ReactNode
  /** Yig'ma kartada qiymatlar o'ngga tekislanadi. */
  align?: 'left' | 'right'
}

const Row = ({ label, children, align = 'left' }: RowProps) => (
  <div className={styles.row} data-align={align}>
    <span className={styles.label}>{label}</span>
    <span className={styles.value}>{children}</span>
  </div>
)

export const EventDetailsModal = ({
  eventId,
  onClose,
}: EventDetailsModalProps) => {
  const { t } = useTranslation()
  const { data, isPending, error } = useFetchAccessEvent(eventId)

  const event = data?.data
  const result = event?.granted ? 'granted' : 'denied'

  /**
   * Avval foydalanuvchining profil rasmi (`data.user.photo`) ko'rsatiladi —
   * `face_image` ko'pincha `null` bo'lib keladi.
   */
  const photo = resolvePhotoSrc(event?.user?.photo ?? event?.face_image)
  const photoLabel = event?.user?.photo ? t('users.photo') : t('logs.faceImage')

  // Rasm buzuq bo'lsa (masalan, base64 chala saqlangan) — o'rniga izoh
  const [isBroken, setIsBroken] = useState(false)
  useEffect(() => setIsBroken(false), [photo])

  return (
    <Modal
      opened={eventId !== null}
      onClose={onClose}
      size="xl"
      classNames={{
        header: styles.header,
        title: styles.headerTitle,
        body: styles.body,
      }}
      closeButtonProps={{ className: styles.close }}
      title={
        <span className={styles.heading}>
          <span className={styles.headingIcon}>
            <IconFileText size={22} stroke={1.8} />
          </span>
          <span>
            <span className={styles.headingText}>{t('logs.details')}</span>
            <span className={styles.headingMeta}>
              {t('logs.title')}
              {event ? ` · #${event.id}` : ''}
            </span>
          </span>
        </span>
      }
    >
      {isPending && (
        <Center py={60}>
          <Loader />
        </Center>
      )}

      {!isPending && error && (
        <Alert color="error" radius="md">
          {getErrorMessage(error)}
        </Alert>
      )}

      {!isPending && event && (
        <>
          <div className={styles.top}>
            {/* Foydalanuvchi rasmi; bo'lmasa — qurilma olgan surat */}
            <div className={styles.photoBlock}>
              {photo && !isBroken ? (
                <img
                  src={photo}
                  alt={getEventName(event) ?? ''}
                  className={styles.photo}
                  onError={() => setIsBroken(true)}
                />
              ) : (
                <div className={styles.photoEmpty}>
                  <IconPhoto size={28} stroke={1.6} />
                  <span>{t('logs.noFaceImage')}</span>
                </div>
              )}

              <span className={styles.photoCaption}>{photoLabel}</span>
            </div>

            <div className={styles.summary}>
              <Row label={t('logs.result')} align="right">
                <Badge tone={ACCESS_RESULT_TONE[result]}>
                  {t(ACCESS_RESULT_KEY[result])}
                </Badge>
              </Row>
              <Row label={t('logs.capturedAt')} align="right">
                <span className="tabular">
                  {formatDateTime(event.captured_at)}
                </span>
              </Row>
              <Row label={t('logs.person')} align="right">
                {getEventName(event) ?? t('logs.unknownPerson')}
              </Row>
              <Row label={t('users.phone')} align="right">
                <span className="tabular">{event.user?.phone ?? '—'}</span>
              </Row>
            </div>
          </div>

          <div className={styles.sectionTitle}>{t('logs.moreInfo')}</div>

          <div>
            <Row label={t('logs.terminal')}>{event.terminal?.name ?? '—'}</Row>
            <Row label={t('terminals.direction')}>
              {event.terminal ? (
                <Badge tone={DIRECTION_TONE[event.terminal.direction]}>
                  {t(DIRECTION_KEY[event.terminal.direction])}
                </Badge>
              ) : (
                '—'
              )}
            </Row>
            <Row label={t('logs.room')}>
              {event.terminal ? getRoomLabel(event.terminal.room) : '—'}
            </Row>
            <Row label={t('logs.terminalIp')}>
              <span className={styles.mono}>
                {event.terminal_ip ?? event.terminal?.ip_address ?? '—'}
              </span>
            </Row>
            <Row label={t('logs.task')}>
              {event.assignment?.task?.name ?? '—'}
            </Row>
            {event.assignment && (
              <Row label={t('logs.assignmentPeriod')}>
                <span className="tabular">
                  {formatDateTime(event.assignment.starts_at)} —{' '}
                  {formatDateTime(event.assignment.ends_at)}
                </span>
              </Row>
            )}
            <Row label={t('logs.visitorUlid')}>
              <span className={styles.mono}>{event.visitor_ulid}</span>
            </Row>
            <Row label={t('common.createdAt')}>
              <span className="tabular">
                {formatDateTime(event.created_at)}
              </span>
            </Row>
          </div>
        </>
      )}
    </Modal>
  )
}
