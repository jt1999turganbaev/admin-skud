import { DatesProvider } from '@mantine/dates'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import 'dayjs/locale/uz-latn'

/**
 * i18n tili -> dayjs lokali. Qoraqalpoqcha uchun dayjs lokali yo'q,
 * shuning uchun eng yaqini — lotin o'zbekchasi.
 */
const DAYJS_LOCALE: Record<string, string> = {
  uz: 'uz-latn',
  qr: 'uz-latn',
}

/** Kalendarlar tili interfeys tili bilan birga o'zgaradi. */
export const AppDatesProvider = ({ children }: { children: ReactNode }) => {
  const { i18n } = useTranslation()
  const locale = DAYJS_LOCALE[i18n.resolvedLanguage ?? 'qr'] ?? 'uz-latn'

  return (
    <DatesProvider settings={{ locale, firstDayOfWeek: 1, weekendDays: [0] }}>
      {children}
    </DatesProvider>
  )
}
