import { serverInit } from '$dist/index.js'

const { onHandle, onError } = serverInit(
  'https://7e30b84f392c05d4a9a21e30f3ef6801@o4505814639312896.ingest.sentry.io/4505817123323904'
)

export const handle = onHandle(({ event, resolve }) => {
  console.log(`${event.request.method} ${event.url.pathname}`)
  return resolve(event)
})

export const handleError = onError((e, sentryEventId) => {
  console.error(e)

  return {
    message: 'This error was successfully sent to Sentry',
    sentryEventId
  }
})
