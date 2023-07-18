import type { PushClientTypes } from '@walletconnect/push-client'
import debounce from 'lodash.debounce'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { from } from 'rxjs'
import PlusIcon from '../../../assets/Plus.svg'
import SearchIcon from '../../../assets/Search.svg'
import W3iContext from '../../../contexts/W3iContext/context'
import { useIsMobile, useSearch } from '../../../utils/hooks'
import { pushSearchService } from '../../../utils/store'
import AppNotificationDropdown from '../AppNotifications/AppNotificationDropdown'
import Input from '../../general/Input'
import NavLink from '../../general/NavLink'
import Search from '../../general/Search'
import MobileHeading from '../../layout/MobileHeading'
import './AppSelector.scss'
import EmptyApps from './EmptyApps'
import { useNavigate } from 'react-router-dom'

const AppSelector: React.FC = () => {
  const [search, setSearch] = useState('')
  const isMobile = useIsMobile()
  const { isPushSearchOpen } = useSearch()
  const [dropdownToShow, setDropdownToShow] = useState<string | undefined>()
  const [filteredApps, setFilteredApps] = useState<PushClientTypes.PushSubscription[]>([])
  const { activeSubscriptions, dappOrigin, pushRegisterMessage } = useContext(W3iContext)
  const nav = useNavigate()

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
    [activeSubscriptions]
  )

  useEffect(() => {
    filterApps(search)
  }, [search, filterApps, activeSubscriptions])

  useEffect(() => {
    if (dappOrigin) {
      const dappSub = activeSubscriptions.find(sub => sub.metadata.url === dappOrigin)

      if (dappSub) {
        nav(`/notifications/${dappSub.topic}`)
      } else {
        nav(`/widget/subscribe`)
      }
    }
  }, [dappOrigin, nav, activeSubscriptions, pushRegisterMessage])

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
            {isMobile ? (
              <>
                <AppNotificationDropdown
                  closeDropdown={() => setDropdownToShow(undefined)}
                  h="1.5em"
                  w="2em"
                  notificationId={app.topic}
                  dropdownPlacement="bottomLeft"
                />
              </>
            ) : (
              <>
                {dropdownToShow === app.topic && (
                  <AppNotificationDropdown
                    closeDropdown={() => setDropdownToShow(undefined)}
                    h="1.5em"
                    w="2em"
                    notificationId={app.topic}
                  />
                )}
              </>
            )}
          </div>
        </NavLink>
      ))}
      {/* FilteredApps.length > 0 && (
        <div className="AppSelector__muted">
          <div className="AppSelector__muted__label">MUTED</div>
          {filteredApps.map(app => (
            <NavLink
              key={app.topic}
              to={`/notifications/${app.topic}`}
              className="AppSelector__link-item"
              onMouseEnter={() => setDropdownToShow(app.topic)}
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
      )*/}
      <EmptyApps />
    </div>
  )
}

export default AppSelector
