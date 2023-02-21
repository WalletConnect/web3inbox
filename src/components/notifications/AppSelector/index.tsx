import { PushClientTypes } from '@walletconnect/push-client'
import debounce from 'lodash.debounce'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { from } from 'rxjs'
import foundationLogo from '../../../assets/foundation.svg'
import PlusIcon from '../../../assets/Plus.svg'
import SearchIcon from '../../../assets/Search.svg'
import zoraLogo from '../../../assets/zora.svg'
import SettingsContext from '../../../contexts/SettingsContext/context'
import W3iContext from '../../../contexts/W3iContext/context'
import { useColorModeValue, useIsMobile, useSearch } from '../../../utils/hooks'
import { pushSearchService } from '../../../utils/store'
import CircleBadge from '../../general/Badge/CircleBadge'
import NotificationMuteIcon from '../../general/Icon/NotificationMuteIcon'
import Input from '../../general/Input'
import NavLink from '../../general/NavLink'
import Search from '../../general/Search'
import MobileHeading from '../../layout/MobileHeading'
import type { IAppNotification } from '../AppNotifications/AppNotificationItem'
import NotificationActionsDropdown from '../NotificationsActionsDropdown'
import './AppSelector.scss'
import EmptyApps from './EmptyApps'

interface PushApp {
  id: string
  name: string
  description: string
  color: {
    dark: string
    light: string
  }
  logo: string
  url: string
  isMuted: boolean
  notifications?: IAppNotification[]
}

const AppSelector: React.FC = () => {
  const [search, setSearch] = useState('')
  const isMobile = useIsMobile()
  const { isPushSearchOpen } = useSearch()
  const [dropdownToShow, setDropdownToShow] = useState<string | undefined>()
  const [filteredApps, setFilteredApps] = useState<PushClientTypes.PushSubscription[]>([])
  const { mode } = useContext(SettingsContext)
  const { activeSubscriptions } = useContext(W3iContext)
  const themeColors = useColorModeValue(mode)

  const filterApps = useCallback(
    debounce((searchQuery: string) => {
      if (!searchQuery) {
        setFilteredApps(activeSubscriptions)

        return
      }

      const newFilteredApps = [] as PushClientTypes.PushSubscription[]

      from(activeSubscriptions).subscribe({
        next: app => {
          const isAppNameMatch = app.metadata.name.toLowerCase().includes(searchQuery)
          if (isAppNameMatch) {
            newFilteredApps.push(app)
          }
        },
        complete: () => {
          setFilteredApps(newFilteredApps)
        }
      })
    }, 50),
    []
  )

  useEffect(() => {
    filterApps(search)
  }, [search, filterApps])

  return (
    <div className="AppSelector">
      {isMobile ? (
        <div className="AppSelector__mobile-header">
          {!isPushSearchOpen && <MobileHeading>Notifications</MobileHeading>}
          <div className="AppSelector__mobile-actions">
            <Search
              setSearch={setSearch}
              isSearchOpen={isPushSearchOpen}
              openSearch={pushSearchService.openSearch}
              closeSearch={pushSearchService.closeSearch}
            />
            <NavLink to="/notifications/new-app" className="AppSelector__link">
              <img className="AppSelector__link-icon" src={PlusIcon} alt="NewApp" />
            </NavLink>
          </div>
        </div>
      ) : (
        <>
          <Input
            onChange={({ target }) => {
              setSearch(target.value)
            }}
            placeholder="Search"
            icon={SearchIcon}
          />
          <NavLink to="/notifications/new-app" className="AppSelector__link">
            <img className="AppSelector__link-icon" src={PlusIcon} alt="NewApp" />
            <span>New App</span>
          </NavLink>
        </>
      )}
      {filteredApps.map(app => (
        <NavLink
          key={app.topic}
          to={`/notifications/${app.topic}`}
          className="AppSelector__link-item"
          onMouseEnter={() => setDropdownToShow(app.topic)}
          onMouseLeave={() => setDropdownToShow(undefined)}
        >
          <div className="AppSelector__notifications">
            <div className="AppSelector__notifications-link">
              <img
                className="AppSelector__link-logo"
                src={app.metadata.icons[0]}
                alt={`${app.metadata.name} logo`}
                loading="lazy"
              />
              <span>{app.metadata.name}</span>
            </div>
            {/* DropdownToShow !== app.id &&
                app.notifications?.length &&
                app.notifications.filter(notif => notif.isRead).length !== 0 && (
                  <CircleBadge>
                    {app.notifications.filter(notif => notif.isRead).length}
                  </CircleBadge>
                )*/}
            {dropdownToShow === app.topic && (
              <NotificationActionsDropdown
                appId={app.topic}
                btnShape="square"
                w="28px"
                h="28px"
                closeDropdown={() => setDropdownToShow(undefined)}
              />
            )}
          </div>
        </NavLink>
      ))}
      {filteredApps.length > 0 && (
        <div className="AppSelector__muted">
          <div className="AppSelector__muted__label">MUTED</div>
          {filteredApps.map(app => (
            <NavLink
              key={app.topic}
              to={`/notifications/${app.topic}`}
              className="AppSelector__link-item"
              onMouseEnter={() => setDropdownToShow(app.id)}
              onMouseLeave={() => setDropdownToShow(undefined)}
            >
              <div className="AppSelector__notifications">
                <div className="AppSelector__notifications-link__muted">
                  <img
                    className="AppSelector__link-logo"
                    src={app.metadata.icons[0]}
                    alt={`${app.metadata.name} logo`}
                    loading="lazy"
                  />
                  <span>{app.metadata.name}</span>
                </div>
                <NotificationMuteIcon fillColor={themeColors['--fg-color-3']} />
              </div>
            </NavLink>
          ))}
        </div>
      )}
      <EmptyApps />
    </div>
  )
}

export default AppSelector
