import { useEffect } from 'react'
import { Select, TextInput } from '@mantine/core'
import { isNotEmpty, useForm } from '@mantine/form'
import { useTranslation } from 'react-i18next'

import { useFetchRoomsList } from '@/features/rooms/queries/rooms-queries'
import { getRoomLabel } from '@/features/rooms/types'
import {
  useCreateTerminal,
  useUpdateTerminal,
} from '@/features/terminals/queries/terminals-queries'
import {
  DEVICE_STATUS_KEY,
  DEVICE_STATUSES,
  DIRECTION_KEY,
  DIRECTIONS,
  type DeviceStatus,
  type Terminal,
  type TerminalDirection,
} from '@/features/terminals/types'
import type { HTTPError } from '@/shared/types/http'
import { ResourceModal } from '@/shared/ui'
import { toFormErrors } from '@/shared/utils/form-errors'

interface TerminalFormModalProps {
  opened: boolean
  onClose: () => void
  /** Berilsa — tahrirlash, bo'lmasa — qo'shish. */
  terminal?: Terminal | null
}

interface TerminalFormValues {
  room_id: string
  name: string
  direction: TerminalDirection
  device_identifier: string
  status: DeviceStatus
}

const EMPTY: TerminalFormValues = {
  room_id: '',
  name: '',
  direction: 'in',
  device_identifier: '',
  status: 'active',
}

export const TerminalFormModal = ({
  opened,
  onClose,
  terminal,
}: TerminalFormModalProps) => {
  const isEdit = Boolean(terminal)
  const { t } = useTranslation()

  const create = useCreateTerminal()
  const update = useUpdateTerminal()
  const { data: roomsData } = useFetchRoomsList()

  const form = useForm<TerminalFormValues>({
    initialValues: EMPTY,
    validate: {
      room_id: isNotEmpty(t('terminals.roomRequired')),
      name: isNotEmpty(t('terminals.nameRequired')),
      device_identifier: isNotEmpty(t('terminals.deviceIdRequired')),
    },
  })

  useEffect(() => {
    if (!opened) return

    form.setValues(
      terminal
        ? {
            room_id: terminal.room ? String(terminal.room.id) : '',
            name: terminal.name,
            direction: terminal.direction,
            device_identifier: terminal.device_identifier,
            status: terminal.status,
          }
        : EMPTY,
    )
    form.resetDirty()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened, terminal])

  const handleSubmit = (values: TerminalFormValues) => {
    const onSuccess = () => onClose()
    // 422 — maydon xatolari formaning o'zida ko'rsatiladi.
    const onError = (error: HTTPError) => form.setErrors(toFormErrors(error))
    const body = { ...values, room_id: Number(values.room_id) }

    if (terminal)
      update.mutate({ id: terminal.id, body }, { onSuccess, onError })
    else create.mutate(body, { onSuccess, onError })
  }

  return (
    <ResourceModal
      opened={opened}
      onClose={onClose}
      title={isEdit ? t('terminals.edit') : t('terminals.add')}
      isSubmitting={create.isPending || update.isPending}
      onSubmit={() => form.onSubmit(handleSubmit)()}
    >
      <Select
        label={t('terminals.room')}
        placeholder={t('terminals.selectRoom')}
        data={(roomsData?.data ?? []).map((room) => ({
          value: String(room.id),
          label: getRoomLabel(room),
        }))}
        searchable
        withAsterisk
        {...form.getInputProps('room_id')}
      />

      <TextInput
        label={t('terminals.name')}
        placeholder={t('terminals.namePlaceholder')}
        withAsterisk
        {...form.getInputProps('name')}
      />

      <Select
        label={t('terminals.direction')}
        data={DIRECTIONS.map((value) => ({
          value,
          label: t(DIRECTION_KEY[value]),
        }))}
        allowDeselect={false}
        withAsterisk
        {...form.getInputProps('direction')}
        onChange={(value) =>
          form.setFieldValue('direction', (value as TerminalDirection) ?? 'in')
        }
      />

      <TextInput
        label={t('terminals.deviceId')}
        placeholder={t('terminals.deviceIdPlaceholder')}
        withAsterisk
        {...form.getInputProps('device_identifier')}
      />

      <Select
        label={t('common.status')}
        data={DEVICE_STATUSES.map((value) => ({
          value,
          label: t(DEVICE_STATUS_KEY[value]),
        }))}
        allowDeselect={false}
        {...form.getInputProps('status')}
        onChange={(value) =>
          form.setFieldValue('status', (value as DeviceStatus) ?? 'active')
        }
      />
    </ResourceModal>
  )
}
