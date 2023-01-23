import React, { useCallback, useContext, useRef, useState } from 'react'
import { useBalance, useDisconnect, useEnsName } from 'wagmi'
import { useNavigate } from 'react-router-dom'

import { generateAvatarColors } from '../../../utils/ui'
import Divider from '../../general/Divider'
import ETH from '../../../assets/ETH.svg'
import Disconnect from '../../../assets/Disconnect.svg'
import { useOnClickOutside } from '../../../utils/hooks'
import './Avatar.scss'
import ChatContext from '../../../contexts/ChatContext/context'
import { truncate } from '../../../utils/string'
import ShareIcon from '../../general/Icon/ShareIcon'
import PersonIcon from '../../general/Icon/PersonIcon'
import { profileModalService, shareModalService } from '../../../utils/store'

interface AvatarProps {
  src?: string | null
  address?: string
  width: number | string
  height: number | string
  hasProfileDropdown?: boolean
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  address,
  width,
  height,
  hasProfileDropdown = false
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { userPubkey, setUserPubkey } = useContext(ChatContext)
  const ref = useRef(null)
  const navigate = useNavigate()
  const { data: ensName } = useEnsName({ address: userPubkey as `0x${string}` })
  const { data: balance } = useBalance({
    address: address ? (address as `0x${string}`) : undefined
  })
  const { disconnect } = useDisconnect()
  const handleToggleProfileDropdown = useCallback(
    () => hasProfileDropdown && setIsDropdownOpen(currentState => !currentState),
    [setIsDropdownOpen, hasProfileDropdown]
  )
  useOnClickOutside(ref, handleToggleProfileDropdown)

  const handleDisconnect = useCallback(() => {
    disconnect()
    setUserPubkey(undefined)
    navigate('/login')
  }, [disconnect, navigate, setUserPubkey])

  const handleViewProfile = useCallback(() => {
    handleToggleProfileDropdown()
    profileModalService.toggleModal()
  }, [handleToggleProfileDropdown])

  const handleShare = useCallback(() => {
    handleToggleProfileDropdown()
    shareModalService.toggleModal()
  }, [handleToggleProfileDropdown])

  return (
    <div
      className="Avatar"
      style={{
        cursor: hasProfileDropdown ? 'pointer' : 'default',
        border: isDropdownOpen ? 'solid 2px #3396FF' : 'solid 2px #E4E7E7'
      }}
    >
      <div
        className="Avatar__container"
        style={{
          width,
          height,
          ...(address ? generateAvatarColors(address) : {})
        }}
        onClick={handleToggleProfileDropdown}
      >
        {src && <img className="Avatar__icon" src={src} alt="Avatar" />}
      </div>
      {hasProfileDropdown && isDropdownOpen && (
        <div ref={ref} className="Avatar__dropdown">
          <div className="Avatar__dropdown__content">
            <div className="Avatar__dropdown__block">
              <div
                className="Avatar__container"
                style={{
                  minWidth: width,
                  height,
                  ...(address ? generateAvatarColors(address) : {})
                }}
              >
                {src && <img className="Avatar__icon" src={src} alt="Avatar" />}
              </div>
              <div className="Avatar__dropdown__block__username">
                {ensName ?? truncate(userPubkey ?? '', 4)}
              </div>
            </div>
            <Divider />
            <div className="Avatar__dropdown__block">
              <div style={{ width, height }} className="Avatar__dropdown__block__logo">
                <img src={ETH} alt="native token logo" />
              </div>
              <div className="Avatar__dropdown__block__balance">
                {balance?.formatted && parseFloat(balance.formatted).toFixed(4)} ETH
              </div>
            </div>
            <Divider />
            <div className="Avatar__dropdown__block">
              <div className="Avatar__dropdown__block__actions">
                <button onClick={handleViewProfile}>
                  <PersonIcon />
                  <span>View Profile</span>
                </button>
                <button onClick={handleShare}>
                  <ShareIcon />
                  <span>Share</span>
                </button>
                <button
                  className="Avatar__dropdown__block__actions__disconnect"
                  onClick={handleDisconnect}
                >
                  <img alt="share-icon" src={Disconnect} />
                  <span>Disconnect</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Avatar
