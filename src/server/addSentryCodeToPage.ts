import {
  getActiveTransaction,
  getDynamicSamplingContextFromSpan,
  spanToTraceHeader
} from '@sentry/core'
import { dynamicSamplingContextToSentryBaggageHeader } from '@sentry/utils'
import type { ResolveOptions } from '@sveltejs/kit'
import { SentryHandleOptions } from './types/SentryHandleOptions.js'

/**
 * Exported only for testing
 */
export const FETCH_PROXY_SCRIPT = `
    const f = window.fetch;
    if(f){
      window._sentryFetchProxy = function(...a){return f(...a)}
      window.fetch = function(...a){return window._sentryFetchProxy(...a)}
    }
`

/**
 * Adds Sentry tracing <meta> tags to the returned html page.
 * Adds Sentry fetch proxy script to the returned html page if enabled in options.
 * Also adds a nonce attribute to the script tag if users specified one for CSP.
 *
 * Exported only for testing
 */
export function addSentryCodeToPage(
  options?: SentryHandleOptions
): NonNullable<ResolveOptions['transformPageChunk']> {
  const { fetchProxyScriptNonce, injectFetchProxyScript } = options ?? {}
  // if injectFetchProxyScript is not set, we default to true
  const shouldInjectScript = injectFetchProxyScript !== false
  const nonce = fetchProxyScriptNonce ? `nonce="${fetchProxyScriptNonce}"` : ''

  return ({ html }) => {
    // eslint-disable-next-line deprecation/deprecation
    const transaction = getActiveTransaction()
    if (transaction) {
      const traceparentData = spanToTraceHeader(transaction)
      const dynamicSamplingContext =
        dynamicSamplingContextToSentryBaggageHeader(
          getDynamicSamplingContextFromSpan(transaction)
        )
      const contentMeta = `<head>
    <meta name="sentry-trace" content="${traceparentData}"/>
    <meta name="baggage" content="${dynamicSamplingContext}"/>
    `
      const contentScript = shouldInjectScript
        ? `<script ${nonce}>${FETCH_PROXY_SCRIPT}</script>`
        : ''

      const content = `${contentMeta}\n${contentScript}`

      return html.replace('<head>', content)
    }

    return html
  }
}
