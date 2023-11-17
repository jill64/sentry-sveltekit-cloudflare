import { dev } from '$app/environment'
import type { BrowserOptions } from '@sentry/sveltekit'
import { HandleClientError } from '@sveltejs/kit'
import * as Sentry from './sentry/index.js'
import { handleErrorWithSentry } from './sentry/index.js'

export const init = (
  /**
   * Sentry DSN
   * @see https://docs.sentry.io/product/sentry-basics/dsn-explainer/
   */
  dsn: string,
  /**
   * Client Init Options
   */
  options?: {
    /**
     * Sentry Browser Options
     * @see https://docs.sentry.io/platforms/javascript/configuration/options/
     */
    sentryOptions?: BrowserOptions
    /**
     * Enable in dev mode
     * @default false
     */
    enableInDevMode?: boolean
  }
): ((handleError?: HandleClientError) => HandleClientError) => {
  const { sentryOptions, enableInDevMode } = options ?? {}

  if (dev && !enableInDevMode) {
    return (handleError = () => {}) => handleError
  }

  Sentry.init({
    dsn,
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    integrations: [new Sentry.Replay()],
    ...sentryOptions
  })

  return (handleError = () => {}) => handleErrorWithSentry(handleError)
}
