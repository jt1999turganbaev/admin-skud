import { useState } from 'react'
import { Alert, Button, PasswordInput } from '@mantine/core'
import { hasLength, isNotEmpty, useForm } from '@mantine/form'
import {
  IconArrowRight,
  IconInfoCircle,
  IconLock,
  IconPhone,
} from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import { useAuth } from '@/features/auth/auth-context/auth-context'
import { ROUTES } from '@/shared/constants/routes'
import { LanguageSwitcher, PhoneInput } from '@/shared/ui'
import type { HTTPError } from '@/shared/types/http'
import { getErrorMessage } from '@/shared/utils/error-message'

import styles from './login-form.module.css'

interface LoginValues {
  /** Maydonda 998siz lokal qism turadi, yuborishdan oldin 998 qo'shiladi. */
  phone: string
  password: string
}

export const LoginForm = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [errorText, setErrorText] = useState('')

  const form = useForm<LoginValues>({
    initialValues: { phone: '', password: '' },
    validate: {
      phone: hasLength({ min: 9 }, t('auth.phoneRequired')),
      password: isNotEmpty(t('auth.passwordRequired')),
    },
    // Backend telefonni "+998901234567" ko'rinishida saqlaydi — "+" shart.
    transformValues: (values) => ({
      ...values,
      phone: `+998${values.phone}`,
    }),
  })

  const handleSubmit = form.onSubmit(async (values) => {
    setIsLoading(true)
    setErrorText('')

    try {
      await login(values)

      // Qo'riqchi bizni qayerdan yuborgan bo'lsa, o'sha yerga qaytamiz.
      const from = (location.state as { from?: { pathname: string } } | null)
        ?.from?.pathname

      navigate(from ?? ROUTES.HOME, { replace: true })
    } catch (error) {
      const err = error as HTTPError

      // 422 — maydon xatolari formaning o'zida ko'rsatiladi.
      if (err?.errors) form.setErrors(err.errors)
      else setErrorText(getErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  })

  return (
    <main className={styles.page}>
      {/* ---------- chap panel: brend va rasm ---------- */}
      <section className={styles.brandPanel}>
        <div className={styles.brand}>
          {/* Tashkilot: logo va nomi bir qatorda */}
          <div className={styles.org}>
            <img src="/logo.png" alt="" className={styles.orgLogo} />
            <span className={styles.orgName}>{t('app.org')}</span>
          </div>

          <span className={styles.divider} />

          <h1 className={styles.brandTitle}>{t('app.title')}</h1>
          <p className={styles.tagline}>{t('auth.tagline')}</p>
        </div>

        <div className={styles.illustration} aria-hidden />

        <figure className={styles.quote}>
          <blockquote>“{t('auth.quote')}”</blockquote>
          <figcaption>{t('auth.quoteAuthor')}</figcaption>
        </figure>
      </section>

      {/* ---------- o'ng panel: forma ---------- */}
      <section className={styles.formPanel}>
        <div className={styles.topbar}>
          <LanguageSwitcher />
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>{t('auth.loginTitle')}</h2>
          <p className={styles.cardSubtitle}>{t('auth.loginSubtitle')}</p>

          <form onSubmit={handleSubmit} noValidate>
            {errorText && (
              <Alert color="error" radius="sm" mb="md">
                {errorText}
              </Alert>
            )}

            <PhoneInput
              label={t('auth.phone')}
              autoFocus
              leftSection={<IconPhone size={18} />}
              value={form.values.phone}
              onChange={(phone) => form.setFieldValue('phone', phone)}
              error={form.errors.phone}
            />

            <PasswordInput
              label={t('auth.password')}
              placeholder={t('auth.passwordPlaceholder')}
              autoComplete="current-password"
              leftSection={<IconLock size={18} />}
              mt="lg"
              {...form.getInputProps('password')}
            />

            <Button
              type="submit"
              fullWidth
              h={52}
              mt={28}
              loading={isLoading}
              rightSection={<IconArrowRight size={20} />}
            >
              {t('auth.login')}
            </Button>
          </form>

          <p className={styles.notice}>
            <IconInfoCircle size={16} />
            {t('auth.authorizedOnly')}
          </p>
        </div>

        <footer className={styles.footer}>
          <span>{t('auth.copyright', { year: new Date().getFullYear() })}</span>
          <img
            src="/uzinfocom-logo.svg"
            alt="UZINFOCOM"
            className={styles.footerLogo}
          />
        </footer>
      </section>
    </main>
  )
}
