import { getActiveTransaction } from '@sentry/core'
import { dynamicSamplingContextToSentryBaggageHeader } from '@sentry/utils'
import type { ResolveOptions } from '@sveltejs/kit'

const FETCH_PROXY_SCRIPT = `
    const f = window.fetch;
    if(f){
      window._sentryFetchProxy = function(...a){return f(...a)}
      window.fetch = function(...a){return window._sentryFetchProxy(...a)}
    }
`

export const transformPageChunk: NonNullable<
  ResolveOptions['transformPageChunk']
> = ({ html }) => {
  const transaction = getActiveTransaction()
  if (transaction) {
    const traceparentData = transaction.toTraceparent()
    const dynamicSamplingContext = dynamicSamplingContextToSentryBaggageHeader(
      transaction.getDynamicSamplingContext()
    )
    const content = `<head>
  <meta name="sentry-trace" content="${traceparentData}"/>
  <meta name="baggage" content="${dynamicSamplingContext}"/>
  <script>${FETCH_PROXY_SCRIPT}
  </script>
  `
    return html.replace('<head>', content)
  }

  return html
}
