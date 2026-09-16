import { Box, ScrollArea, Tooltip, UnstyledButton } from '@mantine/core'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import { NavLink, useLocation } from 'react-router-dom'

import { useLogoutConfirm } from '@/features/auth/ui/logout/logout'

import {
  BOTTOM_SIDEBAR_LINKS,
  MAIN_SIDEBAR_LINKS,
  type SidebarLink,
} from '@/shared/constants/sidebar-links'

import styles from './navbar.module.css'

interface NavbarProps {
  collapsed: boolean
}

export const Navbar = ({ collapsed }: NavbarProps) => {
  const { pathname } = useLocation()
  const { t } = useTranslation()
  const confirmLogout = useLogoutConfirm()

  const isActive = (link: SidebarLink) =>
    pathname === link.link ||
    (link.activeMatch ? pathname.startsWith(link.activeMatch) : false)

  const renderLink = (link: SidebarLink) => {
    const active = isActive(link)

    // Chiqish — navigatsiya emas: tasdiqlashdan keyin sessiya backendda yopiladi.
    if (link.id === 'logout') {
      return (
        <UnstyledButton
          key={link.id}
          className={clsx(styles.link, styles.logout)}
          onClick={confirmLogout}
        >
          <link.Icon
            size={collapsed ? 22 : 20}
            className={styles.linkIcon}
            stroke={2}
          />
          {!collapsed && (
            <span className={styles.linkLabel}>{t(link.labelKey)}</span>
          )}
        </UnstyledButton>
      )
    }

    const item = (
      <NavLink
        key={link.id}
        to={link.link}
        end={link.link === '/'}
        className={clsx(styles.link, active && styles.active)}
      >
        <link.Icon
          size={collapsed ? 22 : 20}
          className={styles.linkIcon}
          stroke={2}
        />
        {!collapsed && (
          <span className={styles.linkLabel}>{t(link.labelKey)}</span>
        )}
      </NavLink>
    )

    return collapsed ? (
      <Tooltip
        key={link.id}
        label={t(link.labelKey)}
        position="right"
        withArrow
      >
        {item}
      </Tooltip>
    ) : (
      item
    )
  }

  return (
    <Box
      component="aside"
      className={clsx(styles.sidebar, collapsed && styles.collapsed)}
    >
      <div className={styles.panel}>
        {/* Logo + nom; yig'ilgan holatda faqat logo ko'rinadi. */}
        <div className={styles.brand}>
          <img src="/logo.png" alt="Logo" className={styles.logoMark} />

          {!collapsed && <span className={styles.mark}>{t('app.name')}</span>}
        </div>

        <ScrollArea className={styles.nav} scrollbarSize={6} type="hover">
          <div className={styles.navInner}>
            {MAIN_SIDEBAR_LINKS.map(renderLink)}
          </div>
        </ScrollArea>

        <div className={styles.footer}>
          {BOTTOM_SIDEBAR_LINKS.map(renderLink)}

          {/* front/src/layouts/dashboard/nav-vertical.js — chiqish tugmasi
              ostida ishlab chiquvchi logotipi (70% kenglik). */}
          {!collapsed && (
            <img
              src="/uzinfocom-logo.svg"
              alt="UZINFOCOM"
              className={styles.credit}
            />
          )}
        </div>
      </div>
    </Box>
  )
}
