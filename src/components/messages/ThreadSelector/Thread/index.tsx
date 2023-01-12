import React from 'react'
import { useEnsName } from 'wagmi'
import { getEthChainAddress } from '../../../../utils/address'
import PlaceholderIcon from '../../../../assets/PlaceholderAvatar.png'
import NavLink from '../../../general/NavLink'
import './Thread.scss'

interface ThreadProps {
  icon?: string
  threadPeer: string
  topic: string
}

const Thread: React.FC<ThreadProps> = ({ icon, topic, threadPeer }) => {
  const { data: ensName } = useEnsName({ address: getEthChainAddress(threadPeer) })

  return (
    <NavLink to={`/messages/chat/${threadPeer}?topic=${topic}`} imgSrc={icon ?? PlaceholderIcon}>
      {ensName ?? threadPeer}
    </NavLink>
  )
}

export default Thread
