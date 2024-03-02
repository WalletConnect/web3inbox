import { Fragment, useContext } from 'react'

import AppCard from '@/components/notifications/AppExplorer/AppCard'
import W3iContext from '@/contexts/W3iContext/context'
import useBreakPoint from '@/hooks/useBreakPoint'
import { INotifyApp } from '@/utils/types'

type AppExplorerColumnsProps = {
  apps: Array<INotifyApp>
}

export default function AppExplorerColumns({ apps }: AppExplorerColumnsProps) {
  const { isDesktopLg } = useBreakPoint()
  const { activeSubscriptions, watchSubscriptionsComplete: watchCompleted } = useContext(W3iContext)

  function checkSubscriptionStatusLoading(url: string) {
    if (!watchCompleted) {
      const existInSubscriptions = activeSubscriptions.find(subscription => {
        const projectURL = new URL(url)
        return projectURL.hostname === subscription.metadata.appDomain
      })

      return existInSubscriptions ? false : true
    }

    return false
  }

  if (!isDesktopLg) {
    return (
      <div className="AppExplorer__apps__column">
        {apps.map((app, i) => (
          <AppCard
            key={app.id}
            name={app.name}
            description={app.description}
            logo={app.icon}
            url={app.url}
            isFeatured={app.isFeatured}
            isComingSoon={app.isComingSoon}
            loadingSubscription={checkSubscriptionStatusLoading(app.url)}
          />
        ))}
      </div>
    )
  }

  return (
    <Fragment>
      <div className="AppExplorer__apps__column">
        {apps
          .filter((_, i) => i % 2 === 0)
          .map(app => (
            <AppCard
              key={app.id}
              name={app.name}
              description={app.description}
              logo={app.icon}
              url={app.url}
              isFeatured={app.isFeatured}
              isComingSoon={app.isComingSoon}
              loadingSubscription={checkSubscriptionStatusLoading(app.url)}
            />
          ))}
      </div>
      <div className="AppExplorer__apps__column">
        {apps
          .filter((_, i) => i % 2 !== 0)
          .map(app => (
            <AppCard
              key={app.id}
              name={app.name}
              description={app.description}
              logo={app.icon}
              url={app.url}
              isFeatured={app.isFeatured}
              isComingSoon={app.isComingSoon}
              loadingSubscription={checkSubscriptionStatusLoading(app.url)}
            />
          ))}
      </div>
    </Fragment>
  )
}
