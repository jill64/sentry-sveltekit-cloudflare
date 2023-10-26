import { HttpError } from '@sveltejs/kit'

export const isHttpError = (err: unknown): err is HttpError =>
  typeof err === 'object' && err !== null && 'status' in err && 'body' in err
