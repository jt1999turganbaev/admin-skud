import { Alert } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import {
  useFetchUser,
  useUpdateUser,
} from '@/features/users/queries/users-queries'
import { ROUTES } from '@/shared/constants/routes'
import { getErrorMessage } from '@/shared/utils/error-message'
import { toFormErrors } from '@/shared/utils/form-errors'

import {
  needsPassword,
  UserForm,
  toFormValues,
  type UserFormHelpers,
  type UserFormValues,
} from './form'
import { UserFormSkeleton } from './form-skeleton'

export const UserEdit = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams()
  const userId = Number(id)

  const { data, isPending, error } = useFetchUser(userId)
  const { mutate, isPending: isSaving } = useUpdateUser()

  /**
   * Manzildagi id son bo'lmasa (`/edit/abc`), so'rov yuborilmaydi va
   * sahifa cheksiz skeletonda qolib ketardi — darhol xabar ko'rsatamiz.
   */
  if (!Number.isFinite(userId)) {
    return (
      <Alert color="error" radius="md">
        {t('common.notFound')}
      </Alert>
    )
  }

  if (isPending) return <UserFormSkeleton />

  if (error || !data) {
    return (
      <Alert color="error" radius="md">
        {getErrorMessage(error)}
      </Alert>
    )
  }

  const user = data.data

  const handleSubmit = (
    values: UserFormValues,
    { setErrors }: UserFormHelpers,
  ) => {
    // GET'dan kelgan `photo` — tayyor manzil, uni qaytarib yuborish
    // mumkin emas (backend base64 kutadi). Shuning uchun maydon faqat
    // o'zgarganda (yangi rasm tanlanganda yoki o'chirilganda) yuboriladi.
    const photoChanged = values.photo !== (user.photo ?? null)

    const body = {
      first_name: values.first_name,
      last_name: values.last_name,
      middle_name: values.middle_name || null,
      phone: `+998${values.phone}`,
      status: values.status,
      role: values.role,
      // Parol bo'sh bo'lsa yoki rol admin bo'lmasa yuborilmaydi.
      ...(values.password && needsPassword(values.role)
        ? { password: values.password }
        : {}),
      ...(photoChanged ? { photo: values.photo } : {}),
    }

    mutate(
      { id: userId, body },
      {
        onSuccess: () => navigate(ROUTES.USERS),
        // 422 — maydon xatolari formaning o'zida ko'rsatiladi.
        onError: (error) => setErrors(toFormErrors(error)),
      },
    )
  }

  return (
    <UserForm
      title={t('users.edit')}
      initialValues={toFormValues(user)}
      isEdit
      isSubmitting={isSaving}
      onSubmit={handleSubmit}
    />
  )
}
