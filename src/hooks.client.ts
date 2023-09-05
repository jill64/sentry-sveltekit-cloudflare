import { PUBLIC_SENTRY_DSN } from '$env/static/public'
import { clientInit } from '$lib/clientInit.js'
import { toast } from 'svelte-french-toast'

const onError = clientInit(PUBLIC_SENTRY_DSN)

export const handleError = onError((e) => {
  console.error(e)
  if (e.error instanceof Error) {
    toast.error(e.error.message)
  }
})
