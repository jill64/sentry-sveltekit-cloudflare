import type { DevOptions } from '../../common/types/DevOptions.js'
import type { BrowserOptions } from '@sentry/svelte'

export type InitOptions = DevOptions & {
  /**
   * Sentry Browser Options
   * @see https://docs.sentry.io/platforms/javascript/configuration/options/
   */
  sentryOptions?: BrowserOptions
}
