import { PUBLIC_SENTRY_DSN } from '$env/static/public'
import { clientInit } from '$lib/clientInit.js'

const onError = clientInit({
  dsn: PUBLIC_SENTRY_DSN
})

export const handleError = onError((e) => {
  console.error(e)
})
