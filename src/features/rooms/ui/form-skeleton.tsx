import { Card, Grid, Group, Skeleton, Stack } from '@mantine/core'

/** Yorliq + maydon juftligi — haqiqiy inputlar bilan bir xil balandlikda. */
const FieldSkeleton = ({ height = 48 }: { height?: number }) => (
  <Stack gap={6}>
    <Skeleton height={10} width={92} radius="xl" />
    <Skeleton height={height} radius={8} />
  </Stack>
)

/** Yozuv yuklanayotganda forma qolipi — sahifa siljimasin. */
export const RoomFormSkeleton = () => (
  <Stack gap={32}>
    <Card>
      <Skeleton height={14} width={180} radius="xl" mb="lg" />

      <Grid gutter="md">
        {Array.from({ length: 3 }, (_, index) => (
          <Grid.Col key={`meta-${index}`} span={{ base: 12, sm: 6, lg: 4 }}>
            <FieldSkeleton />
          </Grid.Col>
        ))}
        {Array.from({ length: 2 }, (_, index) => (
          <Grid.Col key={`name-${index}`} span={{ base: 12, sm: 6 }}>
            <FieldSkeleton />
          </Grid.Col>
        ))}
      </Grid>
    </Card>

    <Card>
      <Skeleton height={14} width={120} radius="xl" mb="lg" />

      <Grid gutter="md">
        {Array.from({ length: 2 }, (_, index) => (
          <Grid.Col key={index} span={{ base: 12, md: 6 }}>
            <Stack gap="md">
              <FieldSkeleton />
              <FieldSkeleton height={112} />
            </Stack>
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
