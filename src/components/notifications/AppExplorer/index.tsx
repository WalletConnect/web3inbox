import { useContext, useMemo } from 'react'
import { useSearch } from '../../../utils/hooks'
import BackButton from '../../general/BackButton'
import AppCard from './AppCard'
import './AppExplorer.scss'
import AppExplorerHeader from './AppExplorerHeader'
import useNotifyProjects from '../../../utils/hooks/useNotifyProjects'
import W3iContext from '../../../contexts/W3iContext/context'
import Button from '../../general/Button'

import IntroContent from '../../general/IntroContent'
import IntroApps from '../../general/Icon/IntroApps'

const AppExplorer = () => {
  const projects = useNotifyProjects()
  // const { activeSubscriptions } = useContext(W3iContext)

  return (
    <div className="AppExplorer">
      <BackButton backTo="/notifications">Notifications</BackButton>
      <IntroContent
        title="Welcome to Web3Inbox"
        subtitle="Subscribing to our available apps below to start receiving notifications"
        button={
          <Button
            onClick={() => {
              // TODO: Subscribe all function
            }}
            style={{ minWidth: 'fit-content' }}
          >
            {'Subscribe all'}
          </Button>
        }
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
                  dark: app.colors?.primary ?? '#000',
                  light: app.colors?.primary ?? '#fff'
                }}
                logo={app.icons[0]}
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
                  dark: app.colors?.primary ?? '#000',
                  light: app.colors?.primary ?? '#fff'
                }}
                logo={app.icons[0]}
                url={app.url}
              />
            ))}
        </div>
      </div>
    </div>
  )
}

export default AppExplorer
