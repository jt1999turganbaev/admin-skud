import { useEffect } from 'react'
import { Select, TextInput } from '@mantine/core'
import { isNotEmpty, useForm } from '@mantine/form'
import { useTranslation } from 'react-i18next'

import {
  useCreateRoom,
  useUpdateRoom,
} from '@/features/rooms/queries/rooms-queries'
import {
  ROOM_STATUS_KEY,
  ROOM_STATUSES,
  type Room,
  type RoomCreateBody,
  type RoomStatus,
} from '@/features/rooms/types'
import type { HTTPError } from '@/shared/types/http'
import { ResourceModal } from '@/shared/ui'
import { toFormErrors } from '@/shared/utils/form-errors'

interface RoomFormModalProps {
  opened: boolean
  onClose: () => void
  /** Berilsa — tahrirlash, bo'lmasa — qo'shish. */
  room?: Room | null
}

const EMPTY: RoomCreateBody = { name: '', number: '', status: 'active' }

export const RoomFormModal = ({
  opened,
  onClose,
  room,
}: RoomFormModalProps) => {
  const isEdit = Boolean(room)
  const { t } = useTranslation()

  const create = useCreateRoom()
  const update = useUpdateRoom()

  const form = useForm<RoomCreateBody>({
    initialValues: EMPTY,
    validate: {
      name: isNotEmpty(t('rooms.nameRequired')),
      number: isNotEmpty(t('rooms.numberRequired')),
    },
  })

  // Oyna ochilganda tahrirlanayotgan yozuv bilan to'ldiriladi.
  useEffect(() => {
    if (!opened) return

    form.setValues(
      room
        ? { name: room.name, number: room.number, status: room.status }
        : EMPTY,
    )
    form.resetDirty()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened, room])

  const handleSubmit = (values: RoomCreateBody) => {
    const onSuccess = () => onClose()
    // 422 — maydon xatolari formaning o'zida ko'rsatiladi.
    const onError = (error: HTTPError) => form.setErrors(toFormErrors(error))

    if (room)
      update.mutate({ id: room.id, body: values }, { onSuccess, onError })
    else create.mutate(values, { onSuccess, onError })
  }

  return (
    <ResourceModal
      opened={opened}
      onClose={onClose}
      title={isEdit ? t('rooms.edit') : t('rooms.add')}
      isSubmitting={create.isPending || update.isPending}
      onSubmit={() => form.onSubmit(handleSubmit)()}
    >
      <TextInput
        label={t('rooms.number')}
        placeholder={t('rooms.numberPlaceholder')}
        withAsterisk
        {...form.getInputProps('number')}
      />

      <TextInput
        label={t('rooms.name')}
        placeholder={t('rooms.namePlaceholder')}
        withAsterisk
        {...form.getInputProps('name')}
      />

      <Select
        label={t('common.status')}
        data={ROOM_STATUSES.map((value) => ({
          value,
          label: t(ROOM_STATUS_KEY[value]),
        }))}
        allowDeselect={false}
        {...form.getInputProps('status')}
        onChange={(value) =>
          form.setFieldValue('status', (value as RoomStatus) ?? 'active')
        }
      />
    </ResourceModal>
  )
}
