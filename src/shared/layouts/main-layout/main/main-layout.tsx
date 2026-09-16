import { Suspense, useState } from 'react'
import { Box, Center, Loader } from '@mantine/core'
import { Outlet } from 'react-router-dom'

import { Header } from '../header/header'
import { Navbar } from '../navbar/navbar'
import styles from './main-layout.module.css'

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className={styles.shell}>
      <Navbar collapsed={collapsed} />

      <div className={styles.body}>
        <Header onToggleSidebar={() => setCollapsed((value) => !value)} />

        {/* front'da ro'yxat sahifalarida alohida sahifa sarlavhasi yo'q —
            sarlavha filtrlar panelining ichida turadi. */}
        <Box component="main" className={`${styles.main} scroll`}>
          <Suspense
            fallback={
              <Center py={80}>
                <Loader />
              </Center>
            }
          >
            <Outlet />
          </Suspense>
        </Box>
      </div>
    </div>
  )
}

export default MainLayout
