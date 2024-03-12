import { useEffect, useState } from 'react'

import { useWeb3InboxAccount } from '@web3inbox/react'
import { useAccount } from 'wagmi'

import { formatEthChainsAddress } from '@/utils/address'

export const useAuthState = () => {
  const { address, chainId: chain } = useAccount()
  const formattedAddress = formatEthChainsAddress(address, `${chain}`)

  useWeb3InboxAccount(formattedAddress ?? undefined)

  const [userPubkey, setUserPubkey] = useState<string | undefined>(
    formatEthChainsAddress(address, `${chain}`)
  )

  useEffect(() => {
    setUserPubkey(formattedAddress)
  }, [address, chain, formattedAddress])

  return { userPubkey, setUserPubkey }
}
