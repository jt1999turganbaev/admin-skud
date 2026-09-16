import { lazy } from 'react'

/** `React.lazy` kutadigan factory turi — props turi bo'yicha cheklamaymiz. */
type LazyFactory = Parameters<typeof lazy>[0]

/**
 * Deploy'dan keyin eski chunk'lar yo'qoladi va lazy import "Failed to fetch
 * dynamically imported module" bilan yiqiladi. Bir marta sahifani yangilab
 * ko'ramiz; takror yiqilsa xatoni o'tkazib yuboramiz.
 */
const RELOAD_FLAG = 'iacs.chunk-reloaded'

export const lazyWithRetry = (factory: LazyFactory) =>
  lazy(async () => {
    try {
      const module = await factory()
      window.sessionStorage?.removeItem(RELOAD_FLAG)
      return module
    } catch (error) {
      const alreadyReloaded = window.sessionStorage?.getItem(RELOAD_FLAG)

      if (!alreadyReloaded) {
        window.sessionStorage?.setItem(RELOAD_FLAG, 'true')
        window.location.reload()
      }

      throw error
    }
  })
