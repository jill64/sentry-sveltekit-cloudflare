import { HandleServerError } from '@sveltejs/kit'

export const isNotFoundError = (input: Parameters<HandleServerError>[0]) => {
  const { error, event } = input

  const hasNoRouteId = !event.route || !event.route.id

  const rawStack =
    (error != null &&
      typeof error === 'object' &&
      'stack' in error &&
      typeof error.stack === 'string' &&
      error.stack) ||
    ''

  return hasNoRouteId && rawStack.startsWith('Error: Not found:')
}
