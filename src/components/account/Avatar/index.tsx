import React, { useCallback, useContext, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBalance, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'

import Disconnect from '../../../assets/Disconnect.svg'
import ETH from '../../../assets/ETH.svg'
import W3iContext from '../../../contexts/W3iContext/context'
import { useIsMobile, useOnClickOutside } from '../../../utils/hooks'
import { profileModalService, shareModalService } from '../../../utils/store'
import { truncate } from '../../../utils/string'
import { generateAvatarColors } from '../../../utils/ui'
import Divider from '../../general/Divider'

import './Avatar.scss'

interface AvatarProps {
  address?: string
  width: number | string
  height: number | string
  hasProfileDropdown?: boolean
}

const Avatar: React.FC<AvatarProps> = ({ address, width, height, hasProfileDropdown = false }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { setUserPubkey } = useContext(W3iContext)
  const ref = useRef(null)
  const navigate = useNavigate()
  const addressOrEnsDomain = address as `0x${string}` | undefined
  const { data: ensName } = useEnsName({ address: addressOrEnsDomain })
  const { data: ensAvatar } = useEnsAvatar({ address: addressOrEnsDomain })
  const { data: balance } = useBalance({
    address: addressOrEnsDomain ? addressOrEnsDomain : undefined
  })
  const { disconnect } = useDisconnect()
  const handleToggleProfileDropdown = useCallback(
    () => hasProfileDropdown && setIsDropdownOpen(currentState => !currentState),
    [setIsDropdownOpen, hasProfileDropdown]
  )
  useOnClickOutside(ref, handleToggleProfileDropdown)
  const isMobile = useIsMobile()

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
        width,
        height,
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
        {ensAvatar && <img className="Avatar__icon" src={ensAvatar} alt="Avatar" />}
      </div>
      {hasProfileDropdown && isDropdownOpen && (
        <div
          ref={ref}
          className="Avatar__dropdown"
          style={
            isMobile
              ? { marginBottom: `calc(${height} + 0.25em)` }
              : { marginTop: `calc(${height} + 0.25em)` }
          }
        >
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
                {ensAvatar && <img className="Avatar__icon" src={ensAvatar} alt="Avatar" />}
              </div>
              <div className="Avatar__dropdown__block__username">
                {ensName ?? truncate(address ?? '', 4)}
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
                {/* <button onClick={handleViewProfile}>
                  <PersonIcon />
                  <span>View Profile</span>
                </button>
                <button onClick={handleShare}>
                  <ShareIcon />
                  <span>Share</span>
                </button> */}
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
