import AppCard from './AppCard'
import './AppExplorer.scss'
import useNotifyProjects from '../../../utils/hooks/useNotifyProjects'
import MobileHeader from '../../layout/MobileHeader'
import IntroContent from '../../general/IntroContent'
import IntroApps from '../../general/Icon/IntroApps'

const AppExplorer = () => {
  const projects = useNotifyProjects()

  return (
    <div className="AppExplorer">
      <MobileHeader title="Discover" />
      <IntroContent
        title="Welcome to Web3Inbox"
        subtitle="Subscribe to our available apps below to start receiving notifications"
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
                  dark: app.colors?.primary ?? '#00FF00',
                  light: app.colors?.primary ?? '#00FF00'
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
