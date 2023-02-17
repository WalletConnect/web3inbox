import ExplorerIcon from '../../../../assets/Explorer.svg'
import { useIsMobile } from '../../../../utils/hooks'
import Select from '../../../general/Select/Select'
import MobileHeader from '../../../layout/MobileHeader'
import './AppExplorerHeader.scss'

const AppExplorerHeader = () => {
  const isMobile = useIsMobile()

  return isMobile ? (
    <MobileHeader>Explore Apps</MobileHeader>
  ) : (
    <div className="AppExplorerHeader">
      <div className="AppExplorerHeader__title">
        <img src={ExplorerIcon} alt="Compass" />
        <h1>Explore Apps</h1>
      </div>
      <div className="AppExplorerHeader__selector">
        <Select
          name="explorer-selector"
          id="explorer-selector"
          onChange={console.log}
          options={[
            { label: 'All', value: 'all' },
            { label: 'DeFi', value: 'defi' }
          ]}
        />
      </div>
    </div>
  )
}

export default AppExplorerHeader
