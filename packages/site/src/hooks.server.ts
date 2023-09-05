import { building, dev } from '$app/environment'
import { PREVIEW_AUTH_TOKEN } from '$env/static/private'
import { PUBLIC_SENTRY_DSN } from '$env/static/public'
import { serverInit } from '$dist/index.js'
import { redirect } from '@sveltejs/kit'

const { onHandle, onError } = serverInit(PUBLIC_SENTRY_DSN)

export const handle = onHandle(({ event, resolve }) => {
  console.log(`${event.request.method} ${event.url.pathname}`)

  if (!building && !dev) {
    const token = event.url.searchParams.get('token')
    if (token !== PREVIEW_AUTH_TOKEN) {
      throw redirect(
        301,
        'https://github.com/jill64/sentry-sveltekit-cloudflare#readme'
      )
    }
  }

  return resolve(event)
})

export const handleError = onError((e) => {
  console.error(e)
})
