import { serverInit } from '$dist/index.js'
import { PUBLIC_SENTRY_DSN } from '$env/static/public'

const { onHandle, onError } = serverInit(PUBLIC_SENTRY_DSN)

export const handle = onHandle(({ event, resolve }) => {
  console.log(`${event.request.method} ${event.url.pathname}`)
  return resolve(event)
})

export const handleError = onError((e) => {
  console.error(e)
})
