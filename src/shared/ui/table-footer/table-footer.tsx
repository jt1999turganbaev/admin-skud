import { Group, Pagination, Select, Text } from '@mantine/core'
import { useTranslation } from 'react-i18next'

import { PER_PAGE_OPTIONS } from '@/shared/hooks/use-filter-params'

interface TableFooterProps {
  page: number
  lastPage: number
  total: number
  onChange: (page: number) => void
  /** Sahifadagi yozuvlar soni — berilsa, tanlov ro'yxati ko'rinadi. */
  perPage?: number
  onPerPageChange?: (perPage: number) => void
  /** "Jami soni: 152" o'rniga boshqa matn kerak bo'lsa. */
  totalLabel?: string
}

/**
 * Jadval ostidagi qator: chapda sahifa hajmi, o'ngda sahifalar va umumiy son.
 * front ro'yxat sahifalaridagi kabi — bitta sahifa bo'lsa raqamlar chizilmaydi.
 */
export const TableFooter = ({
  page,
  lastPage,
  total,
  onChange,
  perPage,
  onPerPageChange,
  totalLabel,
}: TableFooterProps) => {
  const { t } = useTranslation()

  if (total === 0) return null

  return (
    <Group justify="space-between" align="center" gap="md" wrap="wrap">
      {perPage && onPerPageChange ? (
        <Group gap="xs" wrap="nowrap">
          <Text size="sm" c="dimmed">
            {t('common.perPage')}
          </Text>
          <Select
            size="sm"
            w={90}
            data={PER_PAGE_OPTIONS.map(String)}
            value={String(perPage)}
            onChange={(value) => onPerPageChange(Number(value))}
            allowDeselect={false}
            comboboxProps={{ width: 90 }}
          />
        </Group>
      ) : (
        <span />
      )}

      <Group gap="lg" wrap="wrap" justify="flex-end">
        {lastPage > 1 && (
          <Pagination
            value={Math.min(page, lastPage)}
            total={lastPage}
            onChange={onChange}
            color="brand"
            variant="subtle"
            radius="sm"
          />
        )}

        <Text size="md" fw={400}>
          {totalLabel ?? t('common.total')}: <b>{total}</b>
        </Text>
      </Group>
    </Group>
  )
}
