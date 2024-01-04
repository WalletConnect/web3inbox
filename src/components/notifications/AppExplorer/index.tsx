import { useContext } from 'react'

import { AnimatePresence } from 'framer-motion'
import { motion } from 'framer-motion'

import IntroApps from '@/components/general/Icon/IntroApps'
import IntroContent from '@/components/general/IntroContent'
import MobileHeader from '@/components/layout/MobileHeader'
import SettingsContext from '@/contexts/SettingsContext/context'
import useNotifyProjects from '@/utils/hooks/useNotifyProjects'

import AppCard from './AppCard'
import AppCardSkeleton from './AppCardSkeleton'

import './AppExplorer.scss'

const AppExplorer = () => {
  const { projects, loading } = useNotifyProjects()
  const { filterAppDomain } = useContext(SettingsContext)

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
              {projects
                .filter((_, i) => i % 2 === 0)
                .filter(app => Boolean(app.name))
                .map(app => (
                  <AppCard
                    key={app.name}
                    name={app.name}
                    description={app.description}
                    bgColor={{
                      dark: app.colors?.primary ?? '#00FF00',
                      light: app.colors?.primary ?? '#00FF00'
                    }}
                    logo={app.icons?.[0] || '/fallback.svg'}
                    url={app.url}
                    isVerified={app.isVerified}
                  />
                ))}
            </div>
            <div className="AppExplorer__apps__column">
              {projects
                .filter((_, i) => i % 2 !== 0)
                .map(app => (
                  <AppCard
                    key={app.name}
                    name={app.name}
                    description={app.description}
                    bgColor={{
                      dark: app.colors?.primary ?? '#00FF00',
                      light: app.colors?.primary ?? '#00FF00'
                    }}
                    logo={app.icons?.[0] || '/fallback.svg'}
                    url={app.url}
                    isVerified={app.isVerified}
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
