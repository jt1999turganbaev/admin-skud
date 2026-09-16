import { isRouteErrorResponse, useRouteError } from 'react-router-dom'

import { ErrorScreen } from './error-screen'

/**
 * Router `errorElement` i: sahifa render'idagi yoki loader'dagi xato.
 *
 * Qayta urinish uchun sahifani yangilaymiz — router holatini xatodan
 * keyin joyida tiklashning ishonchli yo'li yo'q.
 */
export const RouteError = () => {
  const error = useRouteError()

  const value = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error

  return <ErrorScreen error={value} onRetry={() => window.location.reload()} />
}
