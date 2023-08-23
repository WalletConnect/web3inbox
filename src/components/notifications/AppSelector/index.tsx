import type { NotifyClientTypes } from '@walletconnect/notify-client'
import debounce from 'lodash.debounce'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { from } from 'rxjs'
import PlusIcon from '../../../assets/Plus.svg'
import SearchIcon from '../../../assets/Search.svg'
import W3iContext from '../../../contexts/W3iContext/context'
import { useIsMobile, useSearch } from '../../../utils/hooks'
import { pushSearchService } from '../../../utils/store'
import Input from '../../general/Input'
import NavLink from '../../general/NavLink'
import Search from '../../general/Search'
import MobileHeading from '../../layout/MobileHeading'
import './AppSelector.scss'
import EmptyApps from './EmptyApps'
import { useNavigate } from 'react-router-dom'
import TargetTitle from '../../general/TargetTitle'
import SubscribeIcon from '../../general/Icon/SubscribeIcon'
import Label from '../../general/Label'
import Text from '../../general/Text'

const AppSelector: React.FC = () => {
  const [search, setSearch] = useState('')
  const isMobile = useIsMobile()
  const { isPushSearchOpen } = useSearch()
  const [dropdownToShow, setDropdownToShow] = useState<string | undefined>()
  const [filteredApps, setFilteredApps] = useState<NotifyClientTypes.NotifySubscription[]>([])
  const { activeSubscriptions, dappOrigin, pushRegisterMessage } = useContext(W3iContext)
  const nav = useNavigate()

  const filterApps = useCallback(
    debounce((searchQuery: string) => {
      if (!searchQuery) {
        setFilteredApps(activeSubscriptions)

        return
      }

      const newFilteredApps = [] as NotifyClientTypes.NotifySubscription[]

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

      if (dappSub?.topic) {
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
          <TargetTitle className="AppSelector__target-title" to="/notifications/new-app">
            <Text variant="large-700">Inbox</Text>
            <SubscribeIcon />
          </TargetTitle>
        </>
      )}

      <div className="AppSelector__lists">
        {/* <div className="AppSelector__wrapper">
          <Label color="main">Unread</Label>
          <ul className="AppSelector__list AppSelector__list__unread">
            {filteredApps.map(app => (
              <NavLink
                key={app.topic}
                to={`/notifications/${app.topic}`}
                className="AppSelector__link-item"
                onMouseEnter={() => setDropdownToShow(app.topic)}
                onMouseLeave={() => setDropdownToShow(undefined)}
              >
                <div className="AppSelector__unread"></div>
                <div className="AppSelector__notifications">
                  <div className="AppSelector__notifications-link">
                    <img
                      className="AppSelector__link-logo"
                      src={app.metadata.icons[0]}
                      alt={`${app.metadata.name} logo`}
                      loading="lazy"
                    />
                    <Text variant="small-500">{app.metadata.name}</Text>
                  </div>
                </div>
              </NavLink>
            ))}
          </ul>
        </div> */}
        <div className="AppSelector__wrapper">
          <Label color="main">Subscribed</Label>
          <ul className="AppSelector__list">
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
                    <Text variant="small-500">{app.metadata.name}</Text>
                  </div>
                </div>
              </NavLink>
            ))}
          </ul>
        </div>
        {/* <div className="AppSelector__wrapper">
          <Label color="main">Muted</Label>
          <ul className="AppSelector__list AppSelector__list__muted">
            {filteredApps.map(app => (
              <NavLink
                key={app.topic}
                to={`/notifications/${app.topic}`}
                className="AppSelector__link-item AppSelector__link-item__muted"
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
                    <Text variant="small-500">{app.metadata.name}</Text>
                  </div>
                </div>
              </NavLink>
            ))}
          </ul>
        </div> */}
      </div>

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
