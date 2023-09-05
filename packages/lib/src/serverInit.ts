import {
  getActiveTransaction,
  getCurrentHub,
  runWithAsyncContext,
  trace
} from '@sentry/core'
import {
  dynamicSamplingContextToSentryBaggageHeader,
  isPrimitive,
  objectify,
  tracingContextFromHeaders
} from '@sentry/utils'
import type {
  Handle,
  HandleServerError,
  HttpError,
  RequestEvent,
  ResolveOptions
} from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'
import { DEV } from 'esm-env'
import type { Options } from 'toucan-js'
import Toucan from 'toucan-js'

const initSentry = (request: Request, additionalOptions?: Partial<Options>) => {
  const sentry = new Toucan({
    request,
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
    allowedSearchParams: /(.*)/,
    rewriteFrames: {
      root: '/'
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

type SentryHandleOptions = {
  handleUnknownRoutes?: boolean
}

const isRedirect = (error: unknown) => {
  if (error == null || typeof error !== 'object') {
    return false
  }

  const hasValidLocation =
    'location' in error && typeof error.location === 'string'

  const hasValidStatus =
    'status' in error &&
    typeof error.status === 'number' &&
    error.status >= 300 &&
    error.status <= 308

  return hasValidLocation && hasValidStatus
}

const getTracePropagationData = (event: RequestEvent) => {
  const sentryTraceHeader = event.request.headers.get('sentry-trace') || ''
  const baggageHeader = event.request.headers.get('baggage')
  return tracingContextFromHeaders(sentryTraceHeader, baggageHeader)
}

const isHttpError = (err: unknown): err is HttpError =>
  typeof err === 'object' && err !== null && 'status' in err && 'body' in err

const FETCH_PROXY_SCRIPT = `
    const f = window.fetch;
    if(f){
      window._sentryFetchProxy = function(...a){return f(...a)}
      window.fetch = function(...a){return window._sentryFetchProxy(...a)}
    }
`

const transformPageChunk: NonNullable<ResolveOptions['transformPageChunk']> = ({
  html
}) => {
  const transaction = getActiveTransaction()
  if (transaction) {
    const traceparentData = transaction.toTraceparent()
    const dynamicSamplingContext = dynamicSamplingContextToSentryBaggageHeader(
      transaction.getDynamicSamplingContext()
    )
    const content = `<head>
  <meta name="sentry-trace" content="${traceparentData}"/>
  <meta name="baggage" content="${dynamicSamplingContext}"/>
  <script>${FETCH_PROXY_SCRIPT}
  </script>
  `
    return html.replace('<head>', content)
  }

  return html
}

const defaultHandler: Handle = ({ event, resolve }) => resolve(event)

const defaultErrorHandler: HandleServerError = ({ error }) => {
  console.error(
    typeof error === 'object' && error && 'stack' in error
      ? error && error.stack
      : error
  )
}

const isNotFoundError = (input: Parameters<HandleServerError>[0]) => {
  const { error, event } = input

  const hasNoRouteId = !event.route || !event.route.id

  const rawStack =
    (error != null &&
      typeof error === 'object' &&
      'stack' in error &&
      typeof error.stack === 'string' &&
      error.stack) ||
    ''

  return hasNoRouteId && rawStack.startsWith('Error: Not found:')
}

const instrumentHandle = (arg: {
  input: Parameters<Handle>[0]
  init: (event: RequestEvent) => ReturnType<typeof initSentry>
  handleOptions?: SentryHandleOptions
}) => {
  const { input, handleOptions, init } = arg
  const { event, resolve } = input

  const instrumentOptions = {
    handleUnknownRoutes: false,
    ...handleOptions
  }

  if (!event.route?.id && !instrumentOptions.handleUnknownRoutes) {
    return resolve(event)
  }

  const Sentry = init(input.event)

  const { dynamicSamplingContext, traceparentData, propagationContext } =
    getTracePropagationData(event)
  getCurrentHub().getScope().setPropagationContext(propagationContext)

  return trace(
    {
      op: 'http.server',
      origin: 'auto.http.sveltekit',
      name: `${event.request.method} ${event.route?.id || event.url.pathname}`,
      status: 'ok',
      ...traceparentData,
      metadata: {
        source: event.route?.id ? 'route' : 'url',
        dynamicSamplingContext:
          traceparentData && !dynamicSamplingContext
            ? {}
            : dynamicSamplingContext
      }
    },
    async (span) => {
      const res = await resolve(event, { transformPageChunk })
      if (span) {
        span.setHttpStatus(res.status)
      }
      return res
    },
    (e) => {
      const objectifiedErr = objectify(e)

      if (
        isRedirect(objectifiedErr) ||
        (isHttpError(objectifiedErr) &&
          objectifiedErr.status < 500 &&
          objectifiedErr.status >= 400)
      ) {
        return objectifiedErr
      }

      Sentry.captureException(objectifiedErr)

      return objectifiedErr
    }
  )
}

const makeHandler = (
  dsn: string,
  arg?: {
    toucanOptions?: Partial<Options>
    handleOptions?: SentryHandleOptions
  }
) => {
  const { handleOptions, toucanOptions } = arg ?? {}

  const init = (event: RequestEvent) =>
    initSentry(event.request, {
      tracesSampleRate: 1.0,
      dsn,
      ...toucanOptions
    })

  const sentryHandle: Handle = (input) => {
    const sentryHandleOption = { input, init, handleOptions }

    return getCurrentHub().getScope().getSpan()
      ? instrumentHandle(sentryHandleOption)
      : runWithAsyncContext(() => instrumentHandle(sentryHandleOption))
  }

  const onHandle = (handle?: Handle) =>
    handle ? sequence(sentryHandle, handle) : sentryHandle

  const onError =
    (handleError = defaultErrorHandler): HandleServerError =>
    (input) => {
      if (isNotFoundError(input)) {
        return handleError(input)
      }

      const Sentry = init(input.event)

      Sentry.captureException(input.error)

      return handleError(input)
    }

  return {
    onHandle,
    onError
  }
}

export const serverInit = (
  dsn: string,
  options?: {
    toucanOptions?: Partial<Options>
    handleOptions?: SentryHandleOptions
    enableInDevMode?: boolean
  }
) => {
  const { enableInDevMode } = options ?? {}

  if (DEV && !enableInDevMode) {
    return {
      onHandle: (handle = defaultHandler) => handle,
      onError: (handleError = defaultErrorHandler) => handleError
    }
  }

  return makeHandler(dsn, options)
}
