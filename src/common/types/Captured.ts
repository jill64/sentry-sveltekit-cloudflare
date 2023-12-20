import { HandleClientError, HandleServerError } from '@sveltejs/kit'
import type { captureException } from '../../sentry-sveltekit/types/index.types.js'

export type Captured<
  HandleError extends HandleServerError | HandleClientError
> = (
  handleError?: (
    input: Parameters<HandleError>[0],
    sentryEventId?: ReturnType<typeof captureException>
  ) => ReturnType<HandleError>
) => HandleError
