import { HandleServerError } from '@sveltejs/kit'

export const defaultErrorHandler: HandleServerError = ({ error }) => {
  console.error(
    typeof error === 'object' && error && 'stack' in error
      ? error && error.stack
      : error
  )
}
