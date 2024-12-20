import { isPrimitive } from '@sentry/core'
import type { Options } from 'toucan-js'
import { Toucan } from 'toucan-js'

export const initSentry = (
  request: Request,
  additionalOptions?: Partial<Options>
) => {
  const sentry = new Toucan({
    request,
    requestDataOptions: {
      allowedHeaders: [
        'user-agent',
        'cf-challenge',
        'accept-encoding',
        'accept-language',
        'cf-ray',
        'content-length',
        'content-type',
        'x-real-ip',
        'host'
      ],
      allowedSearchParams: /(.*)/
    },
    ...additionalOptions
  })

  const cf = 'cf' in request ? request.cf : undefined

  const colo =
    typeof cf === 'object' && cf && 'colo' in cf && isPrimitive(cf.colo)
      ? cf.colo
      : 'UNKNOWN'

  sentry.setTag('colo', colo)

  const ipAddress =
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')

  const userAgent = request.headers.get('user-agent') || ''

  sentry.setUser({ ip: ipAddress, userAgent: userAgent, colo: colo })

  return sentry
}
