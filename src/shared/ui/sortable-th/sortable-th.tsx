import { Group, Table, UnstyledButton } from '@mantine/core'
import {
  IconArrowNarrowDown,
  IconArrowNarrowUp,
  IconArrowsSort,
} from '@tabler/icons-react'
import type { ReactNode } from 'react'

import type { FilterParams } from '@/shared/types/filterParams'

import styles from './sortable-th.module.css'

interface SortableThProps {
  /** Backend `order_by` da qabul qiladigan maydon nomi. */
  field: string
  /** Joriy filtr holati — `order_by` va `sort` shu yerdan o'qiladi. */
  params: Pick<FilterParams, 'order_by' | 'sort'>
  onSort: (field: string) => void
  children: ReactNode
}

/**
 * Saralanadigan ustun sarlavhasi. Bosilganda `useFilterParams.toggleSort`
 * chaqiriladi: o'sish -> kamayish -> saralanmagan. Faol ustunda strelka,
 * qolganlarida — betaraf belgi (faqat ustiga borilganda ko'rinadi).
 */
export const SortableTh = ({
  field,
  params,
  onSort,
  children,
}: SortableThProps) => {
  const isActive = params.order_by === field
  const isAsc = isActive && params.sort === 'asc'
  const isDesc = isActive && params.sort === 'desc'

  return (
    <Table.Th className={styles.th}>
      <UnstyledButton
        className={styles.button}
        data-active={isActive || undefined}
        onClick={() => onSort(field)}
      >
        <Group gap={6} wrap="nowrap">
          <span>{children}</span>

          {isAsc && <IconArrowNarrowUp size={16} className={styles.icon} />}
          {isDesc && <IconArrowNarrowDown size={16} className={styles.icon} />}
          {!isActive && <IconArrowsSort size={14} className={styles.idle} />}
        </Group>
      </UnstyledButton>
    </Table.Th>
  )
}
