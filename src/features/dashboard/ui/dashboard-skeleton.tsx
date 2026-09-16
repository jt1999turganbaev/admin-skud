import { Card, Group, SimpleGrid, Skeleton, Stack } from '@mantine/core'

import { Panel } from '@/shared/ui'

/** Ko'rsatkich kartasi qolipi — `StatCard` bilan bir xil o'lchamlarda. */
const StatCardSkeleton = () => (
  <Card radius="md" padding={20}>
    <Group gap={10} wrap="nowrap">
      <Skeleton height={36} width={36} radius={10} />
      <Skeleton height={12} width="50%" radius="xl" />
    </Group>

    <Skeleton height={28} width={88} radius="xl" mt={14} />
    <Skeleton height={10} width={64} radius="xl" mt={12} />
  </Card>
)

/** Xonalar va terminallar jadvallari qolipi: sarlavha + 5 qator. */
const TablePanelSkeleton = () => (
  <Panel gap={16}>
    <Group justify="space-between">
      <Skeleton height={14} width={190} radius="xl" />
      <Skeleton height={12} width={72} radius="xl" />
    </Group>

    <Stack gap={18} mt={6}>
      {Array.from({ length: 5 }, (_, row) => (
        <Group key={row} gap="md" wrap="nowrap">
          <Skeleton height={10} radius="xl" style={{ flex: 3 }} />
          <Skeleton height={10} radius="xl" style={{ flex: 2 }} />
          <Skeleton height={10} radius="xl" style={{ flex: 2 }} />
          <Skeleton height={20} width={64} radius="xl" />
        </Group>
      ))}
    </Stack>
  </Panel>
)

/**
 * Bosh sahifa yuklanayotganda sahifaning o'z qolipi ko'rsatiladi — spinner
 * emas: bloklar joyida turadi, ma'lumot kelganda sahifa sakramaydi.
 */
export const DashboardSkeleton = () => (
  <Stack gap={32}>
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3, xl: 6 }} spacing="md">
      {Array.from({ length: 6 }, (_, index) => (
        <StatCardSkeleton key={index} />
      ))}
    </SimpleGrid>

    <SimpleGrid cols={{ base: 1, xl: 2 }} spacing={32}>
      {Array.from({ length: 2 }, (_, index) => (
        <TablePanelSkeleton key={index} />
      ))}
    </SimpleGrid>
  </Stack>
)
