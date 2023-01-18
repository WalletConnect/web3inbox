import React, { useCallback, useContext, useEffect, useState } from 'react'
import Input from '../../general/Input'
import Search from '../../../assets/Search.svg'
import ChatContext from '../../../contexts/ChatContext/context'
import Thread from './Thread'
import PersonIcon from '../../../assets/Person.svg'
import PlusIcon from '../../../assets/Plus.svg'
import './ThreadSelector.scss'
import NavLink from '../../general/NavLink'
import debounce from 'lodash.debounce'
import { concatAll, from, takeLast, takeWhile } from 'rxjs'

const ThreadSelector: React.FC = () => {
  const [search, setSearch] = useState('')
  const [filteredThreadTopics, setFilteredThreadTopics] = useState<string[]>([])
  const { threads, invites, chatClientProxy } = useContext(ChatContext)

  const filterThreads = useCallback(
    debounce((searchQuery: string) => {
      if (!searchQuery || !chatClientProxy) {
        setFilteredThreadTopics([])

        return
      }

      const newFilteredThreads: string[] = []

      from(threads).subscribe(thread => {
        if (thread.peerAccount.includes(searchQuery)) {
          newFilteredThreads.push(thread.topic)

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
          .subscribe({
            next: ({ message }) => {
              if (message.includes(searchQuery)) {
                newFilteredThreads.push(thread.topic)
              }
            },
            complete: () => {
              setFilteredThreadTopics(newFilteredThreads)
            }
          })
      })
    }, 100),
    [threads, chatClientProxy]
  )

  useEffect(() => {
    filterThreads(search)
  }, [search, filterThreads])

  console.log('Actual filtered threads', filteredThreadTopics)

  return (
    <div className="ThreadSelector">
      <Input
        onChange={({ target }) => {
          setSearch(target.value)
        }}
        placeholder="Search"
        icon={Search}
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
          <div className="ThreadSelector__invites-badge">
            <div className="ThreadSelector__invites-badget-num">{invites.length}</div>
          </div>
        </div>
      </NavLink>
      <div className="ThreadSelector__threads">
        {threads
          .filter(
            thread =>
              filteredThreadTopics.length === 0 || filteredThreadTopics.includes(thread.topic)
          )
          .map(({ peerAccount, topic }) => {
            return (
              <Thread
                searchQuery={search}
                topic={topic}
                threadPeer={peerAccount}
                key={peerAccount}
              />
            )
          })}
        {threads.length === 0 && search && (
          <span className="ThreadSelector__contact">No {search} found in your contacts</span>
        )}
      </div>
    </div>
  )
}

export default ThreadSelector
