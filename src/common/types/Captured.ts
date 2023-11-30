import type { captureException } from '@sentry/sveltekit'
import { HandleClientError, HandleServerError } from '@sveltejs/kit'

export type Captured<
  HandleError extends HandleServerError | HandleClientError
> = (
  handleError?: (
    input: Parameters<HandleError>[0],
    sentryEventId?: ReturnType<typeof captureException>
  ) => ReturnType<HandleError>
) => HandleError
