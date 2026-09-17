import {
  Button,
  Card,
  Grid,
  Group,
  NumberInput,
  Select,
  Stack,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core'
import { isNotEmpty, useForm } from '@mantine/form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import {
  ROOM_STATUS_KEY,
  ROOM_STATUSES,
  type Room,
  type RoomCreateBody,
  type RoomStatus,
} from '@/features/rooms/types'
import { TASK_DESCRIPTION_MAX } from '@/features/tasks/types'
import { LANGUAGES } from '@/shared/config/languages'
import { ROUTES } from '@/shared/constants/routes'
import {
  EMPTY_TRANSLATABLE,
  toTranslatable,
  type Translatable,
} from '@/shared/types/translatable'

/**
 * `NumberInput` son yoki bo'sh bo'lsa `''` beradi. Backend satr kutadi —
 * yuborishda satrga o'giriladi.
 */
export type RoomFormValues = Omit<RoomCreateBody, 'number_station' | 'task'> & {
  number_station: number | string
  /** Hamma maydon bo'sh bo'lsa — xonada topshiriq yo'q. */
  task: { name: Translatable; description: Translatable }
}

/** Backend 422 javobini maydonlarga qo'yish uchun forma bilan aloqa. */
export interface RoomFormHelpers {
  setErrors: (errors: Record<string, string>) => void
}

const hasTask = (task: RoomFormValues['task']) =>
  [task.name.uz, task.name.qr, task.description.uz, task.description.qr].some(
    (value) => value.trim(),
  )

/** Bo'sh tavsif `null` bo'lib ketadi — u tilda tavsif yo'q. */
const toDescription = (value: string) => value.trim() || null

const EMPTY: RoomFormValues = {
  name: EMPTY_TRANSLATABLE,
  number: '',
  number_station: '',
  status: 'active',
  task: { name: EMPTY_TRANSLATABLE, description: EMPTY_TRANSLATABLE },
}

/** Tahrirlashda mavjud yozuvni forma qiymatlariga o'giradi. */
export const toFormValues = (room: Room): RoomFormValues => ({
  // Javobdagi `name` — faqat tanlangan til; formaga ikkalasi kerak.
  name: toTranslatable(room.translations?.name),
  number: room.number,
  number_station: room.number_station ?? '',
  status: room.status,
  task: {
    name: toTranslatable(room.task?.translations?.name),
    description: toTranslatable(room.task?.translations?.description),
  },
})

/**
 * Forma qiymatlarini backend kutgan shaklga o'giradi.
 *
 * `hadTask` — tahrirlanayotgan xonada topshiriq bor edi. Maydonlar
 * tozalansa `task: null` yuboriladi (olib tashlanadi); topshiriq yo'q
 * edi va maydonlar bo'sh bo'lsa, `task` umuman yuborilmaydi.
 */
export const toBody = (
  values: RoomFormValues,
  hadTask = false,
): RoomCreateBody => {
  const { task, ...rest } = values
  const body: RoomCreateBody = {
    ...rest,
    name: { uz: values.name.uz.trim(), qr: values.name.qr.trim() },
    // Validatsiyadan o'tgan — bo'sh emas.
    number_station: String(values.number_station),
  }

  if (hasTask(task)) {
    body.task = {
      name: { uz: task.name.uz.trim(), qr: task.name.qr.trim() },
      description: {
        uz: toDescription(task.description.uz),
        qr: toDescription(task.description.qr),
      },
    }
  } else if (hadTask) {
    body.task = null
  }

  return body
}

interface RoomFormProps {
  title: string
  initialValues?: RoomFormValues
  isSubmitting?: boolean
  onSubmit: (values: RoomFormValues, helpers: RoomFormHelpers) => void
}

export const RoomForm = ({
  title,
  initialValues = EMPTY,
  isSubmitting = false,
  onSubmit,
}: RoomFormProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  // Topshiriq ixtiyoriy, lekin biror maydoni to'ldirilsa nomi ikkala tilda kerak.
  const requiredTaskName = (value: string, values: RoomFormValues) =>
    hasTask(values.task) && !value.trim()
      ? t('assignments.taskNameRequired')
      : null
  const maxDescription = (value: string) =>
    value.trim().length > TASK_DESCRIPTION_MAX
      ? t('assignments.taskDescriptionMax', { max: TASK_DESCRIPTION_MAX })
      : null

  const form = useForm<RoomFormValues>({
    initialValues,
    validate: {
      // Nom ikkala tilda majburiy.
      name: {
        uz: isNotEmpty(t('rooms.nameRequired')),
        qr: isNotEmpty(t('rooms.nameRequired')),
      },
      number: isNotEmpty(t('rooms.numberRequired')),
      number_station: (value) =>
        value === '' ? t('rooms.numberStationRequired') : null,
      task: {
        name: { uz: requiredTaskName, qr: requiredTaskName },
        description: { uz: maxDescription, qr: maxDescription },
      },
    },
  })

  return (
    <form
      onSubmit={form.onSubmit((values) =>
        onSubmit(values, { setErrors: form.setErrors }),
      )}
      noValidate
    >
      <Stack gap={32}>
        <Card>
          <Title order={4} fz="md" mb="lg">
            {title}
          </Title>

          <Grid gutter="md">
            <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
              <TextInput
                label={t('rooms.number')}
                placeholder={t('rooms.numberPlaceholder')}
                withAsterisk
                {...form.getInputProps('number')}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
              <NumberInput
                label={t('rooms.numberStation')}
                placeholder={t('rooms.numberStationPlaceholder')}
                allowDecimal={false}
                allowNegative={false}
                hideControls
                withAsterisk
                {...form.getInputProps('number_station')}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
              <Select
                label={t('common.status')}
                data={ROOM_STATUSES.map((value) => ({
                  value,
                  label: t(ROOM_STATUS_KEY[value]),
                }))}
                allowDeselect={false}
                {...form.getInputProps('status')}
                onChange={(value) =>
                  form.setFieldValue(
                    'status',
                    (value as RoomStatus) ?? 'active',
                  )
                }
              />
            </Grid.Col>

            {LANGUAGES.map((language) => (
              <Grid.Col key={language.code} span={{ base: 12, sm: 6 }}>
                <TextInput
                  label={`${t('rooms.name')} (${language.label})`}
                  placeholder={t('rooms.namePlaceholder')}
                  withAsterisk
                  {...form.getInputProps(`name.${language.code}`)}
                />
              </Grid.Col>
            ))}
          </Grid>
        </Card>

        {/* Topshiriq xonaga tegishli — planshet uni kirish va chiqishda
            ko'rsatadi. Hamma maydon bo'sh qolsa, topshiriq yo'q. */}
        <Card>
          <Title order={4} fz="md" mb="lg">
            {t('rooms.task')}
          </Title>

          <Grid gutter="md">
            {LANGUAGES.map((language) => (
              <Grid.Col key={language.code} span={{ base: 12, md: 6 }}>
                <Stack gap="md">
                  <TextInput
                    label={`${t('assignments.taskName')} (${language.label})`}
                    placeholder={t('assignments.taskNamePlaceholder')}
                    {...form.getInputProps(`task.name.${language.code}`)}
                  />

                  <Textarea
                    label={`${t('assignments.taskDescription')} (${language.label})`}
                    placeholder={t('assignments.taskDescriptionPlaceholder')}
                    autosize
                    minRows={4}
                    maxRows={10}
                    {...form.getInputProps(`task.description.${language.code}`)}
                  />
                </Stack>
              </Grid.Col>
            ))}
          </Grid>
        </Card>

        <Group justify="flex-end" gap="sm">
          <Button
            variant="default"
            size="md"
            onClick={() => navigate(ROUTES.ROOMS)}
            disabled={isSubmitting}
          >
            {t('common.cancel')}
          </Button>
          <Button type="submit" size="md" loading={isSubmitting}>
            {t('common.save')}
          </Button>
        </Group>
      </Stack>
    </form>
  )
}
