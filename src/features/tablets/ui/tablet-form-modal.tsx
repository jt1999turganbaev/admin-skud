import { useEffect } from 'react'
import { Select, TextInput } from '@mantine/core'
import { isNotEmpty, useForm } from '@mantine/form'
import { useTranslation } from 'react-i18next'

import {
  useCreateTablet,
  useUpdateTablet,
} from '@/features/tablets/queries/tablets-queries'
import {
  DEVICE_STATUS_KEY,
  DEVICE_STATUSES,
  type DeviceStatus,
  type Tablet,
} from '@/features/tablets/types'
import { useFetchTerminalsList } from '@/features/terminals/queries/terminals-queries'
import type { HTTPError } from '@/shared/types/http'
import { ResourceModal } from '@/shared/ui'
import { toFormErrors } from '@/shared/utils/form-errors'

interface TabletFormModalProps {
  opened: boolean
  onClose: () => void
  /** Berilsa — tahrirlash, bo'lmasa — qo'shish. */
  tablet?: Tablet | null
}

interface TabletFormValues {
  terminal_id: string
  device_identifier: string
  status: DeviceStatus
}

const EMPTY: TabletFormValues = {
  terminal_id: '',
  device_identifier: '',
  status: 'active',
}

export const TabletFormModal = ({
  opened,
  onClose,
  tablet,
}: TabletFormModalProps) => {
  const isEdit = Boolean(tablet)
  const { t } = useTranslation()

  const create = useCreateTablet()
  const update = useUpdateTablet()
  const { data: terminalsData } = useFetchTerminalsList()

  const form = useForm<TabletFormValues>({
    initialValues: EMPTY,
    validate: {
      terminal_id: isNotEmpty(t('tablets.terminalRequired')),
      device_identifier: isNotEmpty(t('tablets.deviceIdRequired')),
    },
  })

  useEffect(() => {
    if (!opened) return

    form.setValues(
      tablet
        ? {
            terminal_id: tablet.terminal ? String(tablet.terminal.id) : '',
            device_identifier: tablet.device_identifier,
            status: tablet.status,
          }
        : EMPTY,
    )
    form.resetDirty()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened, tablet])

  const handleSubmit = (values: TabletFormValues) => {
    const onSuccess = () => onClose()
    // 422 — maydon xatolari formaning o'zida ko'rsatiladi.
    const onError = (error: HTTPError) => form.setErrors(toFormErrors(error))
    const body = { ...values, terminal_id: Number(values.terminal_id) }

    if (tablet) update.mutate({ id: tablet.id, body }, { onSuccess, onError })
    else create.mutate(body, { onSuccess, onError })
  }

  return (
    <ResourceModal
      opened={opened}
      onClose={onClose}
      title={isEdit ? t('tablets.edit') : t('tablets.add')}
      isSubmitting={create.isPending || update.isPending}
      onSubmit={() => form.onSubmit(handleSubmit)()}
    >
      <Select
        label={t('tablets.terminal')}
        placeholder={t('tablets.selectTerminal')}
        data={(terminalsData?.data ?? []).map((terminal) => ({
          value: String(terminal.id),
          label: terminal.name,
        }))}
        searchable
        withAsterisk
        {...form.getInputProps('terminal_id')}
      />

      <TextInput
        label={t('tablets.deviceId')}
        placeholder={t('tablets.deviceIdPlaceholder')}
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
