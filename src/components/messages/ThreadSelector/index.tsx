import React, { useContext, useState } from 'react'
import Input from '../../general/Input'
import Search from '../../../assets/Search.svg'
import ChatContext from '../../../contexts/ChatContext/context'
import Thread from './Thread'
import PersonIcon from '../../../assets/Person.svg'
import PlusIcon from '../../../assets/Plus.svg'
import './ThreadSelector.scss'
import NavLink from '../../general/NavLink'

const ThreadSelector: React.FC = () => {
  const { threads, invites } = useContext(ChatContext)
  const [search, setSearch] = useState<string>('')

  return (
    <div className="ThreadSelector">
      <Input
        onChange={({ target }) => setSearch(target.value)}
        value={search}
        placeholder="Search"
        icon={Search}
      />
      <NavLink svgSrc={PlusIcon} to="/messages/new-chat">
        New Chat
      </NavLink>
      <NavLink svgSrc={PersonIcon} to="/messages/chat-invites">
        <div className="ThreadSelector__invites">
          <div>Chat Invites</div>
          <div className="ThreadSelector__invites-badge">
            <div className="ThreadSelector__invites-badget-num">{invites.length}</div>
          </div>
        </div>
      </NavLink>
      <div className="ThreadSelector__threads">
        {threads
          .filter(thread => {
            if (search) {
              return thread.peerAccount.includes(search)
            }

            return true
          })
          .map(({ peerAccount, topic }) => {
            return <Thread topic={topic} threadPeer={peerAccount} key={peerAccount} />
          })}
        {threads.length === 0 && search && (
          <span className="ThreadSelector__contact">No {search} found in your contacts</span>
        )}
      </div>
    </div>
  )
}

export default ThreadSelector
