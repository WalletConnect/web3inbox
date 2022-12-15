import type { ChatClientTypes } from '@walletconnect/chat-client'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import Input from '../../general/Input'
import Search from '../../../assets/Search.svg'
import ChatContext from '../../../contexts/ChatContext/context'
import { useAccount } from 'wagmi'
import { fetchEnsAddress } from '@wagmi/core'
import Thread from '../Thread'
import './ThreadSelector.scss'
import Button from '../../general/Button'
import Invite from '../Invite'

const ThreadSelector: React.FC = () => {
  const { chatClient } = useContext(ChatContext)
  const { address } = useAccount()
  const [search, setSearch] = useState<string>('')
  const [threads, setThreads] = useState<ChatClientTypes.Thread[]>([])
  const [invites, setInvites] = useState<ChatClientTypes.Invite[]>([])

  const refreshThreads = useCallback(() => {
    if (!chatClient) {
      return
    }

    setInvites(Array.from(chatClient.getInvites().values()))
    setThreads(Array.from(chatClient.getThreads().values()))
  }, [chatClient, setThreads, setInvites])

  useEffect(() => {
    refreshThreads()
  }, [refreshThreads])

  useEffect(() => {
    if (!search && chatClient) {
      setThreads(Array.from(chatClient.getThreads().values()))
    }
    setThreads(oldThreads => {
      return oldThreads.filter(thread => thread.peerAccount.includes(search))
    })
  }, [setThreads, search, chatClient])

  useEffect(() => {
    if (!chatClient) {
      return
    }

    chatClient.observe('chat_invite', { next: refreshThreads })
    chatClient.observe('chat_joined', { next: refreshThreads })
  }, [chatClient])

  const resolveAddress = async (inviteeAddress: string) => {
    // eslint-disable-next-line prefer-regex-literals
    const isEnsDomain = new RegExp('.*.eth', 'u').test(inviteeAddress)
    if (isEnsDomain) {
      const resolvedAddress = await fetchEnsAddress({
        name: inviteeAddress
      })

      if (resolvedAddress) {
        return `eip155:1:${resolvedAddress}`
      }
    }

    return inviteeAddress
  }

  const invite = useCallback(
    (inviteeAddress: string) => {
      if (!address || !chatClient) {
        return
      }
      resolveAddress(inviteeAddress).then(resolvedAddress => {
        console.log('inviting', resolvedAddress)

        chatClient
          .invite({
            account: resolvedAddress,
            invite: {
              account: `eip155:1:${address}`,
              message: 'Inviting'
            }
          })
          .then(refreshThreads)
      })
    },
    [address, chatClient, refreshThreads]
  )

  return (
    <div className="ThreadSelector">
      <Input
        onChange={({ target }) => setSearch(target.value)}
        value={search}
        placeholder="Search"
        icon={Search}
      />
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
      <div className="ThreadSelector__action">
        {Object.keys(threads).length === 0 && search && (
          <Button
            type="primary"
            onClick={() => {
              invite(search)
              setSearch('')
            }}
          >
            Send Contact Request
          </Button>
        )}
      </div>
    </div>
  )
}

export default ThreadSelector
