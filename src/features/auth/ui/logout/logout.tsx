import { Text } from '@mantine/core'
import { modals } from '@mantine/modals'
import { useTranslation } from 'react-i18next'

import { useAuth } from '../../auth-context/auth-context'

/** Chiqishni tasdiqlash oynasini ochadigan hook. */
export const useLogoutConfirm = () => {
  const { logout } = useAuth()
  const { t } = useTranslation()

  return () =>
    modals.openConfirmModal({
      title: t('auth.logoutTitle'),
      children: <Text size="sm">{t('auth.logoutConfirm')}</Text>,
      labels: { confirm: t('nav.logout'), cancel: t('common.cancel') },
      confirmProps: { color: 'error' },
      onConfirm: logout,
    })
}
