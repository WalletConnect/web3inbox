import { captureException } from '@sentry/react'

const errorCodeMessageMap = {
  socketStalled: 'Socket stalled when trying to connect to wss://relay.walletconnect.org'
}

export const getErrorMessage = (error: unknown, defaultMessage: string) => {
  if (error?.message?.includes('timeout')) {
    return 'Failed to subscribe, check your connection and try again'
  }

  switch (error?.message) {
    case errorCodeMessageMap.socketStalled:
      return 'Failed to subscribe, check your connection and try again'
    default:
      return defaultMessage || error?.message
  }
}

export const logError = (error: unknown) => {
  console.error(error)
  if (error?.message === errorCodeMessageMap.socketStalled) {
    return
  }
  captureException(error)
}
