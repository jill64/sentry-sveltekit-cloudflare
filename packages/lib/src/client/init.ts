import type { BrowserOptions } from '@sentry/svelte'
import * as Sentry from '@sentry/svelte'
import { addExceptionMechanism } from '@sentry/utils'
import type { HandleClientError } from '@sveltejs/kit'
import { DEV } from 'esm-env'
import { defaultErrorHandler } from './defaultErrorHandler'
import { sentryInit } from './sentryInit'

export const init = (
  dsn: string,
  options?: {
    sentryOptions?: BrowserOptions
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
