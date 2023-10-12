import AppCard from './AppCard'
import './AppExplorer.scss'
import useNotifyProjects from '../../../utils/hooks/useNotifyProjects'
import MobileHeader from '../../layout/MobileHeader'
import IntroContent from '../../general/IntroContent'
import IntroApps from '../../general/Icon/IntroApps'
import { AnimatePresence } from 'framer-motion'
import { motion } from 'framer-motion'

const AppExplorer = () => {
  const projects = useNotifyProjects()

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
          title="Welcome to Web3Inbox"
          subtitle="Subscribe to our available apps below to start receiving notifications"
          scale={2.5}
          icon={<IntroApps />}
        />
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
                  logo={app.icons?.length ? app.icons[0] : '/fallback.svg'}
                  url={app.url}
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
                  logo={app.icons?.length ? app.icons[0] : '/fallback.svg'}
                  url={app.url}
                />
              ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default AppExplorer
