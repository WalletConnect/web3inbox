import { useContext, useMemo } from 'react'
import { useSearch } from '../../../utils/hooks'
import BackButton from '../../general/BackButton'
import AppCard from './AppCard'
import './AppExplorer.scss'
import AppExplorerHeader from './AppExplorerHeader'
import usePushProjects from '../../../utils/hooks/usePushProjects'
import W3iContext from '../../../contexts/W3iContext/context'

const AppExplorer = () => {
  const { appSearchTerm } = useSearch()
  const projects = usePushProjects()
  const { activeSubscriptions } = useContext(W3iContext)

  const filteredApps = useMemo(
    () =>
      projects.filter(app => {
        if (appSearchTerm) {
          return (
            app.name.includes(appSearchTerm) ||
            app.description.includes(appSearchTerm) ||
            app.url.includes(appSearchTerm)
          )
        }

        const activeSubscriptionAppNames = activeSubscriptions.map(sub => sub.metadata.url)

        return !activeSubscriptionAppNames.includes(app.url)
      }),
    [appSearchTerm, projects, activeSubscriptions]
  )

  return (
    <div className="AppExplorer">
      <BackButton backTo="/notifications">Notifications</BackButton>
      <AppExplorerHeader />
      <div className="AppExplorer__apps">
        <div className="AppExplorer__apps__column">
          {filteredApps
            .filter((_, i) => i % 2 === 0)
            .filter(app => Boolean(app.name))
            .map(app => (
              <AppCard
                key={app.name}
                name={app.name}
                description={app.description}
                bgColor={{
                  dark: app.colors.primary ?? '#000',
                  light: app.colors.primary ?? '#fff'
                }}
                logo={app.icons[0]}
                url={app.url}
              />
            ))}
        </div>
        <div className="AppExplorer__apps__column">
          {filteredApps
            .filter((_, i) => i % 2 !== 0)
            .map(app => (
              <AppCard
                key={app.name}
                name={app.name}
                description={app.description}
                bgColor={{
                  dark: app.colors.primary ?? '#000',
                  light: app.colors.primary ?? '#fff'
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
