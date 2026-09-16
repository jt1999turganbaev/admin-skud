import { Card, Grid, Group, Skeleton, Stack } from '@mantine/core'

/** Yorliq + maydon juftligi — haqiqiy inputlar bilan bir xil balandlikda. */
const FieldSkeleton = () => (
  <Stack gap={6}>
    <Skeleton height={10} width={92} radius="xl" />
    <Skeleton height={48} radius={8} />
  </Stack>
)

/** Yozuv yuklanayotganda forma qolipi — sahifa siljimasin. */
export const AssignmentFormSkeleton = () => (
  <Stack gap={32}>
    <Card>
      <Skeleton height={14} width={210} radius="xl" mb="lg" />

      <Grid gutter="md">
        {Array.from({ length: 5 }, (_, index) => (
          <Grid.Col key={index} span={{ base: 12, sm: 6, lg: 4 }}>
            <FieldSkeleton />
          </Grid.Col>
        ))}
      </Grid>
    </Card>

    <Card>
      <Skeleton height={14} width={168} radius="xl" mb="lg" />

      <Grid gutter="md">
        <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
          <FieldSkeleton />
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <Stack gap={6}>
            <Skeleton height={10} width={92} radius="xl" />
            <Skeleton height={96} radius={8} />
          </Stack>
        </Grid.Col>
      </Grid>
    </Card>

    <Group justify="flex-end" gap="sm">
      <Skeleton height={42} width={132} radius={8} />
      <Skeleton height={42} width={104} radius={8} />
    </Group>
  </Stack>
)
