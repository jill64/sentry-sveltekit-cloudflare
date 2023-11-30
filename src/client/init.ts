import { dev } from '$app/environment'
import { HandleClientError } from '@sveltejs/kit'
import { Captured } from '../common/types/Captured.js'
import { handleErrorWithSentry } from './sentry/handleError.js'
import * as Sentry from './sentry/index.js'
import { InitOptions } from './types/InitOptions.js'

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
): Captured<HandleClientError> => {
  const { sentryOptions, enableInDevMode } = options ?? {}

  if (dev && !enableInDevMode) {
    return (handleError = () => {}) => handleError
  }

  Sentry.init({
    dsn,
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    integrations: [new Sentry.Replay()],
    ...sentryOptions
  })

  return handleErrorWithSentry
}
