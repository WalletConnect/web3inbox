import React from 'react'

import WavingHand from '@/assets/WavingHand.png'
import MobileHeading from '@/components/layout/MobileHeading'
import { useIsMobile } from '@/utils/hooks'

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
    <MobileHeading>Chat Invites</MobileHeading>
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
