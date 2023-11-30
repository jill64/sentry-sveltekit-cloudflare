import { dev } from '$app/environment'
import { makeHandler } from './makeHandler.js'
import { HandleWrappers } from './types/HandleWrappers.js'
import { InitOptions } from './types/InitOptions.js'
import { defaultErrorHandler } from './util/defaultErrorHandler.js'
import { defaultHandler } from './util/defaultHandler.js'

export const init = (
  /**
   * Sentry DSN
   * @see https://docs.sentry.io/product/sentry-basics/dsn-explainer/
   */
  dsn: string,
  /**
   * Server Init Options
   */
  options?: InitOptions
): HandleWrappers => {
  const { enableInDevMode } = options ?? {}

  if (dev && !enableInDevMode) {
    return {
      onHandle: (handle = defaultHandler) => handle,
      onError: (handleError = defaultErrorHandler) => handleError
    }
  }

  return makeHandler(dsn, options)
}
