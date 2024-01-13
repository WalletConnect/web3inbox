import { AnimatePresence } from 'framer-motion'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

import ExternalLinkIcon from '@/components/general/Icon/ExternalLinkIcon'
import IntroApps from '@/components/general/Icon/IntroApps'
import PlusIcon from '@/components/general/Icon/PlusIcon'
import IntroContent from '@/components/general/IntroContent'
import Text from '@/components/general/Text'
import MobileHeader from '@/components/layout/MobileHeader'
import AppExplorerColumns from '@/components/notifications/AppExplorer/AppExplorerColumn'
import AppExplorerSkeleton from '@/components/notifications/AppExplorer/AppExplorerSkeleton'
import { web3InboxURLs } from '@/constants/navigation'
import { COMING_SOON_PROJECTS } from '@/constants/projects'
import useNotifyProjects from '@/utils/hooks/useNotifyProjects'

import './AppExplorer.scss'

const AppExplorer = () => {
  const { projects, loading } = useNotifyProjects()

  const allProjects = projects.concat(COMING_SOON_PROJECTS)

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
          <AppExplorerSkeleton />
        ) : (
          <div className="AppExplorer__apps">
            <AppExplorerColumns apps={allProjects} />
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

export default AppExplorer
