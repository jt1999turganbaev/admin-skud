import { Card, Grid, Group, Skeleton, Stack } from '@mantine/core'

/** Yorliq + maydon juftligi — haqiqiy inputlar bilan bir xil balandlikda. */
const FieldSkeleton = () => (
  <Stack gap={6}>
    <Skeleton height={10} width={92} radius="xl" />
    <Skeleton height={48} radius={8} />
  </Stack>
)

/**
 * Tahrirlash sahifasida yozuv yuklanayotganda forma qolipi ko'rsatiladi:
 * kartalar, ustunlar va maydonlar soni haqiqiy forma bilan bir xil, shuning
 * uchun ma'lumot kelganda sahifa siljimaydi.
 */
export const UserFormSkeleton = () => (
  <Stack gap={32}>
    <Card>
      <Skeleton height={14} width={210} radius="xl" mb="lg" />

      <Grid gutter="md">
        <Grid.Col span={12}>
          <Group gap="md" wrap="nowrap">
            <Skeleton height={104} width={104} radius={12} />
            <Stack gap={10}>
              <Skeleton height={26} width={210} radius={8} />
              <Skeleton height={10} width={170} radius="xl" />
              <Skeleton height={10} width={200} radius="xl" />
            </Stack>
          </Group>
        </Grid.Col>

        {Array.from({ length: 4 }, (_, index) => (
          <Grid.Col key={index} span={{ base: 12, sm: 6, lg: 4, xl: 3 }}>
            <FieldSkeleton />
          </Grid.Col>
        ))}
      </Grid>
    </Card>

    <Card>
      <Skeleton height={14} width={168} radius="xl" mb="lg" />

      <Grid gutter="md">
        {Array.from({ length: 3 }, (_, index) => (
          <Grid.Col key={index} span={{ base: 12, sm: 6, lg: 4 }}>
            <FieldSkeleton />
          </Grid.Col>
        ))}
      </Grid>
    </Card>

    <Group justify="flex-end" gap="sm">
      <Skeleton height={42} width={132} radius={8} />
      <Skeleton height={42} width={104} radius={8} />
    </Group>
  </Stack>
)
