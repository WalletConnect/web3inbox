import { useMemo } from 'react'
import { useSearch } from '../../../utils/hooks'
import BackButton from '../../general/BackButton'
import { myAppsMock } from '../AppSelector'
import AppCard from './AppCard'
import './AppExplorer.scss'
import AppExplorerHeader from './AppExplorerHeader'

const AppExplorer = () => {
  const { appSearchTerm } = useSearch()
  const filteredApps = useMemo(
    () =>
      myAppsMock.filter(app =>
        appSearchTerm
          ? app.name.includes(appSearchTerm) ||
            app.description.includes(appSearchTerm) ||
            app.url.includes(appSearchTerm)
          : myAppsMock
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
            .map(app => (
              <AppCard
                key={app.id}
                name={app.name}
                description={app.description}
                bgColor={app.color}
                logo={app.logo}
                url={app.url}
              />
            ))}
        </div>
        <div className="AppExplorer__apps__column">
          {filteredApps
            .filter((_, i) => i % 2 !== 0)
            .map(app => (
              <AppCard
                key={app.id}
                name={app.name}
                description={app.description}
                bgColor={app.color}
                logo={app.logo}
                url={app.url}
              />
            ))}
        </div>
      </div>
    </div>
  )
}

export default AppExplorer
