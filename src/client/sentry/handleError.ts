import { captureException } from '@sentry-sveltekit/index.client.js'
import { consoleSandbox } from '@sentry/utils'
import type { HandleClientError } from '@sveltejs/kit'
import type { Captured } from '../../types/Captured.js'

const defaultErrorHandler: HandleClientError = ({ error }) => {
  consoleSandbox(() => {
    console.error(error)
  })
}

export const handleErrorWithSentry: Captured<HandleClientError> =
  (handleError = defaultErrorHandler) =>
  (input) => {
    const result =
      input?.status !== 404
        ? captureException(input.error, {
            mechanism: {
              type: 'sveltekit',
              handled: false
            }
          })
        : undefined

    return handleError(input, result)
  }
