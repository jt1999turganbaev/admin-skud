import { ActionIcon, Box, Menu, Text, UnstyledButton } from '@mantine/core'
import { IconChevronDown, IconMenu2, IconUserCircle } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { useAuth } from '@/features/auth/auth-context/auth-context'
import { getFullName, USER_ROLE_KEY } from '@/features/auth/types'
import { ROUTES } from '@/shared/constants/routes'
import { LanguageSwitcher } from '@/shared/ui'

import styles from './header.module.css'

interface HeaderProps {
  onToggleSidebar: () => void
}

export const Header = ({ onToggleSidebar }: HeaderProps) => {
  const { user: me } = useAuth()
  const { t } = useTranslation()

  const fullName = me ? getFullName(me) : '—'

  return (
    <Box component="header" className={styles.topbar}>
      <ActionIcon
        variant="subtle"
        size={42}
        radius="sm"
        onClick={onToggleSidebar}
        aria-label={t('nav.toggleSidebar')}
      >
        <IconMenu2 size={20} />
      </ActionIcon>

      {/* Global qidiruv olib tashlangan — qidiruv har bir ro'yxat sahifasining
        o'z filtr panelida turadi. */}
      <Box style={{ flex: 1 }} />

      <LanguageSwitcher />

      <Menu position="bottom-end" width={200} radius="sm">
        <Menu.Target>
          <UnstyledButton className={styles.account}>
            <span className={styles.accountText}>
              <Text size="sm" fw={700} lh={1.2}>
                {fullName}
              </Text>
              <Text size="xs" c="dimmed" lh={1.2}>
                {me ? t(USER_ROLE_KEY[me.role]) : ''}
              </Text>
            </span>
            <IconChevronDown size={16} className={styles.accountChevron} />
          </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            component={Link}
            to={ROUTES.PROFILE}
            leftSection={<IconUserCircle size={16} />}
          >
            {t('nav.profile')}
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Box>
  )
}
