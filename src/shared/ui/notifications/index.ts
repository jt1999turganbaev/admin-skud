import { notifications } from '@mantine/notifications'

export { notifications }

/** Takrorlanadigan bildirishnomalar uchun qisqa yordamchilar. */
export const notifySuccess = (message: string, title = 'Bajarildi') =>
  notifications.show({ color: 'brand', title, message })

export const notifyError = (message: string, title = 'Xatolik') =>
  notifications.show({ color: 'error', title, message })

export const notifyWarning = (message: string) =>
  notifications.show({ color: 'warning', message })

export const notifySessionExpired = () =>
  notifications.show({
    color: 'warning',
    message: 'Sessiya muddati tugadi. Qaytadan kiring.',
  })
