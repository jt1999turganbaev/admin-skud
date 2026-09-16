import { Avatar, Group, Skeleton, Stack, Text, Title } from '@mantine/core'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { useAuth } from '@/features/auth/auth-context/auth-context'
import { getFullName, getInitials, USER_ROLE_KEY } from '@/features/auth/types'
import { USER_STATUS_KEY, USER_STATUS_TONE } from '@/features/users/types'
import { Badge, Panel } from '@/shared/ui'
import { formatDateTime } from '@/shared/utils/format-date'
import { resolvePhotoSrc } from '@/shared/utils/photo'

import styles from './profile.module.css'

const Row = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className={styles.row}>
    <span className={styles.label}>{label}</span>
    <span className={styles.value}>{children}</span>
  </div>
)

/**
 * Profil — `GET /auth/me` javobidagi ma'lumotlar. So'rov sessiya
 * tekshiruvida allaqachon yuborilgan, natija `AuthProvider` da turadi,
 * shuning uchun bu yerda qayta so'ralmaydi.
 */
export const Profile = () => {
  const { t } = useTranslation()
  const { user } = useAuth()

  if (!user) {
    return (
      <Stack gap={32}>
        <Panel gap={20}>
          <Group gap={20}>
            <Skeleton height={96} circle />
            <Stack gap={10}>
              <Skeleton height={18} width={240} radius="xl" />
              <Skeleton height={12} width={160} radius="xl" />
            </Stack>
          </Group>
        </Panel>
      </Stack>
    )
  }

  const fullName = getFullName(user)
  const initials = getInitials(user)

  return (
    <Stack gap={32}>
      <Panel gap={20}>
        <div className={styles.head}>
          <Avatar
            src={resolvePhotoSrc(user.photo)}
            size={96}
            radius={96}
            color="brand"
          >
            {initials}
          </Avatar>

          <Stack gap={8}>
            <Title order={3} fz={24}>
              {fullName}
            </Title>

            <Group gap="xs">
              <Badge tone="info">{t(USER_ROLE_KEY[user.role])}</Badge>
              <Badge tone={USER_STATUS_TONE[user.status]}>
                {t(USER_STATUS_KEY[user.status])}
              </Badge>
            </Group>

            <Text size="sm" c="dimmed" className="tabular">
              {user.phone}
            </Text>
          </Stack>
        </div>
      </Panel>

      <Panel gap={0}>
        <Title order={4} fz="md" mb={8}>
          {t('profile.account')}
        </Title>

        <Row label={t('users.lastName')}>{user.last_name}</Row>
        <Row label={t('users.firstName')}>{user.first_name}</Row>
        <Row label={t('users.middleName')}>{user.middle_name || '—'}</Row>
        <Row label={t('users.phone')}>
          <span className="tabular">{user.phone}</span>
        </Row>
        <Row label={t('users.role')}>{t(USER_ROLE_KEY[user.role])}</Row>
        <Row label={t('common.status')}>
          <Badge tone={USER_STATUS_TONE[user.status]}>
            {t(USER_STATUS_KEY[user.status])}
          </Badge>
        </Row>
        <Row label={t('profile.id')}>
          <span className="tabular">{user.id}</span>
        </Row>
        <Row label={t('common.createdAt')}>
          <span className="tabular">{formatDateTime(user.created_at)}</span>
        </Row>
        <Row label={t('common.updatedAt')}>
          <span className="tabular">{formatDateTime(user.updated_at)}</span>
        </Row>
      </Panel>
    </Stack>
  )
}
