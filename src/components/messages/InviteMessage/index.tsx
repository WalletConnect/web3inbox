import React, { useCallback, useContext, useMemo } from 'react'
import Spinner from '../../general/Spinner'
import CrossIcon from '../../general/Icon/CrossIcon'
import './InviteMessage.scss'
import { useColorModeValue } from '../../../utils/hooks'
import SettingsContext from '../../../contexts/SettingsContext/context'
import ChatInviteHandEmoji from '../../../assets/ChatInviteHandEmoji.svg'
import ChatRejectedHandEmoji from '../../../assets/ChatRejectedHandEmoji.svg'
import CheckIcon from '../../general/Icon/CheckIcon'
import type { ChatClientTypes } from '@walletconnect/chat-client'
import Text from '../../general/Text'

interface InviteMessageProps {
  status: ChatClientTypes.SentInvite['status']
  peer: string
}

const InviteMessage: React.FC<InviteMessageProps> = ({ status }) => {
  const { mode } = useContext(SettingsContext)
  const themeColors = useColorModeValue(mode)

  const PendingStatus = useCallback(() => {
    return (
      <div className="InviteMessage__pending">
        <Spinner width="1em" />
        <span>Pending</span>
      </div>
    )
  }, [])

  const RejectedStatus = useCallback(() => {
    return (
      <div className="InviteMessage__pending">
        <CrossIcon />
        <span>Rejected</span>
      </div>
    )
  }, [themeColors])

  const AcceptedStatus = useCallback(() => {
    return (
      <div className="InviteMessage__pending">
        <CheckIcon />
        <span>Accepted</span>
      </div>
    )
  }, [themeColors])

  const StatusComponents = useMemo(
    () => ({
      pending: <PendingStatus />,
      rejected: <RejectedStatus />,
      approved: <AcceptedStatus />
    }),
    [PendingStatus, RejectedStatus, AcceptedStatus]
  )

  const StatusEmojis = useMemo(
    () => ({
      pending: ChatInviteHandEmoji,
      rejected: ChatRejectedHandEmoji,
      approved: ChatInviteHandEmoji
    }),
    []
  )

  return (
    <div className="InviteMessage">
      <div className="InviteMessage__bubble">
        <div>
          <img src={StatusEmojis[status]} alt="emoji_wave_hand" />
        </div>
        <div className="InviteMessage__subtext">
          <Text variant="link-500">Chat Invite</Text>
        </div>
        <div className="InviteMessage__status">
          <Text variant="link-500">{StatusComponents[status]}</Text>
        </div>
      </div>
    </div>
  )
}

export default InviteMessage
