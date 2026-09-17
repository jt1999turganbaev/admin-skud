import {
  Button,
  Card,
  Grid,
  Group,
  PasswordInput,
  Select,
  Stack,
  Switch,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { hasLength, isNotEmpty, useForm } from '@mantine/form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { USER_ROLE_KEY, USER_ROLES, type UserRole } from '@/features/auth/types'
import {
  USER_STATUS_KEY,
  USER_STATUSES,
  type User,
  type UserStatus,
} from '@/features/users/types'
import { ROUTES } from '@/shared/constants/routes'
import { PhoneInput } from '@/shared/ui'
import { toLocalPhone } from '@/shared/utils/format-phone'

import { PhotoField } from './photo-field'

/** Formada telefon 998siz saqlanadi, yuborishda "+998" qo'shiladi. */
export interface UserFormValues {
  first_name: string
  last_name: string
  middle_name: string
  phone: string
  password: string
  /** Mavjud rasm manzili yoki yangi tanlangan `data:image/...;base64,` satri. */
  photo: string | null
  status: UserStatus
  role: UserRole
  is_top: boolean
}

const EMPTY: UserFormValues = {
  first_name: '',
  last_name: '',
  middle_name: '',
  phone: '',
  password: '',
  photo: null,
  status: 'active',
  role: 'user',
  is_top: false,
}

/** Tahrirlashda mavjud yozuvni forma qiymatlariga o'giradi. */
export const toFormValues = (user: User): UserFormValues => ({
  first_name: user.first_name,
  last_name: user.last_name,
  middle_name: user.middle_name ?? '',
  phone: toLocalPhone(user.phone),
  password: '',
  photo: user.photo ?? null,
  status: user.status,
  role: user.role,
  is_top: Boolean(user.is_top),
})

/** Backend 422 javobini maydonlarga qo'yish uchun forma bilan aloqa. */
export interface UserFormHelpers {
  setErrors: (errors: Record<string, string>) => void
}

interface UserFormProps {
  title: string
  initialValues?: UserFormValues
  /** Tahrirlashda parol ixtiyoriy — bo'sh qoldirilsa o'zgarmaydi. */
  isEdit?: boolean
  isSubmitting?: boolean
  onSubmit: (values: UserFormValues, helpers: UserFormHelpers) => void
}

export const UserForm = ({
  title,
  initialValues = EMPTY,
  isEdit = false,
  isSubmitting = false,
  onSubmit,
}: UserFormProps) => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const roleOptions = USER_ROLES.map((value) => ({
    value,
    label: t(USER_ROLE_KEY[value]),
  }))

  const form = useForm<UserFormValues>({
    initialValues,
    validate: {
      first_name: isNotEmpty(t('users.firstNameRequired')),
      last_name: isNotEmpty(t('users.lastNameRequired')),
      phone: hasLength({ min: 9 }, t('auth.phoneRequired')),
      // Oddiy foydalanuvchi tizimga kirmaydi — parol so'ralmaydi.
      password: (value, values) =>
        isEdit || values.role === 'user' || value.length >= 8
          ? null
          : t('users.passwordMin'),
    },
  })

  return (
    <form
      onSubmit={form.onSubmit((values) =>
        onSubmit(values, { setErrors: form.setErrors }),
      )}
      noValidate
    >
      {/* Keng ekranda maydon cho'zilib ketmasin deb ustunlar soni oshadi:
          sm — 2 ta, lg — 3 ta, xl — 4 ta. Forma kengligi cheklanmaydi,
          shuning uchun o'ng tomonda bo'sh joy qolmaydi. */}
      <Stack gap={32}>
        <Card>
          <Title order={4} fz="md" mb="lg">
            {title}
          </Title>

          <Grid gutter="md">
            <Grid.Col span={12}>
              <PhotoField
                value={form.values.photo}
                onChange={(photo) => form.setFieldValue('photo', photo)}
                error={form.errors.photo as string | undefined}
                onError={(message) => form.setFieldError('photo', message)}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6, lg: 4, xl: 3 }}>
              <TextInput
                label={t('users.lastName')}
                placeholder={t('users.lastNamePlaceholder')}
                withAsterisk
                {...form.getInputProps('last_name')}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6, lg: 4, xl: 3 }}>
              <TextInput
                label={t('users.firstName')}
                placeholder={t('users.firstNamePlaceholder')}
                withAsterisk
                {...form.getInputProps('first_name')}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6, lg: 4, xl: 3 }}>
              <TextInput
                label={t('users.middleName')}
                placeholder={t('users.middleNamePlaceholder')}
                {...form.getInputProps('middle_name')}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6, lg: 4, xl: 3 }}>
              <PhoneInput
                label={t('users.phone')}
                withAsterisk
                value={form.values.phone}
                onChange={(phone) => form.setFieldValue('phone', phone)}
                error={form.errors.phone}
              />
            </Grid.Col>
          </Grid>
        </Card>

        <Card>
          <Title order={4} fz="md" mb="lg">
            {t('users.account')}
          </Title>

          <Grid gutter="md">
            <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
              <Select
                label={t('users.role')}
                data={roleOptions}
                allowDeselect={false}
                {...form.getInputProps('role')}
                onChange={(value) =>
                  form.setFieldValue('role', (value as UserRole) ?? 'user')
                }
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
              <Select
                label={t('common.status')}
                data={USER_STATUSES.map((value) => ({
                  value,
                  label: t(USER_STATUS_KEY[value]),
                }))}
                allowDeselect={false}
                {...form.getInputProps('status')}
                onChange={(value) =>
                  form.setFieldValue(
                    'status',
                    (value as UserStatus) ?? 'active',
                  )
                }
              />
            </Grid.Col>

            {form.values.role !== 'user' && (
              <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
                <PasswordInput
                  label={t('users.password')}
                  placeholder={
                    isEdit
                      ? t('users.passwordKeep')
                      : t('users.passwordPlaceholder')
                  }
                  withAsterisk={!isEdit}
                  {...form.getInputProps('password')}
                />
                {isEdit && (
                  <Text size="xs" c="dimmed" mt={6}>
                    {t('users.passwordHint')}
                  </Text>
                )}
              </Grid.Col>
            )}

            <Grid.Col span={12}>
              <Switch
                label={t('users.isTop')}
                {...form.getInputProps('is_top', { type: 'checkbox' })}
              />
            </Grid.Col>
          </Grid>
        </Card>

        <Group justify="flex-end" gap="sm">
          <Button
            variant="default"
            size="md"
            onClick={() => navigate(ROUTES.USERS)}
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
