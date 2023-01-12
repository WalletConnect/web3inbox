import React, { useCallback, useContext, useState } from 'react'
import { isValidAddressOrEnsDomain, isValidEnsDomain } from '../../../utils/address'
import Button from '../../general/Button'
import Input from '../../general/Input'
import ChatContext from '../../../contexts/ChatContext/context'
import { fetchEnsAddress } from '@wagmi/core'
import { useAccount } from 'wagmi'
import './NewChat.scss'

const NewChat: React.FC = () => {
  const { chatClientProxy } = useContext(ChatContext)
  const [query, setSearch] = useState('')
  const { address } = useAccount()

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
      if (!address || !chatClientProxy) {
        return
      }
      resolveAddress(inviteeAddress).then(resolvedAddress => {
        chatClientProxy
          .invite({
            account: resolvedAddress,
            invite: {
              account: `eip155:1:${address}`,
              message: 'Inviting'
            }
          })
          .then(() => setSearch(''))
      })
    },
    [address, chatClientProxy]
  )

  return (
    <div className="NewChat">
      <div className="NewChat__search-box">
        <Input
          value={query}
          placeholder="ENS Username (vitalik.eth)⠀ ⠀ ⠀Wallet Address (0x423…)"
          onChange={e => setSearch(e.target.value)}
        />
        <Button onClick={() => invite(query)} disabled={!isValidAddressOrEnsDomain(query)}>
          Send Invite
        </Button>
      </div>
    </div>
  )
}

export default NewChat
