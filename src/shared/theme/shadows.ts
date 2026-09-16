import { grey } from './palette'

/** `#RRGGBB` + alpha -> `rgba(...)`. */
const alpha = (hex: string, value: number): string => {
  const int = parseInt(hex.slice(1), 16)
  const r = (int >> 16) & 255
  const g = (int >> 8) & 255
  const b = int & 255

  return `rgba(${r}, ${g}, ${b}, ${value})`
}

/**
 * `front/src/theme/custom-shadows.js` dagi soyalar. Mantine `shadows`
 * kalitlari (xs..xl) MUI'ning z1..z20 pog'onalariga moslashtirilgan.
 */
const base = grey[500]
const transparent = alpha(base, 0.16)

export const shadows = {
  xs: `0 1px 2px 0 ${transparent}`,
  sm: `0 4px 8px 0 ${transparent}`,
  md: `0 8px 16px 0 ${transparent}`,
  lg: `0 12px 24px -4px ${transparent}`,
  xl: `0 20px 40px -4px ${transparent}`,
}

/** Dizaynda alohida nomlangan soyalar. */
export const customShadows = {
  card: `0 0 2px 0 ${alpha(base, 0.2)}, 0 12px 24px -4px ${alpha(base, 0.12)}`,
  dropdown: `0 0 2px 0 ${alpha(base, 0.24)}, -20px 20px 40px -4px ${alpha(base, 0.24)}`,
  dialog: `-40px 40px 80px -8px rgba(0, 0, 0, 0.24)`,
  primary: `0 8px 16px 0 rgba(45, 122, 196, 0.24)`,
}
