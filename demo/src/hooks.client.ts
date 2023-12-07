import { init } from '$dist/client'
import { errorForTesting } from './tesingErrors'

const onError = init(
  'https://7e30b84f392c05d4a9a21e30f3ef6801@o4505814639312896.ingest.sentry.io/4505817123323904',
  {
    sentryOptions: {
      beforeSend: (event) =>
        errorForTesting.includes(event.exception?.values?.[0].value ?? '')
          ? null
          : event
    }
  }
)

export const handleError = onError((_, sentryEventId) => ({
  message: 'This error was successfully sent to Sentry',
  sentryEventId
}))
