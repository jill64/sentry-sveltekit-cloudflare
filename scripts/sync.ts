import { cp, rm } from 'node:fs/promises'

const dest = 'src/sentry-sveltekit'

await rm(dest, { recursive: true, force: true })

await cp('node_modules/@sentry/sveltekit', dest, {
  recursive: true,
  dereference: true,
  force: true
})
