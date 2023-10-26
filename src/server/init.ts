import { DEV } from 'esm-env'
import type { Options } from 'toucan-js'
import { makeHandler } from './makeHandler.js'
import { SentryHandleOptions } from './types/SentryHandleOptions.js'
import { defaultErrorHandler } from './util/defaultErrorHandler.js'
import { defaultHandler } from './util/defaultHandler.js'

export const init = (
  dsn: string,
  options?: {
    toucanOptions?: Partial<Options>
    handleOptions?: SentryHandleOptions
    enableInDevMode?: boolean
  }
) => {
  const { enableInDevMode } = options ?? {}

  if (DEV && !enableInDevMode) {
    return {
      onHandle: (handle = defaultHandler) => handle,
      onError: (handleError = defaultErrorHandler) => handleError
    }
  }

  return makeHandler(dsn, options)
}
