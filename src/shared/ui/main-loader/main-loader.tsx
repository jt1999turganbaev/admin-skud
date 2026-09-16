import { Center, Loader, Overlay, Stack } from '@mantine/core'

/** Butun ekranni egallaydigan yuklanish holati (el-yurt-admin'dagi kabi). */
export const MainLoader = () => (
  <Overlay fixed zIndex={400}>
    <Center h="100vh" bg="var(--page-bg)">
      <Stack align="center">
        <img src="/logo.png" alt="Logo" style={{ height: '96px' }} />
        <Loader type="dots" color="brand" size="xl" />
      </Stack>
    </Center>
  </Overlay>
)
