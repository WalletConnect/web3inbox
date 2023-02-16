import React from 'react'
import WavingHand from '../../../assets/WavingHand.png'
import { useIsMobile } from '../../../utils/hooks'
import MobileHeader from '../../layout/MobileHeader'
import './Invites.scss'

interface IChatInvitesHeader {
  invitesCount: number
  invitesSelectedCount: number
}
const ChatInvitesHeader: React.FC<IChatInvitesHeader> = ({
  invitesCount,
  invitesSelectedCount
}) => {
  const isMobile = useIsMobile()

  return isMobile ? (
    <MobileHeader>Chat Invites</MobileHeader>
  ) : (
    <div className="Invites__header-text">
      <div className="Invites__header-icon">
        <img src={WavingHand} alt="Hand" />
      </div>
      <span>
        {invitesSelectedCount > 0
          ? `${invitesSelectedCount} Invites Selected`
          : `${invitesCount} New Chat Invites`}
      </span>
    </div>
  )
}

export default ChatInvitesHeader
