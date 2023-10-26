import { WINDOW } from '@sentry/svelte'

export const restoreFetch = (actualFetch: typeof WINDOW.fetch) => {
  const globalWithSentryFetchProxy = WINDOW

  // @ts-expect-error TODO: fix this
  globalWithSentryFetchProxy._sentryFetchProxy =
    globalWithSentryFetchProxy.fetch

  globalWithSentryFetchProxy.fetch = actualFetch
}
