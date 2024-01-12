import { useContext } from 'react'

import { AnimatePresence } from 'framer-motion'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

import ExternalLinkIcon from '@/components/general/Icon/ExternalLinkIcon'
import IntroApps from '@/components/general/Icon/IntroApps'
import PlusIcon from '@/components/general/Icon/PlusIcon'
import IntroContent from '@/components/general/IntroContent'
import Text from '@/components/general/Text'
import MobileHeader from '@/components/layout/MobileHeader'
import { web3InboxURLs } from '@/constants/navigation'
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
    if (!subscriptionsFinishedLoading) {
      const existInSubscriptions = activeSubscriptions.find(subscription => {
        const projectURL = new URL(url)
        return projectURL.hostname === subscription.metadata.appDomain
      })

      return existInSubscriptions ? false : true
    }

    return false
  }

  return (
    <AnimatePresence>
      <motion.div
        className="AppExplorer PageContainer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.33 }}
      >
        <div className="AppExplorer__submit__button">
          <Link
            to={web3InboxURLs.walletConnectWeb3Inbox}
            className="AppExplorer__submit__button__link"
            target="_blank"
          >
            <ExternalLinkIcon className="AppExplorer__submit__button__link__external__icon" />
            <PlusIcon className="AppExplorer__submit__button__link__plus__icon" />
            <Text variant="small-400">Submit app</Text>
          </Link>
        </div>
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
