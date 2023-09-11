import React, { useCallback, useContext, useMemo, useRef, useState } from 'react'
import { useBalance, useEnsAvatar, useEnsName } from 'wagmi'

import DisconnectIcon from '../../general/Icon/DisconnectIcon'
import ETH from '../../../assets/ETH.svg'
import W3iContext from '../../../contexts/W3iContext/context'
import { useIsMobile, useOnClickOutside } from '../../../utils/hooks'
import { profileModalService, shareModalService } from '../../../utils/store'
import { truncate } from '../../../utils/string'
import { generateAvatarColors } from '../../../utils/ui'
import Divider from '../../general/Divider'
import './Avatar.scss'
import SettingsContext from '../../../contexts/SettingsContext/context'
import PersonIcon from '../../general/Icon/PersonIcon'
import ShareIcon from '../../general/Icon/ShareIcon'
import CopyIcon from '../../general/Icon/CopyIcon'
import { showErrorMessageToast, showSuccessMessageToast } from '../../../utils/toasts'
import Text from '../../general/Text'

interface AvatarProps {
  address?: string
  width: number | string
  height: number | string
  hasProfileDropdown?: boolean
}

const Avatar: React.FC<AvatarProps> = ({ address, width, height, hasProfileDropdown = false }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { disconnect } = useContext(W3iContext)
  const avatarRef = useRef(null)

  const addressOrEnsDomain = address as `0x${string}` | undefined
  const { data: ensName } = useEnsName({ address: addressOrEnsDomain })
  const { data: ensAvatar } = useEnsAvatar({ name: ensName })
  const { data: balance } = useBalance({
    address: addressOrEnsDomain
  })

  const handleToggleProfileDropdown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault()

      setIsDropdownOpen(currentState => !currentState)
    },
    [setIsDropdownOpen]
  )

  useOnClickOutside(avatarRef, () =>
    setIsDropdownOpen(currentState => currentState && !currentState)
  )

  const isMobile = useIsMobile()

  const { mode } = useContext(SettingsContext)

  const toastTheme = useMemo(() => {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    const specifiedMode = mode === 'system' ? systemTheme : mode

    return specifiedMode
  }, [mode])

  const handleViewProfile = useCallback(() => {
    setIsDropdownOpen(currentState => currentState && !currentState)
    profileModalService.toggleModal()
  }, [handleToggleProfileDropdown])

  const handleShare = useCallback(() => {
    setIsDropdownOpen(currentState => currentState && !currentState)
    shareModalService.toggleModal()
  }, [handleToggleProfileDropdown])

  return (
    <div
      className="Avatar"
      style={{
        width,
        height,
        cursor: hasProfileDropdown ? 'pointer' : 'default'
      }}
      ref={avatarRef}
    >
      <div
        className="Avatar__container"
        style={{
          width,
          height,
          ...(address ? generateAvatarColors(address) : {})
        }}
        onClick={e => {
          handleToggleProfileDropdown(e)
        }}
      >
        {ensAvatar && <img className="Avatar__icon" src={ensAvatar} alt="Avatar" />}
      </div>
      {hasProfileDropdown && isDropdownOpen && (
        <div
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
                <Text variant="paragraph-500">{ensName ?? truncate(address ?? '', 4)}</Text>

                <button
                  className="Avatar__dropdown__button"
                  onClick={() => {
                    window.navigator.clipboard
                      .writeText(address ? `${address}` : '')
                      .then(() => {
                        showSuccessMessageToast('Copied address to clipboard')
                      })
                      .catch(() => {
                        showErrorMessageToast('Failed to copy address to clipboard')
                      })
                  }}
                >
                  <CopyIcon />
                </button>
              </div>
            </div>
            <Divider />
            <div className="Avatar__dropdown__block">
              <div style={{ width, height }} className="Avatar__dropdown__block__logo">
                <img src={ETH} alt="native token logo" />
              </div>
              <div className="Avatar__dropdown__block__balance">
                <Text variant="paragraph-500">
                  {balance?.formatted && parseFloat(balance.formatted).toFixed(4)} ETH
                </Text>
              </div>
            </div>
            <Divider />
            <div className="Avatar__dropdown__block Avatar__dropdown__block__group">
              <div className="Avatar__dropdown__block__actions ">
                <button
                  onClick={handleViewProfile}
                  className="Avatar__dropdown__block__actions__button"
                >
                  <PersonIcon />
                  <Text variant="small-400">View Profile</Text>
                </button>
                <button onClick={handleShare} className="Avatar__dropdown__block__actions__button">
                  <ShareIcon />
                  <Text variant="small-400">Share</Text>
                </button>
                <button
                  className="Avatar__dropdown__block__actions__button Avatar__dropdown__block__actions__disconnect"
                  onClick={disconnect}
                >
                  <DisconnectIcon />
                  <Text variant="small-400">Disconnect</Text>
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
