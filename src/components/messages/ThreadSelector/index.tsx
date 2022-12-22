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
  const { chatClientProxy } = useContext(ChatContext)
  const { address } = useAccount()
  const [search, setSearch] = useState<string>('')
  const [threads, setThreads] = useState<ChatClientTypes.Thread[]>([])
  const [invites, setInvites] = useState<ChatClientTypes.Invite[]>([])

  console.log('Chat Client: ', chatClientProxy)

  const refreshThreads = useCallback(() => {
    if (!chatClientProxy) {
      return
    }

    setInvites(Array.from(chatClientProxy.getInvites().values()))
    setThreads(Array.from(chatClientProxy.getThreads().values()))
  }, [chatClientProxy, setThreads, setInvites])

  useEffect(() => {
    refreshThreads()
  }, [refreshThreads])

  useEffect(() => {
    if (!search && chatClientProxy) {
      setThreads(Array.from(chatClientProxy.getThreads().values()))
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
      if (!address || !chatClientProxy) {
        return
      }
      resolveAddress(inviteeAddress).then(resolvedAddress => {
        console.log('inviting', resolvedAddress)

        chatClientProxy
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
    [address, chatClientProxy, refreshThreads]
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
