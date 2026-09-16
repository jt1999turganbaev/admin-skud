import { Suspense } from 'react'
import { Center, Loader } from '@mantine/core'
import { Outlet } from 'react-router-dom'

const AuthLayout = () => (
  <Suspense
    fallback={
      <Center mih="100vh">
        <Loader />
      </Center>
    }
  >
    <Outlet />
  </Suspense>
)

export default AuthLayout
