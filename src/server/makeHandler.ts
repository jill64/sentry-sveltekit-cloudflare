import { getCurrentHub, runWithAsyncContext } from '@sentry/core'
import type { Handle, HandleServerError, RequestEvent } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'
import type { Options } from 'toucan-js'
import { initSentry } from './initSentry.js'
import { instrumentHandle } from './instrumentHandle.js'
import { SentryHandleOptions } from './types/SentryHandleOptions.js'
import { defaultErrorHandler } from './util/defaultErrorHandler.js'
import { isNotFoundError } from './util/isNotFoundError.js'

export const makeHandler = (
  dsn: string,
  arg?: {
    toucanOptions?: Partial<Options>
    handleOptions?: SentryHandleOptions
  }
) => {
  const { handleOptions, toucanOptions } = arg ?? {}

  const init = (event: RequestEvent) =>
    initSentry(event.request, {
      tracesSampleRate: 1.0,
      dsn,
      ...toucanOptions
    })

  const sentryHandle: Handle = (input) => {
    const sentryHandleOption = { input, init, handleOptions }

    return getCurrentHub().getScope().getSpan()
      ? instrumentHandle(sentryHandleOption)
      : runWithAsyncContext(() => instrumentHandle(sentryHandleOption))
  }

  const onHandle = (handle?: Handle) =>
    handle ? sequence(sentryHandle, handle) : sentryHandle

  const onError =
    (handleError = defaultErrorHandler): HandleServerError =>
    (input) => {
      if (isNotFoundError(input)) {
        return handleError(input)
      }

      const Sentry = init(input.event)

      Sentry.captureException(input.error)

      return handleError(input)
    }

  return {
    onHandle,
    onError
  }
}
