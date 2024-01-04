import { NotifyClientTypes } from '@walletconnect/notify-client'

import { INotifyApp } from '@/utils/types'

export function checkIsUnVerified(
  app: NotifyClientTypes.NotifySubscription,
  projects: INotifyApp[]
) {
  return projects.some(
    project => project.url.includes(app.metadata.appDomain) && project.isVerified !== true
  )
}
