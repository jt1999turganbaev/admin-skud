import { useMemo } from 'react'
import {
  Button,
  Card,
  Divider,
  Grid,
  Group,
  Select,
  Stack,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'
import { isNotEmpty, useForm } from '@mantine/form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import {
  ASSIGNMENT_STATUS_KEY,
  ASSIGNMENT_STATUSES,
  type Assignment,
  type AssignmentStatus,
} from '@/features/assignments/types'
import { useFetchRoomsList } from '@/features/rooms/queries/rooms-queries'
import { getRoomLabel } from '@/features/rooms/types'
import { useFetchUsersList } from '@/features/users/queries/users-queries'
import { getFullName } from '@/features/users/types'
import { ROUTES } from '@/shared/constants/routes'
import { parseApiDate } from '@/shared/utils/format-date'

/**
 * Formada `id` lar satr (Select shunday ishlaydi), sanalar esa `Date`
 * (`DateTimePicker` shuni kutadi) — yuborishdan oldin ikkalasi ham
 * backend kutgan shaklga o'giriladi.
 */
export interface AssignmentFormValues {
  user_id: string | null
  room_id: string | null
  /** Topshiriq biriktirish bilan birga yaratiladi — nomi bo'sh bo'lsa, u yo'q. */
  task_name: string
  task_description: string
  starts_at: Date | null
  ends_at: Date | null
  status: AssignmentStatus
}

/** Backend 422 javobini maydonlarga qo'yish uchun forma bilan aloqa. */
export interface AssignmentFormHelpers {
  setErrors: (errors: Record<string, string>) => void
}

const EMPTY: AssignmentFormValues = {
  user_id: null,
  room_id: null,
  task_name: '',
  task_description: '',
  starts_at: null,
  ends_at: null,
  status: 'active',
}

/** Tahrirlashda mavjud yozuvni forma qiymatlariga o'giradi. */
export const toFormValues = (assignment: Assignment): AssignmentFormValues => ({
  // Bog'langan foydalanuvchi yoki xona o'chirilgan bo'lsa, maydon bo'sh
  // qoladi va forma uni qayta tanlashni so'raydi.
  user_id: assignment.user ? String(assignment.user.id) : null,
  room_id: assignment.room ? String(assignment.room.id) : null,
  task_name: assignment.task?.name ?? '',
  task_description: assignment.task?.description ?? '',
  starts_at: parseApiDate(assignment.starts_at),
  ends_at: parseApiDate(assignment.ends_at),
  status: assignment.status,
})

interface AssignmentFormProps {
  title: string
  initialValues?: AssignmentFormValues
  isSubmitting?: boolean
  onSubmit: (
    values: AssignmentFormValues,
    helpers: AssignmentFormHelpers,
  ) => void
}

export const AssignmentForm = ({
  title,
  initialValues = EMPTY,
  isSubmitting = false,
  onSubmit,
}: AssignmentFormProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { data: usersData } = useFetchUsersList()
  const { data: roomsData } = useFetchRoomsList()

  /**
   * Boshlanish bugundan oldin bo'lmasin — faqat kun cheklanadi, soat emas.
   * Tahrirlashda mavjud yozuv allaqachon boshlangan bo'lishi mumkin — u
   * holda o'sha vaqt quyi chegara bo'ladi, aks holda eski biriktirishni
   * umuman saqlab bo'lmay qolardi.
   */
  const minStart = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const existing = initialValues.starts_at

    return existing && existing < today ? existing : today
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues.starts_at])

  const form = useForm<AssignmentFormValues>({
    initialValues,
    validate: {
      user_id: isNotEmpty(t('assignments.userRequired')),
      room_id: isNotEmpty(t('assignments.roomRequired')),
      // Har bir biriktirishda vazifa bo'lishi shart: nomi ham, tavsifi ham.
      task_name: (value) =>
        value.trim() ? null : t('assignments.taskNameRequired'),
      task_description: (value) =>
        value.trim() ? null : t('assignments.taskDescriptionRequired'),
      starts_at: (value) => {
        if (!value) return t('assignments.startsRequired')
        if (value < minStart) return t('assignments.startsInFuture')
        return null
      },
      ends_at: (value, values) => {
        if (!value) return t('assignments.endsRequired')
        if (values.starts_at && value <= values.starts_at) {
          return t('assignments.endsAfterStarts')
        }
        return null
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
              <Select
                label={t('assignments.user')}
                placeholder={t('assignments.selectUser')}
                data={(usersData?.data ?? []).map((user) => ({
                  value: String(user.id),
                  label: `${getFullName(user)} · ${user.phone}`,
                }))}
                searchable
                withAsterisk
                {...form.getInputProps('user_id')}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
              <Select
                label={t('assignments.room')}
                placeholder={t('terminals.selectRoom')}
                data={(roomsData?.data ?? []).map((room) => ({
                  value: String(room.id),
                  label: getRoomLabel(room),
                }))}
                searchable
                withAsterisk
                {...form.getInputProps('room_id')}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
              <Select
                label={t('common.status')}
                data={ASSIGNMENT_STATUSES.map((value) => ({
                  value,
                  label: t(ASSIGNMENT_STATUS_KEY[value]),
                }))}
                allowDeselect={false}
                {...form.getInputProps('status')}
                onChange={(value) =>
                  form.setFieldValue(
                    'status',
                    (value as AssignmentStatus) ?? 'active',
                  )
                }
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
              <DateTimePicker
                label={t('assignments.startsAt')}
                placeholder={t('assignments.selectDateTime')}
                valueFormat="DD.MM.YYYY HH:mm"
                withAsterisk
                clearable
                minDate={minStart}
                {...form.getInputProps('starts_at')}
                onChange={(value) => {
                  form.setFieldValue('starts_at', value)

                  // Tugash boshlanishdan oldin qolib ketmasin.
                  const ends = form.values.ends_at
                  if (value && ends && ends <= value) {
                    form.setFieldValue('ends_at', null)
                  }
                }}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
              <DateTimePicker
                label={t('assignments.endsAt')}
                placeholder={
                  form.values.starts_at
                    ? t('assignments.selectDateTime')
                    : t('assignments.endsHint')
                }
                valueFormat="DD.MM.YYYY HH:mm"
                withAsterisk
                clearable
                // Boshlanish tanlanmaguncha yopiq: quyi chegara undan olinadi.
                disabled={!form.values.starts_at}
                minDate={form.values.starts_at ?? undefined}
                {...form.getInputProps('ends_at')}
              />
            </Grid.Col>
          </Grid>

          {/* Vazifa shu biriktirishning bir qismi — alohida karta emas */}
          <Divider my={28} />

          {/* Topshiriq biriktirish bilan birga yaratiladi — mavjudini ulash
              endi yo'q: umumiy topshiriqni o'chirish boshqalarnikini ham
              yo'q qilardi. */}
          <Stack gap="md">
            <TextInput
              label={t('assignments.taskName')}
              placeholder={t('assignments.taskNamePlaceholder')}
              withAsterisk
              {...form.getInputProps('task_name')}
            />

            <Textarea
              label={t('assignments.taskDescription')}
              placeholder={t('assignments.taskDescriptionPlaceholder')}
              withAsterisk
              autosize
              minRows={3}
              maxRows={8}
              {...form.getInputProps('task_description')}
            />
          </Stack>
        </Card>

        <Group justify="flex-end" gap="sm">
          <Button
            variant="default"
            size="md"
            onClick={() => navigate(ROUTES.ASSIGNMENTS)}
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
