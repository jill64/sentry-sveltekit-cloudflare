import { extendsConfig } from '@jill64/playwright-config'

const ref_name = process.env.GITHUB_REF_NAME

export default extendsConfig({
  use: {
    baseURL:
      ref_name === 'main'
        ? 'https://sentry-sveltekit-cloudflare.pages.dev'
        : `https://${ref_name}.sentry-sveltekit-cloudflare.pages.dev`
  }
})
