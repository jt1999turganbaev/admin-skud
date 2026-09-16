import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useCreateAssignment } from '@/features/assignments/queries/assignments-queries'
import { ROUTES } from '@/shared/constants/routes'
import { toFormErrors } from '@/shared/utils/form-errors'

import {
  AssignmentForm,
  type AssignmentFormHelpers,
  type AssignmentFormValues,
} from './form'
import { toBody } from './to-body'

export const AssignmentCreate = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { mutate, isPending } = useCreateAssignment()

  const handleSubmit = (
    values: AssignmentFormValues,
    { setErrors }: AssignmentFormHelpers,
  ) => {
    mutate(toBody(values), {
      onSuccess: () => navigate(ROUTES.ASSIGNMENTS),
      // 422 — maydon xatolari formaning o'zida ko'rsatiladi.
      onError: (error) => setErrors(toFormErrors(error)),
    })
  }

  return (
    <AssignmentForm
      title={t('assignments.add')}
      isSubmitting={isPending}
      onSubmit={handleSubmit}
    />
  )
}
