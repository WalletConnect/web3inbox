import debounce from 'lodash.debounce'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { concatAll, from, takeLast, takeWhile } from 'rxjs'
import PersonIcon from '../../../assets/Person.svg'
import PlusIcon from '../../../assets/Plus.svg'
import SearchIcon from '../../../assets/Search.svg'
import W3iContext from '../../../contexts/W3iContext/context'
import { useIsMobile, useSearch } from '../../../utils/hooks'
import { chatSearchService } from '../../../utils/store'
import CircleBadge from '../../general/Badge/CircleBadge'
import Input from '../../general/Input'
import NavLink from '../../general/NavLink'
import Search from '../../general/Search'
import MobileHeader from '../../layout/MobileHeader'
import EmptyThreads from './EmptyThreads'
import Thread from './Thread'
import './ThreadSelector.scss'

const ThreadSelector: React.FC = () => {
  const [search, setSearch] = useState('')
  const isMobile = useIsMobile()
  const { isChatSearchOpen } = useSearch()

  const [filteredThreadTopics, setFilteredThreadTopics] = useState<
    { topic: string; message?: string; timestamp?: number }[]
  >([])
  const { threads, invites, chatClientProxy, sentInvites } = useContext(W3iContext)

  const filteredThreads = useMemo(() => {
    return threads.filter(
      thread =>
        filteredThreadTopics.length === 0 ||
        filteredThreadTopics.map(filteredThread => filteredThread.topic).includes(thread.topic)
    )
  }, [threads, filteredThreadTopics])

  const filterThreads = useCallback(
    debounce((searchQuery: string) => {
      if (!searchQuery || !chatClientProxy) {
        setFilteredThreadTopics([])

        return
      }

      const newFilteredThreadTopics: { topic: string; message?: string; timestamp?: number }[] = []

      /*
       * For every thread, check if the thread address matches the searchQuery
       * If it does, add it to filtered topics
       * If it doesn't, look through the last 100 messages (or until a match is
       * found), if one is found add it to filtered topics with the matched
       * message as the reason (so it can be showcased).
       */
      from(threads).subscribe({
        next: thread => {
          if (thread.peerAccount.includes(searchQuery)) {
            newFilteredThreadTopics.push({ topic: thread.topic })

            return
          }

          from(chatClientProxy.getMessages({ topic: thread.topic }))
            .pipe(concatAll())
            .pipe(takeLast(100))
            .pipe(
              takeWhile(messageToCheck => {
                return !messageToCheck.message.includes(searchQuery)
              }, true)
            )
            .pipe(takeLast(1))
            .subscribe({
              next: ({ message }) => {
                if (message.includes(searchQuery)) {
                  newFilteredThreadTopics.push({ topic: thread.topic, message })
                }
              }
            })
        },
        complete: () => {
          setFilteredThreadTopics(newFilteredThreadTopics)
        }
      })
    }, 50),
    [threads, chatClientProxy]
  )

  useEffect(() => {
    filterThreads(search)
  }, [search, filterThreads])

  return (
    <div className="ThreadSelector">
      {isMobile ? (
        <div className="ThreadSelector__mobile-header">
          {!isChatSearchOpen && <MobileHeader>Chat</MobileHeader>}
          <div className="ThreadSelector__mobile-actions">
            <Search
              setSearch={setSearch}
              isSearchOpen={isChatSearchOpen}
              openSearch={chatSearchService.openSearch}
              closeSearch={chatSearchService.closeSearch}
            />
            <NavLink to="/messages/new-chat" className="ThreadSelector__link">
              <img className="ThreadSelector__link-icon" src={PlusIcon} alt="NewChat" />
            </NavLink>
          </div>
        </div>
      ) : (
        <>
          <Input
            onChange={({ target }) => {
              setSearch(target.value)
            }}
            placeholder="Search"
            icon={SearchIcon}
          />
          <NavLink to="/messages/new-chat" className="ThreadSelector__link">
            <img className="ThreadSelector__link-icon" src={PlusIcon} alt="NewChat" />
            <span>New Chat</span>
          </NavLink>
          <NavLink to="/messages/chat-invites" className="ThreadSelector__link">
            <div className="ThreadSelector__invites">
              <div className="ThreadSelector__invites-link">
                <img className="ThreadSelector__link-icon" src={PersonIcon} alt="Invites" />
                <span>Chat Invites</span>
              </div>
              <CircleBadge>{invites.length}</CircleBadge>
            </div>
          </NavLink>
        </>
      )}
      <div className="ThreadSelector__threads">
        {filteredThreads.map(({ peerAccount, topic }) => {
          const filterIdx = filteredThreadTopics.findIndex(thread => thread.topic === topic)
          const lastItem = (filterIdx !== -1 && filteredThreadTopics[filterIdx]) || undefined
          const message = lastItem?.message
          const timestamp = lastItem?.timestamp

          return (
            <Thread
              searchQuery={search}
              topic={topic}
              lastMessage={message}
              lastMessageTimestamp={timestamp}
              threadPeer={peerAccount}
              key={peerAccount}
            />
          )
        })}
        {sentInvites
          .filter(invite => invite.status !== 'accepted')
          .map(({ inviteeAccount, status }) => (
            <Thread
              searchQuery={search}
              topic={`invite:${status}:${inviteeAccount}`}
              lastMessage={`Invite Pending`}
              lastMessageTimestamp={Date.now()}
              threadPeer={inviteeAccount}
              key={inviteeAccount}
            />
          ))}
        {threads.length === 0 && search && (
          <span className="ThreadSelector__contact">No {search} found in your contacts</span>
        )}
      </div>
      <EmptyThreads />
    </div>
  )
}

export default ThreadSelector
