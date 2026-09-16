import { Button, Menu } from '@mantine/core'
import { IconChevronDown, IconWorld } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

import { LANGUAGES, type LanguageCode } from '@/shared/config/languages'

/** Til tanlash menyusi — globus ikonkasi, joriy til nomi va strelka. */
export const LanguageSwitcher = () => {
  const { i18n } = useTranslation()

  const current =
    LANGUAGES.find((item) => item.code === i18n.resolvedLanguage) ??
    LANGUAGES[0]

  return (
    <Menu position="bottom-end" width={170}>
      <Menu.Target>
        <Button
          variant="subtle"
          color="gray"
          c="var(--text-secondary)"
          fw={500}
          leftSection={<IconWorld size={18} />}
          rightSection={<IconChevronDown size={14} />}
        >
          {current.label}
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        {LANGUAGES.map((language) => (
          <Menu.Item
            key={language.code}
            fw={language.code === current.code ? 600 : 400}
            onClick={() => i18n.changeLanguage(language.code as LanguageCode)}
          >
            {language.label}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  )
}
