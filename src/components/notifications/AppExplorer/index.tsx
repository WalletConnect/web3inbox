import BackButton from '../../general/BackButton'
import AppCard from './AppCard'
import './AppExplorer.scss'
import useNotifyProjects from '../../../utils/hooks/useNotifyProjects'
import Button from '../../general/Button'

import IntroContent from '../../general/IntroContent'
import IntroApps from '../../general/Icon/IntroApps'
import MobileHeader from '../../layout/MobileHeader'

const AppExplorer = () => {
  const projects = useNotifyProjects()

  return (
    <div className="AppExplorer">
      <MobileHeader title="Discover" />
      {/* <BackButton backTo="/notifications">Notifications</BackButton> */}
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
