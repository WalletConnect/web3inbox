import SearchSvg from '../../../assets/Search.svg'
import { useSearch } from '../../../utils/hooks'
import { searchService } from '../../../utils/store'
import Button from '../Button'
import SearchIcon from '../Icon/SearchIcon'
import Input from '../Input'
import './Search.scss'

interface ISearchProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}
const Search: React.FC<ISearchProps> = ({ onChange }) => {
  const isSearchOpen = useSearch()

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
            onChange={onChange}
            placeholder="Search"
            icon={SearchSvg}
          />
          <Button type="action">Cancel</Button>
        </div>
      )}
    </div>
  )
}

export default Search
