import { tracingContextFromHeaders } from '@sentry/utils'
import type { RequestEvent } from '@sveltejs/kit'

/**
 * Takes a request event and extracts traceparent and DSC data
 * from the `sentry-trace` and `baggage` DSC headers.
 *
 * Sets propagation context as a side effect.
 */
export function getTracePropagationData(
  event: RequestEvent
  // eslint-disable-next-line deprecation/deprecation
): ReturnType<typeof tracingContextFromHeaders> {
  const sentryTraceHeader = event.request.headers.get('sentry-trace') || ''
  const baggageHeader = event.request.headers.get('baggage')
  // eslint-disable-next-line deprecation/deprecation
  return tracingContextFromHeaders(sentryTraceHeader, baggageHeader)
}
