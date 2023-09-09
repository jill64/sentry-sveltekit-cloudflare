import { tracingContextFromHeaders } from '@sentry/utils'
import { RequestEvent } from '@sveltejs/kit'

export const getTracePropagationData = (event: RequestEvent) => {
  const sentryTraceHeader = event.request.headers.get('sentry-trace') || ''
  const baggageHeader = event.request.headers.get('baggage')
  return tracingContextFromHeaders(sentryTraceHeader, baggageHeader)
}
