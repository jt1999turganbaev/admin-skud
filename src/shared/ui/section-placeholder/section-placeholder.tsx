import { Card, Stack, Text, Title } from '@mantine/core'
import { useTranslation } from 'react-i18next'

import styles from './section-placeholder.module.css'

/** API'si hali yo'q bo'limlar uchun bo'sh holat. */
export const SectionPlaceholder = ({ title }: { title: string }) => {
  const { t } = useTranslation()

  return (
    <Card py={56}>
      <Stack gap={6} align="center">
        <span className={styles.badge}>{t('common.comingSoon')}</span>

        <Title order={4} fz="md" mt="xs">
          {title}
        </Title>

        <Text size="sm" c="dimmed" ta="center" maw={360}>
          {t('common.noApi')}
        </Text>
      </Stack>
    </Card>
  )
}
