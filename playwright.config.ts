import { defineConfig } from '@playwright/test'

export default defineConfig({
  use: {
    baseURL: 'https://dev.sentry-sveltekit-cloudflare.pages.dev'
  },
  testDir: 'tests',
  testMatch: /(.+\.)?(test|spec)\.[jt]s/
})
