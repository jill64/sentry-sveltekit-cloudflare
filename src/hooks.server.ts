import { PUBLIC_SENTRY_DSN } from '$env/static/public'
import { serverInit } from '$lib/index.js'

const { onHandle, onError } = serverInit(PUBLIC_SENTRY_DSN)

export const handle = onHandle(({ event, resolve }) => {
  console.log(`${event.request.method} ${event.url.href}`)
  return resolve(event)
})

export const handleError = onError((e) => {
  console.error(e)
})
