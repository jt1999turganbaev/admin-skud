import { Button, Center, Stack, Text, Title } from '@mantine/core'
import { Link } from 'react-router-dom'

import { ROUTES } from '@/shared/constants/routes'

const NotFound = () => (
  <Center mih="100vh" p="md" bg="var(--grey-100)">
    <Stack align="center" gap="sm" ta="center">
      <Text fz={72} fw={800} lh={1} c="brand.6">
        404
      </Text>
      <Title order={4}>Sahifa topilmadi</Title>
      <Text size="sm" c="dimmed" maw={380}>
        So’ralgan manzil mavjud emas yoki ko’chirilgan bo’lishi mumkin.
      </Text>
      <Button component={Link} to={ROUTES.HOME} size="md" mt="xs">
        Bosh sahifaga qaytish
      </Button>
    </Stack>
  </Center>
)

export default NotFound
