import { Modal } from '@mantine/core'
import { useTranslation } from 'react-i18next'

import { ImageCropper } from './image-cropper'

interface ImageCropperModalProps {
  opened: boolean
  onClose: () => void
  /** Tanlangan faylning `blob:` manzili; `null` bo'lsa oyna bo'sh. */
  imageSrc: string | null
  onCrop: (file: File) => void
  /** Tomonlar nisbati — rasm kvadrat kesilishi uchun 1. */
  aspect?: number
  circularCrop?: boolean
}

/** Kesish oynasi — modal ko'rinishi mavzudan keladi. */
export const ImageCropperModal = ({
  opened,
  onClose,
  imageSrc,
  onCrop,
  aspect = 1,
  circularCrop = false,
}: ImageCropperModalProps) => {
  const { t } = useTranslation()

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={t('imageCropper.title')}
      size="lg"
    >
      {imageSrc && (
        <ImageCropper
          imageSrc={imageSrc}
          onCrop={onCrop}
          onCancel={onClose}
          aspect={aspect}
          circularCrop={circularCrop}
        />
      )}
    </Modal>
  )
}
