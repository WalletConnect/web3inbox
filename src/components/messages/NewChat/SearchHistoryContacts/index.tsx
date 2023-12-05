import React, { useCallback, useState } from 'react'

import Ledger from '@/assets/Ledger.svg'
import Button from '@/components/general/Button'

import './SearchHistoryContacts.scss'

const SearchHistoryContacts: React.FC = () => {
  const [isSearchingContacts, setIsSearchingContacts] = useState(false)
  const [historyContacts, setHistoryContacts] = useState<string[]>()

  const handleSearchContacts = useCallback(() => {
    setIsSearchingContacts(true)
    setHistoryContacts(['vitalik.eth', 'clinenerd.eth'])
  }, [setIsSearchingContacts])

  const handleInviteSelectedContact = useCallback((selectedContact: string) => {}, [])

  return (
    <div className="SearchHistoryContacts">
      {historyContacts?.length ? (
        <div className="SearchHistoryContacts__container">
          <div className="SearchHistoryContacts__header__title SearchHistoryContacts__header__result">
            Recent contacts
          </div>
          <div className="SearchHistoryContacts__results">
            {historyContacts.map(contact => (
              <Button
                onClick={() => handleInviteSelectedContact(contact)}
                className="SearchHistoryContacts__results__contact-btn"
              >
                {contact}
              </Button>
            ))}
          </div>
        </div>
      ) : (
        <div className="SearchHistoryContacts__container">
          <img src={Ledger} alt="ledger-icon" />
          <div className="SearchHistoryContacts__header">
            <div className="SearchHistoryContacts__header__title">Search your history</div>
            <div className="SearchHistoryContacts__header__subtitle">
              We can show you some possible contacts from your public transaction history
            </div>
          </div>
          <Button onClick={handleSearchContacts} disabled={isSearchingContacts}>
            {isSearchingContacts ? 'Searching...' : 'Search for contacts'}
          </Button>
        </div>
      )}
    </div>
  )
}

export default SearchHistoryContacts
