import { HandleServerError } from '@sveltejs/kit'

type HandleServerErrorInput = Parameters<HandleServerError>[0]

/**
 * Backwards-compatible HandleServerError Input type for SvelteKit 1.x and 2.x
 * `message` and `status` were added in 2.x.
 * For backwards-compatibility, we make them optional
 *
 * @see https://kit.svelte.dev/docs/migrating-to-sveltekit-2#improved-error-handling
 */
type SafeHandleServerErrorInput = Omit<
  HandleServerErrorInput,
  'status' | 'message'
> &
  Partial<Pick<HandleServerErrorInput, 'status' | 'message'>>

export const isNotFoundError = (input: SafeHandleServerErrorInput): boolean => {
  const { error, event, status } = input

  // SvelteKit 2.0 offers a reliable way to check for a Not Found error:
  if (status === 404) {
    return true
  }

  // SvelteKit 1.x doesn't offer a reliable way to check for a Not Found error.
  // So we check the route id (shouldn't exist) and the raw stack trace
  // We can delete all of this below whenever we drop Kit 1.x support
  const hasNoRouteId = !event.route || !event.route.id

  const rawStack: string =
    (error != null &&
      typeof error === 'object' &&
      'stack' in error &&
      typeof error.stack === 'string' &&
      error.stack) ||
    ''

  return hasNoRouteId && rawStack.startsWith('Error: Not found:')
}
