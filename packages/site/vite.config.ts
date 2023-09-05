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
  ],
  server: {
    fs: {
      allow: ['../../dist']
    }
  }
})
