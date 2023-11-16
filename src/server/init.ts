import { dev } from '$app/environment'
import type { Options } from 'toucan-js'
import { makeHandler } from './makeHandler.js'
import { SentryHandleOptions } from './types/SentryHandleOptions.js'
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
  options?: {
    /**
     * Toucan Options
     * @see https://github.com/robertcepa/toucan-js/blob/master/packages/toucan-js/src/types.ts
     */
    toucanOptions?: Partial<Options>
    /**
     * Sentry Handle Options
     */
    handleOptions?: SentryHandleOptions
    /**
     * Enable in dev mode
     * @default false
     */
    enableInDevMode?: boolean
  }
) => {
  const { enableInDevMode } = options ?? {}

  if (dev && !enableInDevMode) {
    return {
      onHandle: (handle = defaultHandler) => handle,
      onError: (handleError = defaultErrorHandler) => handleError
    }
  }

  return makeHandler(dsn, options)
}
