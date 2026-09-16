import { ActionIcon, Group, Tooltip } from '@mantine/core'
import { IconEye, IconPencil, IconTrash } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

interface RowActionsProps {
  /** Berilsa, tahrirlashdan oldin "ko'rish" ikonkasi chiqadi. */
  onView?: () => void
  onEdit: () => void
  onDelete: () => void
  /** O'chirish taqiqlangan holat (masalan, bog'liq yozuvlar bor). */
  deleteDisabled?: boolean
}

/**
 * Jadval qatoridagi amallar. `el-yurt-admin` dagi qoida: uch nuqtali menyu
 * emas, ikkita ikonka to'g'ridan-to'g'ri qatorda turadi — tahrirlash sariq,
 * o'chirish qizil. Qator bosilishi bilan aralashmasligi uchun hodisa
 * yuqoriga uzatilmaydi.
 */
export const RowActions = ({
  onView,
  onEdit,
  onDelete,
  deleteDisabled = false,
}: RowActionsProps) => {
  const { t } = useTranslation()

  return (
    <Group gap={4} justify="flex-end" wrap="nowrap">
      {onView && (
        <Tooltip label={t('common.view')} withArrow>
          <ActionIcon
            variant="subtle"
            color="brand"
            size="lg"
            aria-label={t('common.view')}
            onClick={(event) => {
              event.stopPropagation()
              onView()
            }}
          >
            <IconEye size={20} />
          </ActionIcon>
        </Tooltip>
      )}

      <Tooltip label={t('common.edit')} withArrow>
        <ActionIcon
          variant="subtle"
          color="warning"
          size="lg"
          aria-label={t('common.edit')}
          onClick={(event) => {
            event.stopPropagation()
            onEdit()
          }}
        >
          <IconPencil size={20} />
        </ActionIcon>
      </Tooltip>

      <Tooltip label={t('common.delete')} withArrow>
        <ActionIcon
          variant="subtle"
          color="error"
          size="lg"
          disabled={deleteDisabled}
          aria-label={t('common.delete')}
          onClick={(event) => {
            event.stopPropagation()
            onDelete()
          }}
        >
          <IconTrash size={20} />
        </ActionIcon>
      </Tooltip>
    </Group>
  )
}
