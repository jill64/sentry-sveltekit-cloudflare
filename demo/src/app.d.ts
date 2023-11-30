declare global {
  namespace App {
    interface Error {
      message: string
      sentryEventId?: string
    }
  }
}

export {}
