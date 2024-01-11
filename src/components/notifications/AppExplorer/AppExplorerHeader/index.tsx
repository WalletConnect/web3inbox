import ExplorerIcon from '@/assets/Explorer.svg'
import Search from '@/components/general/Search'
import Select from '@/components/general/Select/Select'
import MobileHeading from '@/components/layout/MobileHeading'
import { useIsMobile, useSearch } from '@/utils/hooks'
import { appSearchService } from '@/utils/store'

import './AppExplorerHeader.scss'

const AppExplorerHeader = () => {
  const isMobile = useIsMobile()
  const { isAppSearchOpen } = useSearch()

  function handleSelectExplorer() {}

  return isMobile ? (
    <div className="AppExplorerHeader">
      {!isAppSearchOpen && <MobileHeading>Discover Apps</MobileHeading>}
      <Search
        isSearchOpen={isAppSearchOpen}
        closeSearch={appSearchService.closeSearch}
        openSearch={appSearchService.openSearch}
        setSearch={appSearchService.setSearch}
      />
    </div>
  ) : (
    <div className="AppExplorerHeader">
      <div className="AppExplorerHeader__title">
        <img src={ExplorerIcon} alt="Compass" />
        <h1>Discover Apps</h1>
      </div>
      <div className="AppExplorerHeader__selector">
        <Select
          name="explorer-selector"
          id="explorer-selector"
          onChange={handleSelectExplorer}
          options={[{ label: 'All', value: 'all' }]}
        />
      </div>
    </div>
  )
}

export default AppExplorerHeader
