import { useEffect } from 'react'
import { NumberInput, Select, TextInput } from '@mantine/core'
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
import { LANGUAGES } from '@/shared/config/languages'
import type { HTTPError } from '@/shared/types/http'
import { EMPTY_TRANSLATABLE, toTranslatable } from '@/shared/types/translatable'
import { ResourceModal } from '@/shared/ui'
import { toFormErrors } from '@/shared/utils/form-errors'

interface RoomFormModalProps {
  opened: boolean
  onClose: () => void
  /** Berilsa — tahrirlash, bo'lmasa — qo'shish. */
  room?: Room | null
}

/**
 * `NumberInput` son yoki bo'sh bo'lsa `''` beradi. Backend satr kutadi —
 * yuborishda satrga o'giriladi.
 */
type RoomFormValues = Omit<RoomCreateBody, 'number_station'> & {
  number_station: number | string
}

const EMPTY: RoomFormValues = {
  name: EMPTY_TRANSLATABLE,
  number: '',
  number_station: '',
  status: 'active',
}

export const RoomFormModal = ({
  opened,
  onClose,
  room,
}: RoomFormModalProps) => {
  const isEdit = Boolean(room)
  const { t } = useTranslation()

  const create = useCreateRoom()
  const update = useUpdateRoom()

  const form = useForm<RoomFormValues>({
    initialValues: EMPTY,
    validate: {
      // Nom ikkala tilda majburiy.
      name: {
        uz: isNotEmpty(t('rooms.nameRequired')),
        qr: isNotEmpty(t('rooms.nameRequired')),
      },
      number: isNotEmpty(t('rooms.numberRequired')),
      number_station: (value) =>
        value === '' ? t('rooms.numberStationRequired') : null,
    },
  })

  // Oyna ochilganda tahrirlanayotgan yozuv bilan to'ldiriladi.
  useEffect(() => {
    if (!opened) return

    form.setValues(
      room
        ? {
            // Javobdagi `name` — faqat tanlangan til; formaga ikkalasi kerak.
            name: toTranslatable(room.translations?.name),
            number: room.number,
            number_station: room.number_station ?? '',
            status: room.status,
          }
        : EMPTY,
    )
    form.resetDirty()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened, room])

  const handleSubmit = (values: RoomFormValues) => {
    const body: RoomCreateBody = {
      ...values,
      name: { uz: values.name.uz.trim(), qr: values.name.qr.trim() },
      // Validatsiyadan o'tgan — bo'sh emas.
      number_station: String(values.number_station),
    }
    const onSuccess = () => onClose()
    // 422 — maydon xatolari formaning o'zida ko'rsatiladi.
    const onError = (error: HTTPError) => form.setErrors(toFormErrors(error))

    if (room) update.mutate({ id: room.id, body }, { onSuccess, onError })
    else create.mutate(body, { onSuccess, onError })
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

      <NumberInput
        label={t('rooms.numberStation')}
        placeholder={t('rooms.numberStationPlaceholder')}
        allowDecimal={false}
        allowNegative={false}
        hideControls
        withAsterisk
        {...form.getInputProps('number_station')}
      />

      {LANGUAGES.map((language) => (
        <TextInput
          key={language.code}
          label={`${t('rooms.name')} (${language.label})`}
          placeholder={t('rooms.namePlaceholder')}
          withAsterisk
          {...form.getInputProps(`name.${language.code}`)}
        />
      ))}

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
