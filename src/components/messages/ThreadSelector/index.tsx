import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
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
  const [filteredThreadTopics, setFilteredThreadTopics] = useState<
    { topic: string; message?: string }[]
  >([])
  const { threads, invites, chatClientProxy } = useContext(ChatContext)

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

      const newFilteredThreadTopics: { topic: string; message?: string }[] = []

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
        {filteredThreads.map(({ peerAccount, topic }) => {
          const filterIdx = filteredThreadTopics.findIndex(thread => thread.topic === topic)
          const message = (filterIdx !== -1 && filteredThreadTopics[filterIdx].message) || undefined

          return (
            <Thread
              searchQuery={search}
              topic={topic}
              lastMessage={message}
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
