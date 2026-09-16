import { createTheme, rem, type MantineThemeOverride } from '@mantine/core'

import { background, colors, tableBorder, text } from './palette'
import { customShadows, shadows } from './shadows'

/** `front` loyihasi `pxToRem` bilan ishlaydi — o'sha shkalani saqlaymiz. */
const px = (value: number) => rem(value)

/**
 * Qator balandligi. front'da katak paddingi 6px, lekin "Amallar" ustunida
 * kichik ikonka tugmalari (34px) turgani uchun qator amalda ~46px chiqadi.
 * JihozMed jadvallari bundan bo'shroq ko'rinadi — qatorni 56px ga
 * chiqaramiz, aks holda ro'yxat siqiq va mayda tuyuladi.
 */
const TABLE_ROW_HEIGHT = rem(56)

/**
 * JihozMed (`front`) dizayn tizimining Mantine'ga ko'chirilgan varianti:
 * palitra, Montserrat shrifti, 8px radius (kartalarda 16px), tugma
 * o'lchamlari va soyalar o'sha loyihadagidek.
 */
export const theme: MantineThemeOverride = createTheme({
  colors,
  primaryColor: 'brand',
  // Mantine yorug' sxemada matn rangini `black` dan oladi — standart #000
  // juda qattiq ko'rinadi, shuning uchun palitradagi matn rangi.
  black: text.primary,
  primaryShade: 6,

  fontFamily: 'Montserrat, Helvetica, Arial, sans-serif',
  fontFamilyMonospace: 'ui-monospace, SFMono-Regular, Menlo, monospace',

  defaultRadius: 'sm',
  radius: {
    xs: px(4),
    sm: px(8),
    md: px(12),
    lg: px(16),
    xl: px(24),
  },

  shadows,

  headings: {
    fontFamily: 'Montserrat, Helvetica, Arial, sans-serif',
    sizes: {
      h1: { fontSize: px(44), lineHeight: '1.25', fontWeight: '800' },
      h2: { fontSize: px(34), lineHeight: '1.33', fontWeight: '800' },
      h3: { fontSize: px(26), lineHeight: '1.5', fontWeight: '700' },
      h4: { fontSize: px(22), lineHeight: '1.5', fontWeight: '700' },
      h5: { fontSize: px(20), lineHeight: '1.5', fontWeight: '700' },
      h6: { fontSize: px(18), lineHeight: '1.55', fontWeight: '700' },
    },
  },

  // front shkalasidan bir pog'ona yuqori: interfeys matni juda mayda
  // ko'rinardi (14px asosiy matn), shuning uchun butun shkala ~1.1x.
  fontSizes: {
    xs: px(13),
    sm: px(15),
    md: px(17),
    lg: px(19),
    xl: px(21),
  },

  lineHeights: {
    xs: '1.4',
    sm: '1.57',
    md: '1.55',
    lg: '1.5',
    xl: '1.5',
  },

  components: {
    Button: {
      defaultProps: { radius: 'sm' },
      // front'da tugmalar bosh harfga o'tkazilmaydi va qalin (700) yoziladi;
      // large = 48px balandlik, 15px matn.
      styles: {
        root: { fontWeight: 700, textTransform: 'none' },
      },
    },
    // front: MuiCard — chegara yo'q, `customShadows.card` soyasi, radius*2 = 16px
    Card: {
      defaultProps: { radius: 'lg', padding: 'lg' },
      styles: {
        root: { border: 'none', boxShadow: customShadows.card },
      },
    },
    // front: MuiPaper — elevation 0, backgroundImage yo'q
    Paper: {
      defaultProps: { radius: 'lg', shadow: 'none' },
      styles: {
        root: { backgroundImage: 'none' },
      },
    },
    TextInput: {
      defaultProps: { radius: 'sm', size: 'md' },
    },
    PasswordInput: {
      defaultProps: { radius: 'sm', size: 'md' },
    },
    Select: {
      defaultProps: { radius: 'sm', size: 'md' },
    },
    Textarea: {
      defaultProps: { radius: 'sm', size: 'md' },
    },
    // `@mantine/dates` maydonlari standart holda `sm` keladi — boshqa
    // inputlar bilan bir xil bo'lishi uchun ular ham `md`.
    DateTimePicker: {
      defaultProps: { radius: 'sm', size: 'md' },
    },
    DateInput: {
      defaultProps: { radius: 'sm', size: 'md' },
    },
    DatePickerInput: {
      defaultProps: { radius: 'sm', size: 'md' },
    },
    // front `Label` (src/components/label): balandlik 24, radius 6,
    // 12px/700 matn, yon to'ldirish 8px, `soft` variant.
    Badge: {
      defaultProps: { radius: 6, variant: 'light' },
      styles: {
        root: {
          height: rem(26),
          fontSize: rem(13),
          fontWeight: 700,
          paddingInline: rem(8),
          textTransform: 'none',
          letterSpacing: 'normal',
        },
      },
    },
    // front: ro'yxatlarda `<Table stickyHeader size="small">`.
    // Katak paddingi 6px 16px, sarlavha 14px/600 oq fonda, oxirgi qatorda
    // chegara ko'rinmaydi. Ajratgich rangi front'nikidan yumshoqroq
    // (`tableBorder`) — 0.2 punktir chiziqda juda qalin ko'rinardi.
    Table: {
      defaultProps: {
        // MUI `size="small"` -> TableCell padding: 6px 16px; qatorlar
        // bo'shroq nafas olishi uchun vertikal to'ldirish oshirilgan.
        verticalSpacing: 12,
        horizontalSpacing: 16,
        // Ajratgich rangi — yumshoq, ingichka ko'rinsin uchun.
        borderColor: tableBorder,
      },
      styles: {
        th: {
          height: TABLE_ROW_HEIGHT,
          fontSize: rem(16),
          fontWeight: 600,
          textTransform: 'none',
          letterSpacing: 'normal',
          color: text.secondary,
          backgroundColor: background.paper,
          borderBottom: `1px dashed ${tableBorder}`,
          whiteSpace: 'nowrap',
        },
        td: {
          fontSize: rem(16),
          borderBottomWidth: 1,
          // front'da qatorlar ichida `IconButton size="small"` (34px) turadi,
          // shuning uchun amalda qator balandligi ~46px bo'ladi. Bizning
          // kataklarda ko'pincha faqat matn — balandlikni tenglashtiramiz,
          // aks holda jadval front'dagidan ancha siqiq ko'rinadi.
          height: TABLE_ROW_HEIGHT,
          borderBottomStyle: 'dashed',
        },
      },
    },
    Tooltip: {
      defaultProps: { radius: 'sm', withArrow: true },
    },
    Modal: {
      defaultProps: {
        radius: 'lg',
        centered: true,
        shadow: customShadows.dialog,
      },
    },
    // front: MuiPopover/MuiMenu -> `customShadows.dropdown`
    Menu: {
      defaultProps: { radius: 'sm', shadow: customShadows.dropdown },
    },
    Popover: {
      defaultProps: { radius: 'sm', shadow: customShadows.dropdown },
    },
    Combobox: {
      defaultProps: { radius: 'sm', shadow: customShadows.dropdown },
    },
  },
})
