import type { ReactNode } from 'react'

import styles from './panel.module.css'

interface PanelProps {
  /** Ichki elementlar orasidagi masofa (px). front: filtrlarda 16, jadvalda 20. */
  gap?: number
  children: ReactNode
}

/**
 * front ro‘yxat sahifalari (src/sections/.../list.js) dagi oq panel: `padding: 24px`,
 * `borderRadius: 12px`, ichida flex-column va berilgan gap.
 */
export const Panel = ({ gap = 16, children }: PanelProps) => (
  <section className={styles.panel} style={{ gap }}>
    {children}
  </section>
)
