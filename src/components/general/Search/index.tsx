import { useCallback, useEffect } from 'react'

import SearchSvg from '@/assets/Search.svg'

import Button from '../Button'
import SearchIcon from '../Icon/SearchIcon'
import Input from '../Input'

import './Search.scss'

interface ISearchProps {
  setSearch: (term: string) => void
  isSearchOpen: boolean
  closeSearch: () => void
  openSearch: () => void
}
const Search: React.FC<ISearchProps> = ({ setSearch, isSearchOpen, closeSearch, openSearch }) => {
  const handleCloseSearch = useCallback(() => {
    setSearch('')
    closeSearch()
  }, [setSearch])

  useEffect(() => {
    return () => {
      closeSearch()
    }
  }, [])

  return (
    <div className="Search">
      {!isSearchOpen && (
        <Button customType="action-icon" className="Search__btn" onClick={openSearch}>
          <div style={{ width: '25em', height: '1em' }}>
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
          <Button customType="action" onClick={handleCloseSearch}>
            Cancel
          </Button>
        </div>
      )}
    </div>
  )
}

export default Search
