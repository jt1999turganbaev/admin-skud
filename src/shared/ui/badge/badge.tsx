import { Badge as MantineBadge } from '@mantine/core'
import type { ReactNode } from 'react'

import type { Tone } from '@/shared/types'

/** Dizayndagi tone -> mavzudagi rang. */
const TONE_COLOR: Record<Tone, string> = {
  ok: 'success',
  danger: 'error',
  warn: 'warning',
  info: 'info',
  neutral: 'gray',
}

interface BadgeProps {
  tone?: Tone
  children: ReactNode
}

/** O'lcham va radius mavzudagi `Badge` qoidasidan keladi (front `Label`). */
export const Badge = ({ tone = 'neutral', children }: BadgeProps) => (
  <MantineBadge color={TONE_COLOR[tone]}>{children}</MantineBadge>
)
