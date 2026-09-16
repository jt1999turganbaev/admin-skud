import {
  Button,
  FileButton,
  Group,
  Input,
  Modal,
  Stack,
  Text,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconPhotoPlus, IconTrash, IconZoomIn } from '@tabler/icons-react'
import { useEffect, useState, type DragEvent } from 'react'
import { useTranslation } from 'react-i18next'

import { ImageCropperModal } from '@/shared/ui'
import { resolvePhotoSrc } from '@/shared/utils/photo'

import styles from './photo-field.module.css'

/**
 * Backend `photo` ni base64 sifatida kutadi (`AdminUserCreateRequest`):
 * ixtiyoriy `data:image/...;base64,` prefiksi bilan, png/jpeg/webp.
 *
 * DIQQAT: backend `maxLength` = 2 800 000 belgi, ya'ni ~2 MB rasm. Bu
 * yerdagi 5 MB chegara buyurtmaga ko'ra qo'yilgan — 2 MB dan katta rasm
 * yuborilsa, backend 422 bilan rad etadi (limit o'sha tomonda ham
 * oshirilishi kerak).
 */
const ACCEPTED = ['image/png', 'image/jpeg', 'image/webp']
const MIN_BYTES = 240 * 1024
const MAX_BYTES = 5 * 1024 * 1024

const toDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })

interface PhotoFieldProps {
  /** Mavjud rasm manzili yoki yangi tanlangan `data:image/...` satri. */
  value: string | null
  onChange: (value: string | null) => void
  /** Forma xatosi — mahalliy tekshiruv yoki backend 422 javobidan. */
  error?: string | null
  /** Mahalliy tekshiruv xatosi shu orqali formaga uzatiladi. */
  onError?: (message: string) => void
}

export const PhotoField = ({
  value,
  onChange,
  error,
  onError,
}: PhotoFieldProps) => {
  const { t } = useTranslation()
  // Serverdan kelgan rasm prefikssiz base64 bo'lishi mumkin.
  const preview = resolvePhotoSrc(value)
  const [isDragging, setIsDragging] = useState(false)
  const [zoomOpened, zoom] = useDisclosure(false)
  /** Kesish oynasiga uzatiladigan `blob:` manzil. */
  const [source, setSource] = useState<string | null>(null)

  // `blob:` manzil brauzer xotirasida qoladi — oyna yopilganda bo'shatiladi.
  useEffect(() => {
    if (!source) return
    return () => URL.revokeObjectURL(source)
  }, [source])

  const closeCropper = () => setSource(null)

  /** Tanlangan fayl tekshiriladi va kesish oynasiga uzatiladi. */
  const handleSelect = (file: File | null) => {
    if (!file) return

    if (!ACCEPTED.includes(file.type)) {
      onError?.(t('users.photoTypeError'))
      return
    }

    if (file.size < MIN_BYTES) {
      onError?.(t('users.photoMinError'))
      return
    }

    if (file.size > MAX_BYTES) {
      onError?.(t('users.photoMaxError'))
      return
    }

    setSource(URL.createObjectURL(file))
  }

  /**
   * Kesilgan rasm. Hajm faqat yuqori chegara bo'yicha tekshiriladi:
   * kesishdan keyin rasm kichrayadi, quyi chegara esa asl faylga qo'yilgan.
   */
  const handleCrop = async (file: File) => {
    closeCropper()

    if (file.size > MAX_BYTES) {
      onError?.(t('users.photoMaxError'))
      return
    }

    try {
      // Muvaffaqiyatli tanlov oldingi xatoni bekor qiladi.
      onChange(await toDataUrl(file))
    } catch {
      onError?.(t('users.photoReadError'))
    }
  }

  const handleDrop = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setIsDragging(false)
    void handleSelect(event.dataTransfer.files?.[0] ?? null)
  }

  return (
    // Yorliq boshqa maydonlar bilan bir xil ko'rinishi uchun `Input.Wrapper`.
    <Input.Wrapper label={t('users.photo')} error={error}>
      {value ? (
        <Group gap="md" wrap="nowrap" align="flex-start">
          <button
            type="button"
            className={styles.preview}
            onClick={zoom.open}
            aria-label={t('users.photoZoom')}
          >
            <img src={preview ?? undefined} alt="" />
            <span className={styles.overlay}>
              <IconZoomIn size={24} stroke={2} />
            </span>
          </button>

          <Stack gap={8}>
            <Group gap="xs">
              <FileButton onChange={handleSelect} accept={ACCEPTED.join(',')}>
                {(props) => (
                  <Button
                    {...props}
                    variant="default"
                    size="xs"
                    leftSection={<IconPhotoPlus size={16} />}
                  >
                    {t('users.photoReplace')}
                  </Button>
                )}
              </FileButton>

              <Button
                variant="subtle"
                color="error"
                size="xs"
                leftSection={<IconTrash size={16} />}
                onClick={() => onChange(null)}
              >
                {t('common.delete')}
              </Button>
            </Group>

            <Text size="xs" c="dimmed">
              {t('users.photoHint')}
            </Text>
            <Text size="xs" c="dimmed">
              {t('users.photoZoomHint')}
            </Text>
          </Stack>
        </Group>
      ) : (
        <FileButton onChange={handleSelect} accept={ACCEPTED.join(',')}>
          {(props) => (
            <button
              {...props}
              type="button"
              className={styles.dropzone}
              data-dragging={isDragging || undefined}
              onDragOver={(event) => {
                event.preventDefault()
                setIsDragging(true)
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <span className={styles.dropIcon}>
                <IconPhotoPlus size={22} stroke={2} />
              </span>
              <span className={styles.dropTitle}>{t('users.photoDrop')}</span>
              <span className={styles.dropHint}>{t('users.photoHint')}</span>
            </button>
          )}
        </FileButton>
      )}

      {/* Rasm kvadrat (1:1) kesiladi — avatar hamma joyda bir xil bo'lsin */}
      <ImageCropperModal
        opened={Boolean(source)}
        onClose={closeCropper}
        imageSrc={source}
        onCrop={handleCrop}
        aspect={1}
      />

      <Modal
        opened={zoomOpened}
        onClose={zoom.close}
        title={t('users.photo')}
        size="auto"
        padding="md"
      >
        {preview && <img src={preview} alt="" className={styles.full} />}
      </Modal>
    </Input.Wrapper>
  )
}
