import type { BrowserOptions } from '@sentry/svelte'
import type { DevOptions } from '../../types/DevOptions.js'

export type InitOptions = DevOptions & {
  /**
   * Sentry Browser Options
   * @see https://docs.sentry.io/platforms/javascript/configuration/options/
   */
  sentryOptions?: BrowserOptions
}
