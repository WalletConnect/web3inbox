import { useCallback, useMemo, useRef, useState } from 'react'
import dotsIcon from '../../../assets/Dots.svg'
import { useOnClickOutside } from '../../../utils/hooks'
import Button from '../../general/Button'
import CheckIcon from '../../general/Icon/CheckIcon'
import CrossIcon from '../../general/Icon/CrossIcon'
import NotificationMuteIcon from '../../general/Icon/NotificationMuteIcon'
import PreferencesIcon from '../../general/Icon/PreferencesIcon'
import TrashIcon from '../../general/Icon/TrashIcon'
import './NotificationActionsDropdown.scss'

interface INotificationActionsDropdownProps {
  appId: string
  btnShape?: 'circle' | 'square'
  dropdownPlacement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight'
  w: string
  h: string
}

const NotificationActionsDropdown: React.FC<INotificationActionsDropdownProps> = ({
  appId,
  btnShape = 'circle',
  dropdownPlacement = 'bottomRight',
  w,
  h
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const ref = useRef(null)

  const handleToggleActionsDropdown = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      setIsDropdownOpen(currentState => !currentState)
    },
    [setIsDropdownOpen]
  )

  useOnClickOutside(ref, () => setIsDropdownOpen(currentState => !currentState))

  const dropdownPosition = useMemo(() => {
    const placements = {
      topRight: {
        bottom: 0,
        left: 0
      },
      topLeft: {
        bottom: 0,
        right: 0
      },
      bottomRight: {
        top: 0,
        left: 0
      },
      bottomLeft: {
        top: 0,
        right: 0
      }
    }

    return placements[dropdownPlacement]
  }, [dropdownPlacement])

  const handleMarkAsRead = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    console.log({ appId })
  }, [])

  const handleMute = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
  }, [])

  const handleUnsubscribe = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
  }, [])

  const handleClearAll = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
  }, [])

  const handlePreferences = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
  }, [])

  return (
    <div className="NotificationActions">
      <Button
        className={`NotificationActions__btn${btnShape === 'square' ? '__square' : ''}`}
        style={{ width: w, height: h }}
        onClick={handleToggleActionsDropdown}
        customType="action-icon"
      >
        <img src={dotsIcon} />
      </Button>
      {isDropdownOpen && (
        <div ref={ref} className="NotificationActions__dropdown" style={dropdownPosition}>
          <div className="NotificationActions__dropdown__block">
            <div className="NotificationActions__dropdown__block__actions">
              <button onClick={handleMarkAsRead}>
                <CheckIcon />
                <span>Mark as read</span>
              </button>
              <button onClick={handleMute}>
                <NotificationMuteIcon />
                <span>Mute</span>
              </button>
              <button onClick={handleClearAll}>
                <TrashIcon />
                <span>Clear All</span>
              </button>
              <button onClick={handlePreferences}>
                <PreferencesIcon />
                <span>Notification Preferences</span>
              </button>
              <button
                className="NotificationActions__dropdown__block__actions__unsubscribe"
                onClick={handleUnsubscribe}
              >
                <CrossIcon fillColor="hsla(5, 85%, 60%, 1)" />
                <span>Unsubscribe</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationActionsDropdown
