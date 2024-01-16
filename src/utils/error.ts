import { captureException } from '@sentry/react'

export const logError = (error: any) => {
  console.error(error)
  captureException(error)
}
