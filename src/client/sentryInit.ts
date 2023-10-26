import { BrowserOptions, configureScope, init } from '@sentry/svelte'
import { addClientIntegrations } from './addClientIntegrations.js'
import { applySdkMetadata } from './applySdkMetadata.js'
import { restoreFetch } from './restoreFetch.js'
import { switchToFetchProxy } from './switchToFetchProxy.js'

export const sentryInit = (options: BrowserOptions) => {
  applySdkMetadata(options, ['sveltekit', 'svelte'])

  addClientIntegrations(options)

  // 1. Switch window.fetch to our fetch proxy we injected earlier
  const actualFetch = switchToFetchProxy()

  // 2. Initialize the SDK which will instrument our proxy
  init(options)

  // 3. Restore the original fetch now that our proxy is instrumented
  if (actualFetch) {
    restoreFetch(actualFetch)
  }

  configureScope((scope) => {
    scope.setTag('runtime', 'browser')
  })
}
