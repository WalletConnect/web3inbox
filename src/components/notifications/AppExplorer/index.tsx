import { useMemo, useContext } from 'react'
import { useSearch } from '../../../utils/hooks'
import W3iContext from '../../../contexts/W3iContext/context'
import BackButton from '../../general/BackButton'
import AppCard from './AppCard'
import './AppExplorer.scss'
import AppExplorerHeader from './AppExplorerHeader'

const AppExplorer = () => {
  const { appSearchTerm } = useSearch()
  const { activeSubscriptions } = useContext(W3iContext)
  const filteredApps = useMemo(
    () =>
      activeSubscriptions.filter(app =>
        appSearchTerm
          ? app.metadata.name.includes(appSearchTerm) ||
            app.metadata.description.includes(appSearchTerm) ||
            app.metadata.url.includes(appSearchTerm)
          : activeSubscriptions
      ),
    [appSearchTerm]
  )

  return (
    <div className="AppExplorer">
      <BackButton backTo="/notifications">Notifications</BackButton>
      <AppExplorerHeader />
      <div className="AppExplorer__apps">
        <div className="AppExplorer__apps__column">
          {filteredApps
            .filter((_, i) => i % 2 === 0)
            .filter(app => Boolean(app.metadata))
            .map(app => (
              <AppCard
                key={app.topic}
                name={app.metadata.name}
                description={app.metadata.description}
                bgColor={{ dark: '#000', light: '#fff' }}
                logo={app.metadata.icons[0]}
                url={app.metadata.url}
              />
            ))}
        </div>
        <div className="AppExplorer__apps__column">
          {filteredApps
            .filter((_, i) => i % 2 !== 0)
            .map(app => (
              <AppCard
                key={app.topic}
                name={app.metadata.name}
                description={app.metadata.description}
                bgColor={{ dark: '#000', light: '#fff' }}
                logo={app.metadata.icons[0]}
                url={app.metadata.url}
              />
            ))}
        </div>
      </div>
    </div>
  )
}

export default AppExplorer
