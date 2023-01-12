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
    /*
     * Notification isn't technically always truthy, eg: Webview.
     * asking for notifications here for UX reasons and since asking for
     * notification permissions needs to be activated by a user event.
     */

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      Notification.requestPermission()
    }

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
