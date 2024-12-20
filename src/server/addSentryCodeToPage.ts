import { getTraceMetaTags } from '@sentry/core'
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
    const metaTags = getTraceMetaTags()
    const headWithMetaTags = metaTags ? `<head>\n${metaTags}` : '<head>'

    const headWithFetchScript = shouldInjectScript
      ? `\n<script ${nonce}>${FETCH_PROXY_SCRIPT}</script>`
      : ''

    const modifiedHead = `${headWithMetaTags}${headWithFetchScript}`

    return html.replace('<head>', modifiedHead)
  }
}
