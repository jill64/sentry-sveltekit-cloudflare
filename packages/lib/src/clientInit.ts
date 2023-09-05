import type { BrowserOptions } from '@sentry/svelte'
import { addExceptionMechanism } from '@sentry/utils'
import type { HandleClientError } from '@sveltejs/kit'
import { DEV } from 'esm-env'
import * as Sentry from '@sentry/svelte'

const defaultErrorHandler: HandleClientError = ({ error }) => {
  console.error(error)
}

export const clientInit = (
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

  Sentry.init({
    dsn,
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    integrations: [new Sentry.BrowserTracing(), new Sentry.Replay()],
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
