import { useState, type ReactNode } from 'react'
import {
  Alert,
  Button,
  Center,
  Group,
  Loader,
  SimpleGrid,
  Stack,
  Title,
} from '@mantine/core'
import {
  IconArrowLeft,
  IconDeviceDesktop,
  IconPencil,
  IconTrash,
} from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import { getRoomLabel } from '@/features/rooms/types'
import {
  useDeleteTerminal,
  useFetchTerminal,
} from '@/features/terminals/queries/terminals-queries'
import {
  DEVICE_STATUS_KEY,
  DEVICE_STATUS_TONE,
  DIRECTION_KEY,
  DIRECTION_TONE,
} from '@/features/terminals/types'
import { ROUTES } from '@/shared/constants/routes'
import { useDeleteConfirm } from '@/shared/hooks'
import { Badge, Panel } from '@/shared/ui'
import { getErrorMessage } from '@/shared/utils/error-message'
import { formatDateTime } from '@/shared/utils/format-date'

import styles from './details.module.css'
import { TerminalFormModal } from './terminal-form-modal'

interface RowProps {
  label: string
  children: ReactNode
}

const Row = ({ label, children }: RowProps) => (
  <div className={styles.row}>
    <span className={styles.label}>{label}</span>
    <span className={styles.value}>{children}</span>
  </div>
)

/** Bo'sh qiymat o'rniga chiziqcha. */
const orDash = (value: ReactNode) =>
  value === null || value === undefined || value === '' ? '—' : value

export const TerminalDetails = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams()
  const terminalId = Number(id)

  const { data, isPending, error } = useFetchTerminal(terminalId)
  const remove = useDeleteTerminal()
  const confirmDelete = useDeleteConfirm()
  const [editOpened, setEditOpened] = useState(false)

  const backButton = (
    <Button
      variant="default"
      leftSection={<IconArrowLeft size={18} />}
      onClick={() => navigate(ROUTES.TERMINALS)}
    >
      {t('terminals.back')}
    </Button>
  )

  // Manzildagi id son bo'lmasa so'rov ketmaydi — cheksiz yuklanishda qolmasin.
  if (!Number.isFinite(terminalId)) {
    return (
      <Stack align="flex-start">
        {backButton}
        <Alert color="error" radius="md" w="100%">
          {t('common.notFound')}
        </Alert>
      </Stack>
    )
  }

  if (isPending) {
    return (
      <Center py={80}>
        <Loader />
      </Center>
    )
  }

  if (error || !data) {
    return (
      <Stack align="flex-start">
        {backButton}
        <Alert color="error" radius="md" w="100%">
          {getErrorMessage(error)}
        </Alert>
      </Stack>
    )
  }

  const terminal = data.data

  const handleDelete = () =>
    confirmDelete({
      name: terminal.name,
      onConfirm: () =>
        remove.mutate(terminal.id, {
          onSuccess: () => navigate(ROUTES.TERMINALS, { replace: true }),
        }),
    })

  return (
    <Stack gap={24}>
      <Panel gap={20}>
        <Group justify="space-between" align="center" gap="md" wrap="wrap">
          <Group gap={14} wrap="nowrap">
            <span className={styles.icon}>
              <IconDeviceDesktop size={22} stroke={1.8} />
            </span>
            <div>
              <Title order={4} fz={19}>
                {terminal.name}
              </Title>
              <span className={styles.meta}>
                {t('terminals.title')} · #{terminal.id}
              </span>
            </div>
          </Group>

          <Group gap="sm">
            {backButton}
            <Button
              variant="light"
              color="warning"
              leftSection={<IconPencil size={18} />}
              onClick={() => setEditOpened(true)}
            >
              {t('common.edit')}
            </Button>
            <Button
              variant="light"
              color="error"
              leftSection={<IconTrash size={18} />}
              loading={remove.isPending}
              onClick={handleDelete}
            >
              {t('common.delete')}
            </Button>
          </Group>
        </Group>
      </Panel>

      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing={24}>
        <Panel gap={0}>
          <div className={styles.sectionTitle}>{t('terminals.general')}</div>

          <Row label={t('terminals.name')}>{terminal.name}</Row>
          <Row label={t('terminals.room')}>
            {terminal.room ? getRoomLabel(terminal.room) : '—'}
          </Row>
          <Row label={t('terminals.direction')}>
            <Badge tone={DIRECTION_TONE[terminal.direction]}>
              {t(DIRECTION_KEY[terminal.direction])}
            </Badge>
          </Row>
          <Row label={t('terminals.deviceId')}>
            <span className={styles.mono}>{terminal.device_identifier}</span>
          </Row>
          <Row label={t('common.status')}>
            <Badge tone={DEVICE_STATUS_TONE[terminal.status]}>
              {t(DEVICE_STATUS_KEY[terminal.status])}
            </Badge>
          </Row>
          <Row label={t('terminals.tabletsCount')}>
            {orDash(terminal.tablets_count)}
          </Row>
          <Row label={t('common.lastSeen')}>
            <span className="tabular">
              {formatDateTime(terminal.last_seen_at)}
            </span>
          </Row>
          <Row label={t('common.createdAt')}>
            <span className="tabular">
              {formatDateTime(terminal.created_at)}
            </span>
          </Row>
          <Row label={t('common.updatedAt')}>
            <span className="tabular">
              {formatDateTime(terminal.updated_at)}
            </span>
          </Row>
        </Panel>

        <Panel gap={0}>
          <div className={styles.sectionTitle}>{t('terminals.connection')}</div>

          <Row label={t('terminals.configuration')}>
            <Badge tone={terminal.is_configured ? 'ok' : 'warn'}>
              {terminal.is_configured
                ? t('terminals.configured')
                : t('terminals.notConfigured')}
            </Badge>
          </Row>
          <Row label={t('terminals.ipAddress')}>
            <span className={styles.mono}>{orDash(terminal.ip_address)}</span>
          </Row>
          <Row label={t('terminals.port')}>
            <span className={styles.mono}>{orDash(terminal.port)}</span>
          </Row>
          <Row label={t('terminals.login')}>{orDash(terminal.login)}</Row>
          {/* Parolning o'zi hech qachon qaytmaydi — faqat bor-yo'qligi. */}
          <Row label={t('terminals.password')}>
            <Badge tone={terminal.has_password ? 'ok' : 'neutral'}>
              {terminal.has_password
                ? t('terminals.passwordSet')
                : t('terminals.passwordNotSet')}
            </Badge>
          </Row>
          <Row label={t('terminals.manufacturer')}>
            {orDash(terminal.manufacturer)}
          </Row>

          {!terminal.is_configured && (
            <Alert color="warning" radius="md" mt="md">
              {t('terminals.connectionHint')}
            </Alert>
          )}
        </Panel>
      </SimpleGrid>

      <TerminalFormModal
        opened={editOpened}
        onClose={() => setEditOpened(false)}
        terminal={terminal}
      />
    </Stack>
  )
}
