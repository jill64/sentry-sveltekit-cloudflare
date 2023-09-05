import {
  captureException,
  init,
  type BrowserOptions,
  BrowserTracing,
  Replay
} from '@sentry/svelte'
import { addExceptionMechanism } from '@sentry/utils'
import type { HandleClientError } from '@sveltejs/kit'
import { DEV } from 'esm-env'

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

  init({
    dsn,
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    integrations: [new BrowserTracing(), new Replay()],
    ...sentryOptions
  })

  return (handleError = defaultErrorHandler): HandleClientError =>
    (input) => {
      captureException(input.error, (scope) => {
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
