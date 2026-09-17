import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useCreateRoom } from '@/features/rooms/queries/rooms-queries'
import { ROUTES } from '@/shared/constants/routes'
import { toFormErrors } from '@/shared/utils/form-errors'

import {
  RoomForm,
  toBody,
  type RoomFormHelpers,
  type RoomFormValues,
} from './form'

export const RoomCreate = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { mutate, isPending } = useCreateRoom()

  const handleSubmit = (
    values: RoomFormValues,
    { setErrors }: RoomFormHelpers,
  ) => {
    mutate(toBody(values), {
      onSuccess: () => navigate(ROUTES.ROOMS),
      // 422 — maydon xatolari formaning o'zida ko'rsatiladi.
      onError: (error) => setErrors(toFormErrors(error)),
    })
  }

  return (
    <RoomForm
      title={t('rooms.add')}
      isSubmitting={isPending}
      onSubmit={handleSubmit}
    />
  )
}
