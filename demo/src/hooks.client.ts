import { clientInit } from '$dist/index.js'
import { toast } from '@jill64/svelte-toast'
import { get } from 'svelte/store'

const onError = clientInit('https://7e30b84f392c05d4a9a21e30f3ef6801@o4505814639312896.ingest.sentry.io/4505817123323904')

export const handleError = onError((e) => {
  console.error(e)
  if (e.error instanceof Error) {
    get(toast).error(e.error.message)
  }
})
