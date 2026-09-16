import { Alert, Center, Loader, Modal } from '@mantine/core'
import { IconClipboardList } from '@tabler/icons-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { useFetchAssignment } from '@/features/assignments/queries/assignments-queries'
import {
  ASSIGNMENT_STATUS_KEY,
  ASSIGNMENT_STATUS_TONE,
} from '@/features/assignments/types'
import { getRoomLabel } from '@/features/rooms/types'
import { getFullName } from '@/features/users/types'
import { Badge } from '@/shared/ui'
import { getErrorMessage } from '@/shared/utils/error-message'
import { formatDateTime } from '@/shared/utils/format-date'

import styles from './assignment-details-modal.module.css'

interface AssignmentDetailsModalProps {
  /** Ochilgan biriktirish id'si; `null` — oyna yopiq. */
  assignmentId: number | null
  onClose: () => void
}

const Row = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className={styles.row}>
    <span className={styles.label}>{label}</span>
    <span className={styles.value}>{children}</span>
  </div>
)

export const AssignmentDetailsModal = ({
  assignmentId,
  onClose,
}: AssignmentDetailsModalProps) => {
  const { t } = useTranslation()
  // `useFetchOne` `Number.isFinite` bo'lgandagina so'rov yuboradi.
  const { data, isPending, error } = useFetchAssignment(assignmentId ?? NaN)

  const assignment = data?.data

  return (
    <Modal
      opened={assignmentId !== null}
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
            <IconClipboardList size={22} stroke={1.8} />
          </span>
          <span>
            <span className={styles.headingText}>
              {t('assignments.details')}
            </span>
            <span className={styles.headingMeta}>
              {t('assignments.title')}
              {assignment ? ` · #${assignment.id}` : ''}
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

      {!isPending && assignment && (
        <>
          <div>
            <Row label={t('assignments.user')}>
              {getFullName(assignment.user)}
            </Row>
            <Row label={t('users.phone')}>
              <span className="tabular">{assignment.user?.phone ?? '—'}</span>
            </Row>
            <Row label={t('assignments.room')}>
              {getRoomLabel(assignment.room)}
            </Row>
            <Row label={t('assignments.startsAt')}>
              <span className="tabular">
                {formatDateTime(assignment.starts_at)}
              </span>
            </Row>
            <Row label={t('assignments.endsAt')}>
              <span className="tabular">
                {formatDateTime(assignment.ends_at)}
              </span>
            </Row>
            <Row label={t('common.status')}>
              <Badge tone={ASSIGNMENT_STATUS_TONE[assignment.status]}>
                {t(ASSIGNMENT_STATUS_KEY[assignment.status])}
              </Badge>
            </Row>
            <Row label={t('common.createdAt')}>
              <span className="tabular">
                {formatDateTime(assignment.created_at)}
              </span>
            </Row>
          </div>

          <div className={styles.sectionTitle}>{t('assignments.task')}</div>

          <div>
            <Row label={t('assignments.taskName')}>
              {assignment.task?.name ?? '—'}
            </Row>
            <Row label={t('assignments.taskDescription')}>
              {assignment.task?.description ?? '—'}
            </Row>
          </div>
        </>
      )}
    </Modal>
  )
}
