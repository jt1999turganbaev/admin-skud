import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'

import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/notifications/styles.css'

import '@fontsource/montserrat/400.css'
import '@fontsource/montserrat/500.css'
import '@fontsource/montserrat/600.css'
import '@fontsource/montserrat/700.css'
import '@fontsource/montserrat/800.css'

import './global.css'

import '@/shared/config/i18n'

const container = document.getElementById('root')
if (!container) throw new Error('#root topilmadi')

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
