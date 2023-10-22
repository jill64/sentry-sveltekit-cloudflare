import { SDK_VERSION } from '@sentry/core'
import { BrowserOptions } from '@sentry/svelte'

const PACKAGE_NAME_PREFIX = 'npm:@sentry/'

export const applySdkMetadata =(options: BrowserOptions, names: string[]) =>{
  options._metadata = options._metadata || {}
  options._metadata.sdk = options._metadata.sdk || {
    name: 'sentry.javascript.sveltekit',
    packages: names.map((name) => ({
      name: `${PACKAGE_NAME_PREFIX}${name}`,
      version: SDK_VERSION
    })),
    version: SDK_VERSION
  }
}