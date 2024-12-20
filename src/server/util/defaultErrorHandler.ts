import { consoleSandbox } from '@sentry/core'
import type { HandleServerError } from '@sveltejs/kit'

// The SvelteKit default error handler just logs the error's stack trace to the console
// see: https://github.com/sveltejs/kit/blob/369e7d6851f543a40c947e033bfc4a9506fdc0a8/packages/kit/src/runtime/server/index.js#L43
export const defaultErrorHandler: HandleServerError = ({ error }) => {
  // @ts-expect-error this conforms to the default implementation (including this ts-expect-error)
  consoleSandbox(() => console.error(error && error.stack))
}
