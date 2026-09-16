import type { ReactNode } from 'react'
import { Button, Group, Modal, Stack, type ModalProps } from '@mantine/core'
import { useTranslation } from 'react-i18next'

interface ResourceModalProps {
  opened: boolean
  onClose: () => void
  title: string
  /** Yuborish jarayonida tugmalar bloklanadi. */
  isSubmitting?: boolean
  onSubmit: () => void
  /** Maydonlar ko'p bo'lsa kengroq oyna. */
  size?: ModalProps['size']
  children: ReactNode
}

/**
 * Resurs qo'shish/tahrirlash oynasi — to'rtala bo'lim (foydalanuvchilar,
 * xonalar, terminallar, planshetlar) shu qolipdan foydalanadi.
 */
export const ResourceModal = ({
  opened,
  onClose,
  title,
  isSubmitting = false,
  onSubmit,
  size = 'md',
  children,
}: ResourceModalProps) => {
  const { t } = useTranslation()

  return (
    <Modal opened={opened} onClose={onClose} title={title} size={size}>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit()
        }}
        noValidate
      >
        <Stack gap="md">
          {children}

          <Group justify="flex-end" gap="sm" mt="xs">
            <Button variant="default" onClick={onClose} disabled={isSubmitting}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" loading={isSubmitting}>
              {t('common.save')}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
