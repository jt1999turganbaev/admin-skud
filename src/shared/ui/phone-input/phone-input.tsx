import {
  useEffect,
  useRef,
  type ClipboardEvent,
  type FocusEvent,
  type MouseEvent,
  type SyntheticEvent,
} from 'react'
import { TextInput, type TextInputProps } from '@mantine/core'
import { PatternFormat } from 'react-number-format'

/** Maydon ko'rinishi. `#` — raqam kataklari. */
const FORMAT = '+998 ## ### ## ##'

/** "+998 " — o'zgarmas prefiks, kursor undan chapga o'tmasligi kerak. */
const PREFIX_LENGTH = 5

/** Har bir raqam katagining indeksi. */
const SLOTS = [...FORMAT].flatMap((char, index) =>
  char === '#' ? [index] : [],
)

/**
 * Kursorning eng o'ng ruxsat etilgan joyi — keyingi bo'sh raqam katagi.
 *
 * `allowEmptyFormatting` + `mask=" "` bo'sh kataklarni bo'shliq bilan
 * chizadi, ya'ni satrning o'zidan qaysi bo'shliq ajratgich, qaysi bo'sh
 * katak ekanini bilib bo'lmaydi. Shuning uchun joy qiymatdan emas, format
 * shablonidan olinadi: nechta raqam kiritilgan bo'lsa, shunchasidan keyingi
 * katak. "+998 90" dan keyin kursor ajratgichdan o'tib turadi — keyingi
 * raqam aynan shu yerga yoziladi.
 */
const caretPosition = (display: string) => {
  const typed = display.slice(PREFIX_LENGTH).replace(/\D/g, '').length

  return typed >= SLOTS.length ? FORMAT.length : SLOTS[typed]
}

const placeCaret = (input: HTMLInputElement) => {
  // Brauzer kursorni hodisadan keyin qo'yadi, shuning uchun keyingi kadrda.
  requestAnimationFrame(() => {
    if (document.activeElement !== input) return
    const position = caretPosition(input.value)
    input.setSelectionRange(position, position)
  })
}

/**
 * Kursor har safar siljiganda uni ruxsat etilgan oraliqqa qaytaradi:
 * prefiksdan keyin va oxirgi raqamdan oldin.
 *
 * `placeCaret` yolg'iz yetmaydi: react-number-format fokusda kursorni o'zi
 * `setTimeout` bilan (ba'zan ikki marta) qayta qo'yadi va bizning joyimizni
 * bosib ketadi. `mask=" "` bo'lgani uchun u bo'sh kataklarni ham to'g'ri joy
 * deb hisoblaydi — natijada kursor "+998" dan ancha o'ngda, bo'shliqlar
 * orasida qolib ketardi (ayniqsa `autoFocus` bilan sahifa ochilganda).
 * `onSelect` har qanday siljishda ishlaydi, shuning uchun poyga yo'q.
 */
const clampCaret = (event: SyntheticEvent<HTMLInputElement>) => {
  const input = event.currentTarget
  const { selectionStart, selectionEnd } = input

  // Matn belgilangan bo'lsa — foydalanuvchi ataylab qilgan, tegmaymiz.
  if (selectionStart === null || selectionStart !== selectionEnd) return

  const max = caretPosition(input.value)
  const position = Math.min(Math.max(selectionStart, PREFIX_LENGTH), max)

  if (position !== selectionStart) input.setSelectionRange(position, position)
}

interface PhoneInputProps extends Omit<
  TextInputProps,
  'value' | 'onChange' | 'defaultValue' | 'type'
> {
  /** 998siz lokal qism (9 raqam). */
  value: string
  onChange: (localPhone: string) => void
}

/**
 * O'zbekiston telefon raqami uchun maydon. Tashqariga faqat 998siz lokal
 * qismni beradi — "+998" ko'rinishda qoladi.
 */
export const PhoneInput = ({
  value,
  onChange,
  autoFocus,
  ...props
}: PhoneInputProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null)

  // `autoFocus` atributi react-number-format formatlashidan oldin ishlab
  // ketadi — fokusni o'zimiz, maydon to'liq chizilgandan keyin beramiz.
  useEffect(() => {
    if (!autoFocus) return
    const timer = window.setTimeout(() => inputRef.current?.focus(), 0)
    return () => window.clearTimeout(timer)
  }, [autoFocus])

  return (
    <PatternFormat
      getInputRef={inputRef}
      format={FORMAT}
      mask=" "
      allowEmptyFormatting
      customInput={TextInput}
      inputMode="tel"
      autoComplete="tel"
      value={value}
      onValueChange={(values) => onChange(values.value)}
      onFocus={(event: FocusEvent<HTMLInputElement>) =>
        placeCaret(event.currentTarget)
      }
      onClick={(event: MouseEvent<HTMLInputElement>) =>
        placeCaret(event.currentTarget)
      }
      onSelect={clampCaret}
      onPaste={(event: ClipboardEvent<HTMLInputElement>) => {
        // "+998 90 123 45 67", "998901234567", "90 123 45 67" — hammasi ishlasin.
        event.preventDefault()
        const digits = event.clipboardData.getData('text').replace(/\D/g, '')
        const local =
          digits.length > 9 && digits.startsWith('998')
            ? digits.slice(3)
            : digits

        onChange(local.slice(0, 9))
      }}
      {...props}
    />
  )
}
