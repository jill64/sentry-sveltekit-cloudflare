import { getCurrentHub, trace } from '@sentry/core'
import { objectify } from '@sentry/utils'
import type { Handle, RequestEvent } from '@sveltejs/kit'
import { getTracePropagationData } from './getTracePropagationData.js'
import { initSentry } from './initSentry.js'
import { transformPageChunk } from './transformPageChunk.js'
import { isHttpError, isRedirect } from './common/utils.js'
import { SentryHandleOptions } from './types/SentryHandleOptions.js'

export const instrumentHandle = (arg: {
  input: Parameters<Handle>[0]
  init: (event: RequestEvent) => ReturnType<typeof initSentry>
  handleOptions?: SentryHandleOptions
}) => {
  const { input, handleOptions, init } = arg
  const { event, resolve } = input

  const instrumentOptions = {
    handleUnknownRoutes: false,
    ...handleOptions
  }

  if (!event.route?.id && !instrumentOptions.handleUnknownRoutes) {
    return resolve(event)
  }

  const Sentry = init(input.event)

  const { dynamicSamplingContext, traceparentData, propagationContext } =
    getTracePropagationData(event)

  getCurrentHub().getScope().setPropagationContext(propagationContext)

  return trace(
    {
      op: 'http.server',
      origin: 'auto.http.sveltekit',
      name: `${event.request.method} ${event.route?.id || event.url.pathname}`,
      status: 'ok',
      ...traceparentData,
      metadata: {
        source: event.route?.id ? 'route' : 'url',
        dynamicSamplingContext:
          traceparentData && !dynamicSamplingContext
            ? {}
            : dynamicSamplingContext
      }
    },
    async (span) => {
      const res = await resolve(event, { transformPageChunk })
      if (span) {
        span.setHttpStatus(res.status)
      }
      return res
    },
    (e) => {
      const objectifiedErr = objectify(e)

      if (
        isRedirect(objectifiedErr) ||
        (isHttpError(objectifiedErr) &&
          objectifiedErr.status < 500 &&
          objectifiedErr.status >= 400)
      ) {
        return objectifiedErr
      }

      Sentry.captureException(objectifiedErr)

      return objectifiedErr
    }
  )
}
