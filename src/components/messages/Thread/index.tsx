import React, { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEnsName } from 'wagmi'
import { getEthChainAddress } from '../../../utils/address'
import Avatar from '../../account/Avatar'
import './Thread.scss'

interface ThreadProps {
  icon?: string
  threadPeer: string
  topic: string
}

const Thread: React.FC<ThreadProps> = ({ icon, topic, threadPeer }) => {
  const nav = useNavigate()
  const { data: ensName } = useEnsName({ address: getEthChainAddress(threadPeer) })

  const onClick = useCallback(() => {
    nav(`/messages/chat/${threadPeer}?topic=${topic}`)
  }, [nav, threadPeer, topic])

  return (
    <button className="Thread" onClick={onClick}>
      <div className="Thread__icon">
        <Avatar src={icon} width="1em" height="1em" />
      </div>
      <div className="Thread__peer-name">{ensName ?? threadPeer}</div>
    </button>
  )
}

export default Thread
