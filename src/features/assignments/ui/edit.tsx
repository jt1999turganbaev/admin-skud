import { Alert } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import {
  useFetchAssignment,
  useUpdateAssignment,
} from '@/features/assignments/queries/assignments-queries'
import { ROUTES } from '@/shared/constants/routes'
import { getErrorMessage } from '@/shared/utils/error-message'
import { toFormErrors } from '@/shared/utils/form-errors'

import {
  AssignmentForm,
  toFormValues,
  type AssignmentFormHelpers,
  type AssignmentFormValues,
} from './form'
import { AssignmentFormSkeleton } from './form-skeleton'
import { toBody } from './to-body'

export const AssignmentEdit = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams()
  const assignmentId = Number(id)

  const { data, isPending, error } = useFetchAssignment(assignmentId)
  const { mutate, isPending: isSaving } = useUpdateAssignment()

  /**
   * Manzildagi id son bo'lmasa (`/edit/abc`), so'rov yuborilmaydi va
   * sahifa cheksiz skeletonda qolib ketardi — darhol xabar ko'rsatamiz.
   */
  if (!Number.isFinite(assignmentId)) {
    return (
      <Alert color="error" radius="md">
        {t('common.notFound')}
      </Alert>
    )
  }

  if (isPending) return <AssignmentFormSkeleton />

  if (error || !data) {
    return (
      <Alert color="error" radius="md">
        {getErrorMessage(error)}
      </Alert>
    )
  }

  const assignment = data.data

  const handleSubmit = (
    values: AssignmentFormValues,
    { setErrors }: AssignmentFormHelpers,
  ) => {
    mutate(
      { id: assignmentId, body: toBody(values) },
      {
        onSuccess: () => navigate(ROUTES.ASSIGNMENTS),
        // 422 — maydon xatolari formaning o'zida ko'rsatiladi.
        onError: (error) => setErrors(toFormErrors(error)),
      },
    )
  }

  return (
    <AssignmentForm
      title={t('assignments.edit')}
      initialValues={toFormValues(assignment)}
      isSubmitting={isSaving}
      onSubmit={handleSubmit}
    />
  )
}
