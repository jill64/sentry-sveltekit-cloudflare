import { getCurrentScope, startSpan } from '@sentry/core'
import { objectify } from '@sentry/utils'
import type { RequestEvent } from '@sveltejs/kit'
import { Handle } from '@sveltejs/kit'
import { isHttpError, isRedirect } from '../common/utils.js'
import { getTracePropagationData } from './getTracePropagationData.js'
import { initSentry } from './initSentry.js'
import { transformPageChunk } from './transformPageChunk.js'
import { SentryHandleOptions } from './types/SentryHandleOptions.js'

export const instrumentHandle = async ({
  input: { event, resolve },
  init,
  handleOptions: options
}: {
  input: Parameters<Handle>[0]
  init: (event: RequestEvent) => ReturnType<typeof initSentry>
  handleOptions?: SentryHandleOptions
}) => {
  if (!event.route?.id && !options?.handleUnknownRoutes) {
    return resolve(event)
  }

  const { dynamicSamplingContext, traceparentData, propagationContext } =
    getTracePropagationData(event)

  getCurrentScope().setPropagationContext(propagationContext)

  try {
    const resolveResult = await startSpan(
      {
        op: 'http.server',
        origin: 'auto.http.sveltekit',
        name: `${event.request.method} ${
          event.route?.id ?? event.url.pathname
        }`,
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
      }
    )
    return resolveResult
  } catch (e) {
    const objectifiedErr = objectify(e)

    // similarly to the `load` function, we don't want to capture 4xx errors or redirects
    if (
      isRedirect(objectifiedErr) ||
      (isHttpError(objectifiedErr) &&
        objectifiedErr.status < 500 &&
        objectifiedErr.status >= 400)
    ) {
      throw e
    }

    const Sentry = init(event)

    Sentry.captureException(objectifiedErr)

    throw e
  }
}
