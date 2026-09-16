import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useCreateUser } from '@/features/users/queries/users-queries'
import { ROUTES } from '@/shared/constants/routes'
import { toFormErrors } from '@/shared/utils/form-errors'

import { UserForm, type UserFormHelpers, type UserFormValues } from './form'

export const UserCreate = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { mutate, isPending } = useCreateUser()

  const handleSubmit = (
    values: UserFormValues,
    { setErrors }: UserFormHelpers,
  ) => {
    mutate(
      {
        first_name: values.first_name,
        last_name: values.last_name,
        middle_name: values.middle_name || null,
        phone: `+998${values.phone}`,
        // Oddiy foydalanuvchi uchun parol yuborilmaydi.
        ...(values.role !== 'user' ? { password: values.password } : {}),
        status: values.status,
        role: values.role,
        // Backend base64 kutadi; tanlanmagan bo'lsa yuborilmaydi.
        ...(values.photo ? { photo: values.photo } : {}),
      },
      {
        onSuccess: () => navigate(ROUTES.USERS),
        // 422 — maydon xatolari formaning o'zida ko'rsatiladi.
        onError: (error) => setErrors(toFormErrors(error)),
      },
    )
  }

  return (
    <UserForm
      title={t('users.add')}
      isSubmitting={isPending}
      onSubmit={handleSubmit}
    />
  )
}
