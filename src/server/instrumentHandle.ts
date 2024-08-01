import {
  SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN,
  getCurrentScope,
  setHttpStatus,
  startSpan
} from '@sentry/core'
import type { RequestEvent } from '@sveltejs/kit'
import { Handle } from '@sveltejs/kit'
import { getTracePropagationData } from './getTracePropagationData.js'
import type { initSentry } from './initSentry.js'
import { sendErrorToSentry } from './sendErrorToSentry.js'
import { SentryHandleOptions } from './types/SentryHandleOptions.js'
import type { Span } from '@sentry/types'
import { addSentryCodeToPage } from './addSentryCodeToPage.js'

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
        attributes: {
          [SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: 'auto.http.sveltekit'
        },
        name: `${event.request.method} ${
          event.route?.id || event.url.pathname
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
      async (span?: Span) => {
        const res = await resolve(event, {
          transformPageChunk: addSentryCodeToPage(options)
        })
        if (span) {
          setHttpStatus(span, res.status)
        }
        return res
      }
    )
    return resolveResult
  } catch (e: unknown) {
    const Sentry = init(event)
    sendErrorToSentry(e, Sentry)
    throw e
  }
}
