import { WINDOW } from '@sentry/svelte'

export function switchToFetchProxy() {
  const globalWithSentryFetchProxy = WINDOW

  const actualFetch = globalWithSentryFetchProxy.fetch

  // @ts-expect-error TODO: fix this
  if (globalWithSentryFetchProxy._sentryFetchProxy && actualFetch) {
    globalWithSentryFetchProxy.fetch =
      // @ts-expect-error TODO: fix this
      globalWithSentryFetchProxy._sentryFetchProxy
    return actualFetch
  }

  return undefined
}
