import { Alert } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import {
  useFetchRoom,
  useUpdateRoom,
} from '@/features/rooms/queries/rooms-queries'
import { ROUTES } from '@/shared/constants/routes'
import { getErrorMessage } from '@/shared/utils/error-message'
import { toFormErrors } from '@/shared/utils/form-errors'

import {
  RoomForm,
  toBody,
  toFormValues,
  type RoomFormHelpers,
  type RoomFormValues,
} from './form'
import { RoomFormSkeleton } from './form-skeleton'

export const RoomEdit = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams()
  const roomId = Number(id)

  const { data, isPending, error } = useFetchRoom(roomId)
  const { mutate, isPending: isSaving } = useUpdateRoom()

  /**
   * Manzildagi id son bo'lmasa (`/edit/abc`), so'rov yuborilmaydi va
   * sahifa cheksiz skeletonda qolib ketardi — darhol xabar ko'rsatamiz.
   */
  if (!Number.isFinite(roomId)) {
    return (
      <Alert color="error" radius="md">
        {t('common.notFound')}
      </Alert>
    )
  }

  if (isPending) return <RoomFormSkeleton />

  if (error || !data) {
    return (
      <Alert color="error" radius="md">
        {getErrorMessage(error)}
      </Alert>
    )
  }

  const room = data.data

  const handleSubmit = (
    values: RoomFormValues,
    { setErrors }: RoomFormHelpers,
  ) => {
    mutate(
      // Topshiriq maydonlari tozalansa, xonadagi topshiriq olib tashlanadi.
      { id: roomId, body: toBody(values, Boolean(room.task)) },
      {
        onSuccess: () => navigate(ROUTES.ROOMS),
        // 422 — maydon xatolari formaning o'zida ko'rsatiladi.
        onError: (error) => setErrors(toFormErrors(error)),
      },
    )
  }

  return (
    <RoomForm
      title={t('rooms.edit')}
      initialValues={toFormValues(room)}
      isSubmitting={isSaving}
      onSubmit={handleSubmit}
    />
  )
}
