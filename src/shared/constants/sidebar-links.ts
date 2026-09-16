import {
  IconDeviceDesktop,
  IconDeviceTablet,
  IconHistory,
  IconDoor,
  IconLayoutDashboard,
  IconLink,
  IconLogout,
  IconUsers,
} from '@tabler/icons-react'
import type { Icon } from '@tabler/icons-react'

import { ROUTES } from './routes'

export type SidebarLink = {
  id: string
  link: string
  Icon: Icon
  /** `main` ns dagi tarjima kaliti. */
  labelKey: string
  /** Shu prefiks bilan boshlanuvchi sahifalarda ham havola faol ko'rinadi. */
  activeMatch?: string
}

export const MAIN_SIDEBAR_LINKS: SidebarLink[] = [
  {
    id: 'dashboard',
    link: ROUTES.HOME,
    labelKey: 'nav.dashboard',
    Icon: IconLayoutDashboard,
  },
  {
    id: 'users',
    link: ROUTES.USERS,
    labelKey: 'nav.users',
    Icon: IconUsers,
    activeMatch: ROUTES.USERS,
  },
  {
    id: 'assignments',
    link: ROUTES.ASSIGNMENTS,
    labelKey: 'nav.assignments',
    Icon: IconLink,
    activeMatch: ROUTES.ASSIGNMENTS,
  },
  {
    id: 'rooms',
    link: ROUTES.ROOMS,
    labelKey: 'nav.rooms',
    Icon: IconDoor,
    activeMatch: ROUTES.ROOMS,
  },
  {
    id: 'terminals',
    link: ROUTES.TERMINALS,
    labelKey: 'nav.terminals',
    Icon: IconDeviceDesktop,
    activeMatch: ROUTES.TERMINALS,
  },
  {
    id: 'tablets',
    link: ROUTES.TABLETS,
    labelKey: 'nav.tablets',
    Icon: IconDeviceTablet,
    activeMatch: ROUTES.TABLETS,
  },
  {
    id: 'logs',
    link: ROUTES.ACCESS_LOGS,
    labelKey: 'nav.logs',
    Icon: IconHistory,
    activeMatch: ROUTES.ACCESS_LOGS,
  },
]

export const BOTTOM_SIDEBAR_LINKS: SidebarLink[] = [
  {
    id: 'logout',
    link: ROUTES.LOGIN,
    labelKey: 'nav.logout',
    Icon: IconLogout,
  },
]
