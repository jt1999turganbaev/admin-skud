import { Button, Center, Code, Group, Stack, Text, Title } from '@mantine/core'
import { IconAlertTriangle } from '@tabler/icons-react'

interface ErrorScreenProps {
  /** Ushlangan xato — tafsiloti faqat ishlab chiqish rejimida ko'rsatiladi. */
  error?: unknown
  /** Berilsa, "Qayta urinish" tugmasi chiqadi. */
  onRetry?: () => void
}

const getText = (error: unknown): string => {
  if (!error) return ''
  if (typeof error === 'string') return error
  if (error instanceof Error) return error.message

  return String((error as { message?: unknown }).message ?? '')
}

/**
 * "Oq ekran" o'rniga ko'rsatiladigan sahifa.
 *
 * Matnlar bu yerda tarjimasiz: xatolik i18n yuklanmaganda yoki tarjima
 * faylining o'zi buzilganda ham yuz berishi mumkin, u holda `t()` ga
 * tayanib bo'lmaydi.
 */
export const ErrorScreen = ({ error, onRetry }: ErrorScreenProps) => {
  const details = import.meta.env.DEV ? getText(error) : ''

  return (
    <Center mih={360} py={48} px={16}>
      <Stack align="center" gap={16} maw={520}>
        <IconAlertTriangle size={48} stroke={1.6} color="var(--warning)" />

        <Title order={3} fz={22} ta="center">
          Nimadir noto&rsquo;g&rsquo;ri ketdi
        </Title>

        <Text size="sm" c="dimmed" ta="center">
          Sahifani ko&rsquo;rsatishda kutilmagan xatolik yuz berdi. Qayta urinib
          ko&rsquo;ring yoki bosh sahifaga qayting.
        </Text>

        {details && (
          <Code block style={{ maxWidth: '100%', whiteSpace: 'pre-wrap' }}>
            {details}
          </Code>
        )}

        <Group gap="sm" mt={8}>
          {onRetry && <Button onClick={onRetry}>Qayta urinish</Button>}
          <Button variant="default" onClick={() => window.location.assign('/')}>
            Bosh sahifaga
          </Button>
        </Group>
      </Stack>
    </Center>
  )
}
