<!----- BEGIN GHOST DOCS HEADER ----->

# sentry-sveltekit-cloudflare

[![npm-version](https://img.shields.io/npm/v/@jill64/sentry-sveltekit-cloudflare)](https://npmjs.com/package/@jill64/sentry-sveltekit-cloudflare) [![npm-license](https://img.shields.io/npm/l/@jill64/sentry-sveltekit-cloudflare)](https://npmjs.com/package/@jill64/sentry-sveltekit-cloudflare) [![npm-download-month](https://img.shields.io/npm/dm/@jill64/sentry-sveltekit-cloudflare)](https://npmjs.com/package/@jill64/sentry-sveltekit-cloudflare) [![npm-min-size](https://img.shields.io/bundlephobia/min/@jill64/sentry-sveltekit-cloudflare)](https://npmjs.com/package/@jill64/sentry-sveltekit-cloudflare) [![ci.yml](https://github.com/jill64/sentry-sveltekit-cloudflare/actions/workflows/ci.yml/badge.svg)](https://github.com/jill64/sentry-sveltekit-cloudflare/actions/workflows/ci.yml)

♟️ Unofficial Sentry Integration for SvelteKit Cloudflare Adapter

## Installation

```sh
npm i @jill64/sentry-sveltekit-cloudflare
```

<!----- END GHOST DOCS HEADER ----->

Workaround until close [@sentry/javascript #8291](https://github.com/getsentry/sentry-javascript/issues/8291)

## Configuration

Add the following settings to your SvelteKit application's `vite.config.js`.

```js
// vite.config.js
import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [sveltekit()],
  ssr: {
    noExternal: ['@jill64/sentry-sveltekit-cloudflare']
  }
  // ...
})
```

## Usage

### Client

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

### Server

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

Use [@sentry/vite-plugin](https://npmjs.com/package/@sentry/vite-plugin).

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
