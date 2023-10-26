import { navigating, page } from '$app/stores'
import { getActiveTransaction } from '@sentry/core'
import { WINDOW } from '@sentry/svelte'
import type { Transaction, TransactionContext } from '@sentry/types'
import type { Span } from '@sentry/types'

const DEFAULT_TAGS = {
  'routing.instrumentation': '@sentry/sveltekit'
}

export const svelteKitRoutingInstrumentation = <T extends Transaction>(
  startTransactionFn: (context: TransactionContext) => T | undefined,
  startTransactionOnPageLoad?: boolean,
  startTransactionOnLocationChange?: boolean
) => {
  if (startTransactionOnPageLoad) {
    instrumentPageload(startTransactionFn)
  }

  if (startTransactionOnLocationChange) {
    instrumentNavigations(startTransactionFn)
  }
}

const instrumentPageload = <T extends Transaction>(
  startTransactionFn: (context: TransactionContext) => T | undefined
) => {
  const initialPath = WINDOW && WINDOW.location && WINDOW.location.pathname

  const pageloadTransaction = startTransactionFn({
    name: initialPath,
    op: 'pageload',
    origin: 'auto.pageload.sveltekit',
    description: initialPath,
    tags: {
      ...DEFAULT_TAGS
    },
    metadata: {
      source: 'url'
    }
  })

  page.subscribe((page) => {
    if (!page) {
      return
    }

    const routeId = page.route && page.route.id

    if (pageloadTransaction && routeId) {
      pageloadTransaction.setName(routeId, 'route')
    }
  })
}

/**
 * Use the `navigating` store to start a transaction on navigations.
 */
const instrumentNavigations = <T extends Transaction>(
  startTransactionFn: (context: TransactionContext) => T | undefined
) => {
  let routingSpan: Span | undefined = undefined
  let activeTransaction

  navigating.subscribe((navigation) => {
    if (!navigation) {
      // `navigating` emits a 'null' value when the navigation is completed.
      // So in this case, we can finish the routing span. If the transaction was an IdleTransaction,
      // it will finish automatically and if it was user-created users also need to finish it.
      if (routingSpan) {
        routingSpan.finish()
        routingSpan = undefined
      }
      return
    }

    const from = navigation.from
    const to = navigation.to

    // for the origin we can fall back to window.location.pathname because in this emission, it still is set to the origin path
    const rawRouteOrigin =
      (from && from.url.pathname) ||
      (WINDOW && WINDOW.location && WINDOW.location.pathname)

    const rawRouteDestination = to && to.url.pathname

    // We don't want to create transactions for navigations of same origin and destination.
    // We need to look at the raw URL here because parameterized routes can still differ in their raw parameters.
    if (rawRouteOrigin === rawRouteDestination) {
      return
    }

    const parameterizedRouteOrigin = from && from.route.id
    const parameterizedRouteDestination = to && to.route.id

    activeTransaction = getActiveTransaction()

    if (!activeTransaction) {
      activeTransaction = startTransactionFn({
        name: parameterizedRouteDestination || rawRouteDestination || 'unknown',
        op: 'navigation',
        origin: 'auto.navigation.sveltekit',
        metadata: { source: parameterizedRouteDestination ? 'route' : 'url' },
        tags: {
          ...DEFAULT_TAGS
        }
      })
    }

    if (activeTransaction) {
      if (routingSpan) {
        // If a routing span is still open from a previous navigation, we finish it.
        routingSpan.finish()
      }
      routingSpan = activeTransaction.startChild({
        op: 'ui.sveltekit.routing',
        description: 'SvelteKit Route Change',
        origin: 'auto.ui.sveltekit'
      })
      activeTransaction.setTag('from', parameterizedRouteOrigin)
    }
  })
}
