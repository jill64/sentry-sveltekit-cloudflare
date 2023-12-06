import { extendsConfig } from '@jill64/playwright-config'

const ref_name = process.env.GITHUB_REF_NAME?.replaceAll('/', '-')
  .replace('.', '-')
  .slice(0, 28)

export default extendsConfig(
  process.env.CI
    ? {
        use: {
          baseURL:
            ref_name === 'main'
              ? 'https://sentry-sveltekit-cloudflare.pages.dev'
              : `https://${ref_name}.sentry-sveltekit-cloudflare.pages.dev`
        }
      }
    : {
        webServer: {
          command: 'npm run preview',
          port: 4173
        }
      }
)
