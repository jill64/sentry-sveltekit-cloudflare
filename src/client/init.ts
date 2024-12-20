import * as Sentry from '@sentry-sveltekit/index.client.js'
import { HandleClientError } from '@sveltejs/kit'
import { Captured } from '../types/Captured.js'
import { handleErrorWithSentry } from './sentry/handleError.js'
import { InitOptions } from './types/InitOptions.js'

export const init = (
  /**
   * Sentry DSN
   * @see https://docs.sentry.io/product/sentry-basics/dsn-explainer/
   */
  dsn: string,
  /**
   * Client Init Options
   */
  options?: InitOptions
): Captured<HandleClientError> => {
  Sentry.init({
    dsn,
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    // @ts-expect-error Type 'BrowserOptions' is not assignable to type 'InitOptions'.
    integrations: [Sentry.replayIntegration()],
    ...options?.sentryOptions
  })

  return handleErrorWithSentry
}
