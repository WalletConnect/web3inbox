import ExplorerIcon from '../../../../assets/Explorer.svg'
import Select from '../../../general/Select/Select'
import './AppExplorerHeader.scss'

const AppExplorerHeader = () => {
  return (
    <div className="AppExplorerHeader">
      <div className="AppExplorerHeader__title">
        <img src={ExplorerIcon} alt="Compass" />
        <span>Explore Apps</span>
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
