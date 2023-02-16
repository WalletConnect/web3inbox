import React, { useCallback, useContext, useMemo } from 'react'
import ChatInviteHandEmoji from '../../../assets/ChatInviteHand.svg'
import HandStopEmoji from '../../../assets/HandStopEmoji.svg'
import Spinner from '../../general/Spinner'
import CrossIcon from '../../general/Icon/CrossIcon'
import './InviteMessage.scss'
import { useColorModeValue } from '../../../utils/hooks'
import SettingsContext from '../../../contexts/SettingsContext/context'
import CheckIcon from '../../general/Icon/CheckIcon'

interface InviteMessageProps {
  status: 'accepted' | 'pending' | 'rejected'
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
        <CrossIcon fillColor={themeColors['--fg-color-1']} />
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
      accepted: <AcceptedStatus />
    }),
    [PendingStatus, RejectedStatus]
  )

  const StatusEmojis = useMemo(
    () => ({
      pending: ChatInviteHandEmoji,
      rejected: HandStopEmoji,
      accepted: ChatInviteHandEmoji
    }),
    []
  )

  return (
    <div className="InviteMessage">
      <div className="InviteMessage__bubble">
        <div className="InviteMessage__emoji">
          <img src={StatusEmojis[status]} alt="emoji_wave_hand" />
        </div>
        <div className="InviteMessage__subtext">Chat Invite</div>
        <div className="InviteMessage__status">{StatusComponents[status]}</div>
      </div>
    </div>
  )
}

export default InviteMessage
