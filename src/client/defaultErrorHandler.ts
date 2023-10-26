import { HandleClientError } from '@sveltejs/kit'

export const defaultErrorHandler: HandleClientError = ({ error }) => {
  console.error(error)
}
