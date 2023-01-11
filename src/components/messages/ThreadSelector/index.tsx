import React, { useCallback, useContext, useEffect, useState } from 'react'
import Input from '../../general/Input'
import Search from '../../../assets/Search.svg'
import ChatContext from '../../../contexts/ChatContext/context'
import Thread from '../Thread'
import './ThreadSelector.scss'
import Invite from '../Invite'
import { formatEthChainsAddress, getEthChainAddress } from '../../../utils/address'
import UserContext from '../../../contexts/UserContext/context'
import { Link } from 'react-router-dom'
import type { ChatClientTypes } from '@walletconnect/chat-client'

const ThreadSelector: React.FC = () => {
  const { chatClientProxy } = useContext(ChatContext)
  const { userPubkey } = useContext(UserContext)
  const [search, setSearch] = useState<string>('')
  const [threads, setThreads] = useState<ChatClientTypes.Thread[]>([])
  const [invites, setInvites] = useState<ChatClientTypes.Invite[]>([])

  console.log('Chat Client: ', chatClientProxy)

  const refreshThreads = useCallback(() => {
    if (!chatClientProxy) {
      return
    }

    chatClientProxy
      .getInvites({ account: formatEthChainsAddress(userPubkey) })
      .then(invite => setInvites(Array.from(invite.values())))
    chatClientProxy
      .getThreads({ account: formatEthChainsAddress(userPubkey) })
      .then(invite => setThreads(Array.from(invite.values())))
  }, [chatClientProxy, setThreads, setInvites])

  useEffect(() => {
    refreshThreads()
  }, [refreshThreads])

  useEffect(() => {
    if (!search && chatClientProxy) {
      chatClientProxy
        .getThreads({ account: formatEthChainsAddress(userPubkey) })
        .then(thread => setThreads(Array.from(thread.values())))
    }
    setThreads(oldThreads => {
      return oldThreads.filter(thread => thread.peerAccount.includes(search))
    })
  }, [setThreads, search, chatClientProxy])

  useEffect(() => {
    if (!chatClientProxy) {
      return
    }

    chatClientProxy.observe('chat_invite', { next: refreshThreads })
    chatClientProxy.observe('chat_joined', { next: refreshThreads })
  }, [chatClientProxy])

  return (
    <div className="ThreadSelector">
      <Input
        onChange={({ target }) => setSearch(target.value)}
        value={search}
        placeholder="Search"
        icon={Search}
      />
      <Link to="/messages/new-chat" className="ThreadSelector__new-chat">
        <div className="ThreadSelector__new-chat-symbol" />
        <div className="ThreadSelector__new-chat-text">New Chat</div>
      </Link>
      <div className="ThreadSelector__threads">
        {threads.map(({ peerAccount, topic }) => {
          return <Thread topic={topic} threadPeer={peerAccount} key={peerAccount} />
        })}
        {!search && (
          <div className="Invites">
            {invites.length > 0 && <span>Invites:</span>}
            {invites.map(({ account, id, message }) => (
              <Invite
                address={account}
                key={account}
                message={message}
                id={id ?? 0}
                onSuccessfulAccept={refreshThreads}
              />
            ))}
          </div>
        )}
        {threads.length === 0 && search && (
          <span className="ThreadSelector__contact">
            {search} is not in your contacts, send contact request
          </span>
        )}
      </div>
    </div>
  )
}

export default ThreadSelector
