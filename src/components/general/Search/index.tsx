import { useCallback } from 'react'
import SearchSvg from '../../../assets/Search.svg'
import { useSearch } from '../../../utils/hooks'
import { searchService } from '../../../utils/store'
import Button from '../Button'
import SearchIcon from '../Icon/SearchIcon'
import Input from '../Input'
import './Search.scss'

interface ISearchProps {
  setSearch: React.Dispatch<React.SetStateAction<string>>
}
const Search: React.FC<ISearchProps> = ({ setSearch }) => {
  const isSearchOpen = useSearch()

  const handleCloseSearch = useCallback(() => {
    setSearch('')
    searchService.closeSearch()
  }, [setSearch])

  return (
    <div className="Search">
      {!isSearchOpen && (
        <Button type="action-icon" className="Search__btn" onClick={searchService.openSearch}>
          <div style={{ width: '1em', height: '1em' }}>
            <SearchIcon />
          </div>
        </Button>
      )}
      {isSearchOpen && (
        <div className="Search__open">
          <Input
            className="Search__open__input"
            onChange={({ target }) => setSearch(target.value)}
            placeholder="Search"
            icon={SearchSvg}
          />
          <Button type="action" onClick={handleCloseSearch}>
            Cancel
          </Button>
        </div>
      )}
    </div>
  )
}

export default Search
