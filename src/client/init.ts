import type { BrowserOptions } from '@sentry/svelte'
import * as Sentry from '@sentry/svelte'
import { addExceptionMechanism } from '@sentry/utils'
import type { HandleClientError } from '@sveltejs/kit'
import { DEV } from 'esm-env'
import { defaultErrorHandler } from './defaultErrorHandler.js'
import { sentryInit } from './sentryInit.js'

export const init = (
  /**
   * Sentry DSN
   * @see https://docs.sentry.io/product/sentry-basics/dsn-explainer/
   */
  dsn: string,
  /**
   * Client Init Options
   */
  options?: {
    /**
     * Sentry Browser Options
     * @see https://docs.sentry.io/platforms/javascript/configuration/options/
     */
    sentryOptions?: BrowserOptions
    /**
     * Enable in dev mode
     * @default false
     */
    enableInDevMode?: boolean
  }
) => {
  const { sentryOptions, enableInDevMode } = options ?? {}

  if (DEV && !enableInDevMode) {
    return (handleError = defaultErrorHandler) => handleError
  }

  sentryInit({
    dsn,
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    integrations: [new Sentry.Replay()],
    ...sentryOptions
  })

  return (handleError = defaultErrorHandler): HandleClientError =>
    (input) => {
      Sentry.captureException(input.error, (scope) => {
        scope.addEventProcessor((event) => {
          addExceptionMechanism(event, {
            type: 'sveltekit',
            handled: false
          })
          return event
        })
        return scope
      })

      return handleError(input)
    }
}
