import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'

import PlusIcon from '@/assets/Plus.svg'
import SearchIcon from '@/assets/Search.svg'
import Avatar from '@/components/account/Avatar'
import CircleBadge from '@/components/general/Badge/CircleBadge'
import PencilIcon from '@/components/general/Icon/PencilIcon'
import Input from '@/components/general/Input'
import NavLink from '@/components/general/NavLink'
import Search from '@/components/general/Search'
import TargetTitle from '@/components/general/TargetTitle'
import Text from '@/components/general/Text'
import MobileHeading from '@/components/layout/MobileHeading'
import W3iContext from '@/contexts/W3iContext/context'
import { getEthChainAddress } from '@/utils/address'
import { useIsMobile, useSearch } from '@/utils/hooks'
import { chatSearchService } from '@/utils/store'

import EmptyThreads from './EmptyThreads'
import Thread from './Thread'

import './ThreadSelector.scss'

const ThreadSelector: React.FC = () => {
  const [search, setSearch] = useState('')
  const isMobile = useIsMobile()
  const { isChatSearchOpen } = useSearch()

  const [filteredThreadTopics] = useState<
    { topic: string; message?: string; timestamp?: number }[]
  >([])
  const { threads, invites, sentInvites } = useContext(W3iContext)

  const filteredThreads = useMemo(() => {
    return threads.filter(
      thread =>
        filteredThreadTopics.length === 0 ||
        filteredThreadTopics.map(filteredThread => filteredThread.topic).includes(thread.topic)
    )
  }, [threads, filteredThreadTopics])

  // Commit it was removed: 9e95e32053c7ef0e3d605dbe8b6fea7e2ddbbf48
  const filterThreads = useCallback((_search: string) => {
    return []
  }, [])

  useEffect(() => {
    filterThreads(search)
  }, [search, filterThreads])

  return (
    <div className="ThreadSelector">
      {isMobile ? (
        <div className="ThreadSelector__mobile">
          <div className="ThreadSelector__mobile-header">
            {!isChatSearchOpen && <MobileHeading>Chat</MobileHeading>}
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
          {invites.filter(invite => invite.status === 'pending').length > 0 && (
            <NavLink to="/messages/chat-invites" className="ThreadSelector__mobile-link">
              <div className="ThreadSelector__invites">
                <div className="ThreadSelector__invites-link">
                  <div className="ThreadSelector__invites-avatars">
                    {invites
                      .filter(invite => invite.status === 'pending')
                      .map(
                        (invite, i) =>
                          i < 6 && (
                            <div
                              key={invite.id}
                              className="ThreadSelector__invites-avatar"
                              style={{ marginLeft: i * 10 }}
                            >
                              <Avatar
                                address={getEthChainAddress(invite.inviterAccount)}
                                width="40px"
                                height="40px"
                              />
                            </div>
                          )
                      )}
                  </div>
                </div>
                <span>Chat Invites</span>
                <CircleBadge>
                  {invites.filter(invite => invite.status === 'pending').length}
                </CircleBadge>
              </div>
            </NavLink>
          )}
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
          <TargetTitle className="ThreadSelector__target-title" to="/messages/new-chat">
            <Text variant="large-700">Chat</Text>
            <PencilIcon />
          </TargetTitle>
          {/* <NavLink to="/messages/new-chat" className="ThreadSelector__link">
            <img className="ThreadSelector__link-icon" src={PlusIcon} alt="NewChat" />
            <span>New Chat</span>
          </NavLink> */}
          {/* <NavLink to="/messages/chat-invites" className="ThreadSelector__link">
            <div className="ThreadSelector__invites">
              <div className="ThreadSelector__invites-link">
                <img className="ThreadSelector__link-icon" src={PersonIcon} alt="Invites" />
                <span>Chat Invites</span>
              </div>
              <CircleBadge>
                {invites.filter(invite => invite.status === 'pending').length}
              </CircleBadge>
            </div>
          </NavLink> */}
        </>
      )}
      {(filteredThreads.length > 0 || sentInvites.length > 0) && (
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
            .filter(
              invite =>
                invite.status !== 'approved' &&
                !threads.some(thread => thread.peerAccount === invite.inviteeAccount)
            )
            .reverse()
            .map(({ inviteeAccount, status }) => (
              <Thread
                searchQuery={search}
                topic={`invite:${status}:${inviteeAccount}`}
                lastMessage={`Invite ${status}`}
                lastMessageTimestamp={Date.now()}
                threadPeer={inviteeAccount}
                key={inviteeAccount}
              />
            ))}
          {threads.length === 0 && search && (
            <span className="ThreadSelector__contact">No {search} found in your contacts</span>
          )}
        </div>
      )}
      <EmptyThreads />
    </div>
  )
}

export default ThreadSelector
