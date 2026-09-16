import { notifyError } from '@/shared/ui/notifications'

const FORBIDDEN_MESSAGE = 'Bu amalni bajarish uchun sizda ruxsat yo’q.'

export const getForbiddenMessage = () => FORBIDDEN_MESSAGE

export const isForbiddenError = (error: unknown): boolean =>
  typeof error === 'object' &&
  error !== null &&
  (error as { forbidden?: boolean }).forbidden === true

export const notifyForbidden = () => {
  notifyError(FORBIDDEN_MESSAGE)
}
