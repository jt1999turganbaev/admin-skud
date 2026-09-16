import type { MantineColorsTuple } from '@mantine/core'

/**
 * `front` (JihozMed) loyihasidagi `src/theme/palette.js` dan ko'chirilgan
 * palitra. Mantine ranglar 10 pog'onali tuple kutadi, MUI esa
 * lighter/light/main/dark/darker bilan ishlaydi — quyida ikkalasi ham bor:
 * tuple Mantine komponentlari uchun, nomlangan qiymatlar esa dizaynda
 * aniq ko'rsatilgan joylar uchun.
 */

export const grey = {
  0: '#FFFFFF',
  100: '#F3F4F6',
  200: '#E5E7EB',
  300: '#D1D5DB',
  400: '#9CA3AF',
  500: '#5F6673',
  600: '#3E4854',
  700: '#374151',
  800: '#1F2937',
  900: '#111827',
} as const

/** UZINFOCOM brend rangi (logotipdagi belgi) — loyihaning asosiy rangi. */
/**
 * front `theme/index.js` palitradagi primary'ni preset bilan ustidan yozadi
 * (`default: blue`) — shuning uchun asosiy rang ko'k, `palette.js` dagi
 * yashil emas. Qiymatlar `theme/options/presets.js` dagi `blue` dan.
 */
export const primary = {
  lighter: '#D6E9FA',
  light: '#7FB4E6',
  main: '#2D7AC4',
  dark: '#1F5C9B',
  darker: '#133D6D',
  contrastText: '#FFFFFF',
} as const

/** UZINFOCOM brend aksenti (logotipdagi yozuv). */
export const accent = {
  lighter: '#FFE6CC',
  light: '#FFB066',
  main: '#FE830C',
  dark: '#BF5D00',
  darker: '#8F4600',
  contrastText: '#FFFFFF',
} as const

export const secondary = {
  lighter: '#EFD6FF',
  light: '#C684FF',
  main: '#8E33FF',
  dark: '#5119B7',
  darker: '#27097A',
} as const

export const info = {
  lighter: '#CAFDF5',
  light: '#61F3F3',
  main: '#00B8D9',
  dark: '#006C9C',
  darker: '#003768',
} as const

export const success = {
  lighter: '#D3FCD2',
  light: '#77ED8B',
  main: '#22C55E',
  dark: '#118D57',
  darker: '#065E49',
} as const

export const warning = {
  lighter: '#FFF5CC',
  light: '#FFD666',
  main: '#FFAB00',
  dark: '#B76E00',
  darker: '#7A4100',
} as const

export const error = {
  lighter: '#FFE9D5',
  light: '#FFAC82',
  main: '#FF5630',
  dark: '#B71D18',
  darker: '#7A0916',
} as const

/** MUI: palette.divider = alpha(grey[500], 0.2) */
export const divider = 'rgba(95, 102, 115, 0.2)'

/**
 * Jadval ajratgichlari. palette.divider (0.2) punktir chiziqda juda qalin
 * ko'rinadi, shuning uchun jadval uchun sezilarli yumshoqroq qiymat.
 */
export const tableBorder = 'rgba(95, 102, 115, 0.08)'

/** Matn ranglari — sof qora emas, yumshoq ko'kish-kulrang (global.css bilan bir xil). */
export const text = {
  primary: '#2F3A4B',
  secondary: '#4B5563',
  disabled: '#6B7280',
} as const

export const background = {
  paper: '#FFFFFF',
  default: '#FFFFFF',
  neutral: grey[200],
} as const

/** Mantine `colors` uchun tuple'lar — index 6 asosiy (`main`) rang. */
export const colors: Record<string, MantineColorsTuple> = {
  brand: [
    '#EEF5FC',
    '#D6E9FA',
    '#ABCDF1',
    '#7FB4E6',
    '#5898D6',
    '#3F87CD',
    '#2D7AC4',
    '#256AAF',
    '#1F5C9B',
    '#133D6D',
  ],
  accent: [
    '#FFF4E8',
    '#FFE6CC',
    '#FFCB99',
    '#FFB066',
    '#FF9A3D',
    '#FE8C22',
    '#FE830C',
    '#E57000',
    '#BF5D00',
    '#8F4600',
  ],
  gray: [
    '#F9FAFB',
    '#F3F4F6',
    '#E5E7EB',
    '#D1D5DB',
    '#9CA3AF',
    '#6B7280',
    '#5F6673',
    '#3E4854',
    '#1F2937',
    '#111827',
  ],
  success: [
    '#EDFCF0',
    '#D3FCD2',
    '#A9F5B0',
    '#77ED8B',
    '#4ADE72',
    '#2ECF66',
    '#22C55E',
    '#16A34A',
    '#118D57',
    '#065E49',
  ],
  warning: [
    '#FFFAEB',
    '#FFF5CC',
    '#FFE9A3',
    '#FFD666',
    '#FFC233',
    '#FFB414',
    '#FFAB00',
    '#D98D00',
    '#B76E00',
    '#7A4100',
  ],
  error: [
    '#FFF3EC',
    '#FFE9D5',
    '#FFCDAE',
    '#FFAC82',
    '#FF8A5B',
    '#FF6E3F',
    '#FF5630',
    '#E03B1C',
    '#B71D18',
    '#7A0916',
  ],
  info: [
    '#E9FDFB',
    '#CAFDF5',
    '#96FAF0',
    '#61F3F3',
    '#33E2E8',
    '#12CEDD',
    '#00B8D9',
    '#0095B5',
    '#006C9C',
    '#003768',
  ],
}
