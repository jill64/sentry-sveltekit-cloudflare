import { HandleClientError } from '@sveltejs/kit'
import type { Captured } from '../types/Captured.js'
import { init as initProd } from './init.js'
import type { InitOptions } from './types/InitOptions.js'

export const init = (
  /**
   * Sentry DSN
   * @see https://docs.sentry.io/product/sentry-basics/dsn-explainer/
   */
  dsn: string,
  /**
   * Client Init Options
   */
  options?: InitOptions
): Captured<HandleClientError> =>
  options?.enableInDevMode
    ? initProd(dsn, options)
    : (handleError = () => {}) => handleError
