import { useCallback, useEffect, useRef, useState } from 'react'
import { Button, Group, Stack, Text } from '@mantine/core'
import { IconCrop } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type Crop,
  type PixelCrop,
} from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

import styles from './image-cropper.module.css'

interface ImageCropperProps {
  /** Tanlangan faylning `blob:` yoki `data:` manzili. */
  imageSrc: string
  onCrop: (file: File) => void
  onCancel: () => void
  /** Tomonlar nisbati. Rasm kvadrat kesilishi kerak — shuning uchun 1. */
  aspect?: number
  circularCrop?: boolean
}

/** Boshlang'ich tanlov — rasm markazida, kengligining 90% i. */
const centerAspectCrop = (width: number, height: number, aspect: number) =>
  centerCrop(
    makeAspectCrop({ unit: '%', width: 90 }, aspect, width, height),
    width,
    height,
  )

export const ImageCropper = ({
  imageSrc,
  onCrop,
  onCancel,
  aspect = 1,
  circularCrop = false,
}: ImageCropperProps) => {
  const { t } = useTranslation()
  const imageRef = useRef<HTMLImageElement>(null)
  const previewRef = useRef<HTMLCanvasElement>(null)
  const [crop, setCrop] = useState<Crop>()
  const [completed, setCompleted] = useState<PixelCrop>()

  // Tanlangan qism kichik canvas'da jonli ko'rinib turadi
  useEffect(() => {
    const canvas = previewRef.current
    const image = imageRef.current
    if (!canvas || !image || !completed?.width || !completed?.height) return

    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height

    canvas.width = Math.round(completed.width * scaleX)
    canvas.height = Math.round(completed.height * scaleY)

    const context = canvas.getContext('2d')
    if (!context) return

    context.clearRect(0, 0, canvas.width, canvas.height)
    context.drawImage(
      image,
      completed.x * scaleX,
      completed.y * scaleY,
      completed.width * scaleX,
      completed.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height,
    )
  }, [completed])

  const handleImageLoad = useCallback(
    (event: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = event.currentTarget
      const initial = centerAspectCrop(width, height, aspect)
      setCrop(initial)

      // `onComplete` faqat foydalanuvchi harakatidan keyin ishlaydi —
      // boshlang'ich tanlovni o'zimiz yozamiz, shunda "Kesish" darrov tayyor.
      setCompleted({
        unit: 'px',
        x: ((initial.x ?? 0) / 100) * width,
        y: ((initial.y ?? 0) / 100) * height,
        width: ((initial.width ?? 0) / 100) * width,
        height: ((initial.height ?? 0) / 100) * height,
      })
    },
    [aspect],
  )

  const handleSave = () => {
    const image = imageRef.current
    if (!image || !completed?.width || !completed?.height) return

    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height

    const canvas = document.createElement('canvas')
    canvas.width = Math.round(completed.width * scaleX)
    canvas.height = Math.round(completed.height * scaleY)

    const context = canvas.getContext('2d')
    if (!context) return

    context.drawImage(
      image,
      completed.x * scaleX,
      completed.y * scaleY,
      completed.width * scaleX,
      completed.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height,
    )

    canvas.toBlob(
      (blob) => {
        if (blob) onCrop(new File([blob], 'photo.jpg', { type: 'image/jpeg' }))
      },
      'image/jpeg',
      0.9,
    )
  }

  const image = imageRef.current
  const size = completed?.width
    ? `${Math.round(completed.width * ((image?.naturalWidth ?? 0) / (image?.width || 1)))}×${Math.round(
        completed.height * ((image?.naturalHeight ?? 0) / (image?.height || 1)),
      )} px`
    : null

  return (
    <Stack gap={14}>
      <Text size="sm" c="dimmed" ta="center">
        {t('imageCropper.hint')}
      </Text>

      <div className={styles.workspace}>
        <div className={styles.stage}>
          <ReactCrop
            className={styles.cropper}
            crop={crop}
            onChange={(next) => setCrop(next)}
            onComplete={(next) => setCompleted(next)}
            aspect={aspect}
            circularCrop={circularCrop}
            ruleOfThirds
            keepSelection
            minWidth={40}
          >
            <img
              ref={imageRef}
              src={imageSrc}
              alt={t('imageCropper.title')}
              onLoad={handleImageLoad}
              className={styles.image}
              draggable={false}
            />
          </ReactCrop>
        </div>

        <div className={styles.preview}>
          <span className={styles.previewLabel}>
            {t('imageCropper.result')}
          </span>
          <div
            className={styles.previewFrame}
            style={circularCrop ? { borderRadius: '50%' } : undefined}
          >
            <canvas ref={previewRef} className={styles.previewCanvas} />
          </div>
          {size && <span className={styles.previewSize}>{size}</span>}
        </div>
      </div>

      <Group gap="sm" justify="flex-end">
        <Button variant="default" onClick={onCancel}>
          {t('common.cancel')}
        </Button>
        <Button
          disabled={!completed?.width}
          leftSection={<IconCrop size={18} />}
          onClick={handleSave}
        >
          {t('imageCropper.save')}
        </Button>
      </Group>
    </Stack>
  )
}
