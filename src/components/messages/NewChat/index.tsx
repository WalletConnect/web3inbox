import React, { useCallback, useContext, useState } from 'react'
import { isValidAddressOrEnsDomain, isValidEnsDomain } from '../../../utils/address'
import Button from '../../general/Button'
import Input from '../../general/Input'
import ChatContext from '../../../contexts/ChatContext/context'
import { fetchEnsAddress } from '@wagmi/core'
import './NewChat.scss'

const NewChat: React.FC = () => {
  const { chatClientProxy, userPubkey } = useContext(ChatContext)
  const [isInviting, setIsInviting] = useState(false)
  const [query, setQuery] = useState('')

  const resolveAddress = async (inviteeAddress: string) => {
    // eslint-disable-next-line prefer-regex-literals
    if (isValidEnsDomain(inviteeAddress)) {
      const resolvedAddress = await fetchEnsAddress({
        name: inviteeAddress
      })

      if (resolvedAddress) {
        return `eip155:1:${resolvedAddress}`
      }
    }

    return `eip155:1:${inviteeAddress}`
  }

  const invite = useCallback(
    (inviteeAddress: string) => {
      setIsInviting(true)
      if (!userPubkey || !chatClientProxy) {
        setIsInviting(false)

        return
      }
      resolveAddress(inviteeAddress).then(resolvedAddress => {
        chatClientProxy
          .invite({
            account: resolvedAddress,
            invite: {
              account: `eip155:1:${userPubkey}`,
              message: 'Inviting'
            }
          })
          .then(() => {
            setIsInviting(false)
            setQuery('')
          })
          .catch(() => setIsInviting(false))
      })
    },
    [userPubkey, chatClientProxy]
  )

  return (
    <div className="NewChat">
      <div className="NewChat__search-box">
        <Input
          value={query}
          placeholder="ENS Username (vitalik.eth)⠀ ⠀ ⠀Wallet Address (0x423…)"
          onChange={e => setQuery(e.target.value)}
        />
        <Button
          onClick={() => {
            console.log('Button clicked.')
            invite(query)
          }}
          disabled={!isValidAddressOrEnsDomain(query) || isInviting}
        >
          {isInviting ? `Inviting...` : `Send Invite`}
        </Button>
      </div>
    </div>
  )
}

export default NewChat
