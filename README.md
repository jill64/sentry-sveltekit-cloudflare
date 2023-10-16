# sentry-sveltekit-cloudflare

[![npm](https://img.shields.io/npm/v/%40jill64%2Fsentry-sveltekit-cloudflare)](https://npmjs.com/package/@jill64/sentry-sveltekit-cloudflare)

Unofficial Sentry Integration for SvelteKit Cloudflare Adapter

Workaround until close [sentry-javascript/#8693](https://github.com/getsentry/sentry-javascript/issues/8693)

## Install

```sh
npm i @jill64/sentry-sveltekit-cloudflare
```

## Usage

```js
// hooks.client.js
import { clientInit } from '@jill64/sentry-sveltekit-cloudflare'

const onError = clientInit(
  '__YOUR_SENTRY_DSN__'
  // ,
  // {
  //   sentryOptions: {
  //     // ... Other Sentry Config
  //   },
  //   enableInDevMode: boolean (default: false)
  // }
)

export const handleError = onError((e) => {
  // Your Error Handler
})
```

```js
// hooks.server.js
import { serverInit } from '@jill64/sentry-sveltekit-cloudflare'

const { onHandle, onError } = serverInit(
  '__YOUR_SENTRY_DSN__'
  // ,
  // {
  //   toucanOptions: {
  //     // ... Other Sentry Config
  //   },
  //   handleOptions: {
  //     handleUnknownRoutes: boolean (default: false)
  //   },
  //   enableInDevMode: boolean (default: false)
  // }
)

export const handle = onHandle(({ event, resolve }) => {
  // Your Handle Code
})

export const handleError = onError((e) => {
  // Your Error Handler
})
```

## Configure Source Map (Optional)

[@sentry/vite-plugin](https://npmjs.com/package/@sentry/vite-plugin)

### Example

```js
// vite.config.js
import { sentryVitePlugin } from '@sentry/vite-plugin'
import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    sourcemap: true
  },
  plugins: [
    sentryVitePlugin({
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN
    }),
    sveltekit()
  ]
})
```
