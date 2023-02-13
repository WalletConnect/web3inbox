import BackButton from '../../general/BackButton'
import { myAppsMock } from '../AppSelector'
import AppCard from './AppCard'
import './AppExplorer.scss'
import AppExplorerHeader from './AppExplorerHeader'

const AppExplorer = () => {
  return (
    <div className="AppExplorer">
      <BackButton backTo="/notifications" />
      <AppExplorerHeader />
      <div className="AppExplorer__apps">
        <div className="AppExplorer__apps__column">
          {myAppsMock
            .filter((_, i) => i % 2 === 0)
            .map(app => (
              <AppCard
                name={app.name}
                description={app.description}
                bgColor={app.color}
                logo={app.logo}
                url={app.url}
              />
            ))}
        </div>
        <div className="AppExplorer__apps__column">
          {myAppsMock
            .filter((_, i) => i % 2 !== 0)
            .map(app => (
              <AppCard
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
