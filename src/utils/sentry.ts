import * as Sentry from '@sentry/react'

export const initSentry = () => {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [
      new Sentry.BrowserTracing({
        tracePropagationTargets: ['https://web3inbox-dev-hidden.vercel.app']
      })
    ],
    tracesSampleRate: 0.2,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0
  })
}
