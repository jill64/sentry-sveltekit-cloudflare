import type { Options } from 'toucan-js'
import type { DevOptions } from '../../common/types/DevOptions.js'
import type { SentryHandleOptions } from './SentryHandleOptions.js'

export type InitOptions = DevOptions & {
  /**
   * Toucan Options
   * @see https://github.com/robertcepa/toucan-js/blob/master/packages/toucan-js/src/types.ts
   */
  toucanOptions?: Partial<Options>
  /**
   * Sentry Handle Options
   */
  handleOptions?: SentryHandleOptions
}
