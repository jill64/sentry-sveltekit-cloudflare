import type { Span } from '@sentry/core'
import {
  SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN,
  SEMANTIC_ATTRIBUTE_SENTRY_SOURCE,
  getCurrentScope,
  getDefaultIsolationScope,
  getIsolationScope,
  setHttpStatus,
  startSpan,
  winterCGRequestToRequestData
} from '@sentry/core'
import type { RequestEvent } from '@sveltejs/kit'
import { Handle } from '@sveltejs/kit'
import { addSentryCodeToPage } from './addSentryCodeToPage.js'
import type { initSentry } from './initSentry.js'
import { sendErrorToSentry } from './sendErrorToSentry.js'
import { SentryHandleOptions } from './types/SentryHandleOptions.js'

export const instrumentHandle = async ({
  input: { event, resolve },
  init,
  handleOptions: options
}: {
  input: Parameters<Handle>[0]
  init: (event: RequestEvent) => ReturnType<typeof initSentry>
  handleOptions?: SentryHandleOptions
}): Promise<Response> => {
  if (!event.route?.id && !options?.handleUnknownRoutes) {
    return resolve(event)
  }

  const routeName = `${event.request.method} ${
    event.route?.id || event.url.pathname
  }`

  if (getIsolationScope() !== getDefaultIsolationScope()) {
    getIsolationScope().setTransactionName(routeName)
  }

  try {
    const resolveResult = await startSpan(
      {
        op: 'http.server',
        attributes: {
          [SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: 'auto.http.sveltekit',
          [SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: event.route?.id ? 'route' : 'url',
          'http.method': event.request.method
        },
        name: routeName
      },
      async (span?: Span) => {
        getCurrentScope().setSDKProcessingMetadata({
          normalizedRequest: winterCGRequestToRequestData(event.request.clone())
        })
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
    sendErrorToSentry(e, 'handle', init(event))
    throw e
  }
}
