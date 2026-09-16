import { Button, Skeleton, Stack, Table, Text } from '@mantine/core'
import { useTranslation } from 'react-i18next'

import type { HTTPError } from '@/shared/types/http'
import { getErrorMessage } from '@/shared/utils/error-message'

interface TableStateProps {
  colSpan: number
  isLoading: boolean
  error: HTTPError | null
  isEmpty: boolean
  emptyText?: string
  onRetry?: () => void
  /** Yuklanish paytida ko'rsatiladigan skelet qatorlar soni. */
  skeletonRows?: number
}

/**
 * Jadval tanasidagi uchta holat: yuklanmoqda / xatolik / bo'sh.
 * front'dagi bo'sh holat: `align="center"`, `body2`, `text.secondary`, `py={4}`.
 */
export const TableState = ({
  colSpan,
  isLoading,
  error,
  isEmpty,
  emptyText,
  onRetry,
  skeletonRows = 5,
}: TableStateProps) => {
  const { t } = useTranslation()

  if (!isLoading && !error && !isEmpty) return null

  /**
   * Yuklanishda spinner emas, jadval qolipining o'zi ko'rsatiladi: qatorlar
   * soni va ustunlar kengligi saqlanadi, shuning uchun ma'lumot kelganda
   * sahifa sakramaydi. Birinchi ustun — tartib raqami, oxirgisi — amallar
   * tugmasi, ular tor; oradagilar matn kengligida.
   */
  if (isLoading) {
    return (
      <>
        {Array.from({ length: skeletonRows }, (_, row) => (
          <Table.Tr key={row}>
            {Array.from({ length: colSpan }, (_, col) => {
              const isFirst = col === 0
              const isLast = col === colSpan - 1

              return (
                <Table.Td key={col}>
                  <Skeleton
                    height={10}
                    radius="xl"
                    my={10}
                    width={
                      isFirst ? 18 : isLast ? 20 : `${55 + ((col * 13) % 35)}%`
                    }
                    ml={isLast ? 'auto' : undefined}
                  />
                </Table.Td>
              )
            })}
          </Table.Tr>
        ))}
      </>
    )
  }

  return (
    <Table.Tr>
      <Table.Td colSpan={colSpan} ta="center" py={32}>
        {error && (
          <Stack gap="sm" align="center">
            <Text size="sm" c="error.6">
              {getErrorMessage(error)}
            </Text>
            {onRetry && (
              <Button variant="outline" size="sm" onClick={onRetry}>
                {t('common.retry')}
              </Button>
            )}
          </Stack>
        )}

        {!error && isEmpty && (
          <Text size="sm" c="dimmed">
            {emptyText ?? t('common.notFound')}
          </Text>
        )}
      </Table.Td>
    </Table.Tr>
  )
}
