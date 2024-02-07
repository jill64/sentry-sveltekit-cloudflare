import { isHttpError, isRedirect } from '@sentry-sveltekit/common/utils.js'
import { objectify } from '@sentry/utils'
import { Toucan } from 'toucan-js'

export function sendErrorToSentry(e: unknown, Sentry: Toucan): unknown {
  // In case we have a primitive, wrap it in the equivalent wrapper class (string -> String, etc.) so that we can
  // store a seen flag on it.
  const objectifiedErr = objectify(e)

  // similarly to the `load` function, we don't want to capture 4xx errors or redirects
  if (
    isRedirect(objectifiedErr) ||
    (isHttpError(objectifiedErr) &&
      objectifiedErr.status < 500 &&
      objectifiedErr.status >= 400)
  ) {
    return objectifiedErr
  }

  Sentry.captureException(objectifiedErr)

  return objectifiedErr
}
