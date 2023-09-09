import { Handle } from '@sveltejs/kit'

export const defaultHandler: Handle = ({ event, resolve }) => resolve(event)
