import { consoleSandbox } from '@sentry/utils'
import { HandleClientError } from '@sveltejs/kit'
import { Captured } from '../../common/types/Captured.js'
import { captureException } from './index.js'

const defaultErrorHandler: HandleClientError = ({ error }) => {
  consoleSandbox(() => {
    console.error(error)
  })
}

export const handleErrorWithSentry: Captured<HandleClientError> =
  (handleError = defaultErrorHandler) =>
  (input) => {
    const result = captureException(input.error, {
      mechanism: {
        type: 'sveltekit',
        handled: false
      }
    })

    return handleError(input, result)
  }
