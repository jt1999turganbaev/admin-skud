import { Text } from '@mantine/core'
import { modals } from '@mantine/modals'
import { useTranslation } from 'react-i18next'

interface DeleteConfirmOptions {
  /** O'chirilayotgan yozuv nomi — oynada ko'rsatiladi. */
  name: string
  onConfirm: () => void
}

/**
 * O'chirishni tasdiqlash oynasi. To'rtala ro'yxat sahifasi shu hook'dan
 * foydalanadi — matn va tugmalar bir xil bo'lishi uchun.
 */
export const useDeleteConfirm = () => {
  const { t } = useTranslation()

  return (options: DeleteConfirmOptions) =>
    modals.openConfirmModal({
      title: t('common.deleteTitle'),
      children: (
        <Text size="sm">
          <b>{options.name}</b> {t('common.deleteWarning')}
        </Text>
      ),
      labels: { confirm: t('common.delete'), cancel: t('common.cancel') },
      confirmProps: { color: 'error' },
      onConfirm: options.onConfirm,
    })
}
