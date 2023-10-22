import { hasTracingEnabled } from '@sentry/core'
import { BrowserOptions, BrowserTracing } from '@sentry/svelte'
import { addOrUpdateIntegration } from '@sentry/utils'
import { svelteKitRoutingInstrumentation } from './router.js'

export const addClientIntegrations = (options: BrowserOptions) => {
  let integrations = options.integrations || []

  if (hasTracingEnabled(options)) {
    const defaultBrowserTracingIntegration = new BrowserTracing({
      routingInstrumentation: svelteKitRoutingInstrumentation
    })

    integrations = addOrUpdateIntegration(
      defaultBrowserTracingIntegration,
      integrations,
      {
        'options.routingInstrumentation': svelteKitRoutingInstrumentation
      }
    )
  }

  options.integrations = integrations
}
