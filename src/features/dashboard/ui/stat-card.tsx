import { Card, Group, Text } from '@mantine/core'
import type { Icon } from '@tabler/icons-react'
import { Link } from 'react-router-dom'

import styles from './stat-card.module.css'

/** Ikonka chipi va aksent rangi — har bir ko'rsatkich uchun alohida. */
export type StatTone =
  'brand' | 'orange' | 'cyan' | 'teal' | 'green' | 'violet' | 'red'

interface StatCardProps {
  label: string
  Glyph: Icon
  tone: StatTone
  value: number | string
  /** Raqam ostidagi izoh — masalan "Jami: 18". */
  hint?: string
  /** Berilsa, karta havolaga aylanadi. */
  to?: string
}

export const StatCard = ({
  label,
  Glyph,
  tone,
  value,
  hint,
  to,
}: StatCardProps) => {
  const content = (
    <>
      <Group gap={10} wrap="nowrap">
        <span className={styles.chip}>
          <Glyph size={19} stroke={2} />
        </span>
        <Text className={styles.label}>{label}</Text>
      </Group>

      <Text className={styles.value}>{value}</Text>

      {hint && <Text className={styles.footnote}>{hint}</Text>}
    </>
  )

  return to ? (
    <Card
      component={Link}
      to={to}
      data-tone={tone}
      radius="md"
      padding={20}
      className={styles.card}
    >
      {content}
    </Card>
  ) : (
    <Card data-tone={tone} radius="md" padding={20} className={styles.card}>
      {content}
    </Card>
  )
}
