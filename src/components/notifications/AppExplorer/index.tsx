import { useContext } from 'react'

import { AnimatePresence } from 'framer-motion'
import { motion } from 'framer-motion'

import IntroApps from '@/components/general/Icon/IntroApps'
import IntroContent from '@/components/general/IntroContent'
import MobileHeader from '@/components/layout/MobileHeader'
import { COMING_SOON_PROJECTS } from '@/constants/projects'
import W3iContext from '@/contexts/W3iContext/context'
import useNotifyProjects from '@/utils/hooks/useNotifyProjects'

import AppCard from './AppCard'
import AppCardSkeleton from './AppCardSkeleton'

import './AppExplorer.scss'

const AppExplorer = () => {
  const { activeSubscriptions, watchSubscriptionsComplete: subscriptionsFinishedLoading } =
    useContext(W3iContext)
  const { projects, loading } = useNotifyProjects()

  const allProjects = projects.concat(COMING_SOON_PROJECTS)

  const checkSubscriptionStatusLoading = (url: string) => {
    const existInSubscriptions = activeSubscriptions.find(subscription => {
      const projectURL = new URL(url)
      return projectURL.hostname === subscription.metadata.appDomain
    })

    if (!subscriptionsFinishedLoading) {
      return existInSubscriptions ? false : true
    }

    return false
  }

  return (
    <AnimatePresence>
      <motion.div
        className="AppExplorer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.33 }}
      >
        <MobileHeader title="Discover" />
        <IntroContent
          animation={true}
          title="Discover Web3Inbox"
          subtitle="Subscribe to our available apps below to start receiving notifications"
          scale={2.5}
          icon={<IntroApps />}
        />
        {loading ? (
          <div className="AppExplorer__apps">
            <div className="AppExplorer__apps__column">
              <AppCardSkeleton />
              <AppCardSkeleton />
              <AppCardSkeleton />
              <AppCardSkeleton />
            </div>
            <div className="AppExplorer__apps__column">
              <AppCardSkeleton />
              <AppCardSkeleton />
              <AppCardSkeleton />
              <AppCardSkeleton />
            </div>
          </div>
        ) : (
          <div className="AppExplorer__apps">
            <div className="AppExplorer__apps__column">
              {allProjects
                .filter((_, i) => i % 2 === 0)
                .map(app => (
                  <AppCard
                    key={app.id}
                    name={app.name}
                    description={app.description}
                    logo={app.icon}
                    url={app.url}
                    isVerified={app.isVerified}
                    isComingSoon={app.isComingSoon}
                    loadingSubscription={checkSubscriptionStatusLoading(app.url)}
                  />
                ))}
            </div>
            <div className="AppExplorer__apps__column">
              {allProjects
                .filter((_, i) => i % 2 !== 0)
                .map(app => (
                  <AppCard
                    key={app.id}
                    name={app.name}
                    description={app.description}
                    logo={app.icon}
                    url={app.url}
                    isVerified={app.isVerified}
                    isComingSoon={app.isComingSoon}
                    loadingSubscription={checkSubscriptionStatusLoading(app.url)}
                  />
                ))}
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

export default AppExplorer
