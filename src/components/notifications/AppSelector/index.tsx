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
import { useLocation, useNavigate } from 'react-router-dom'
import TargetTitle from '../../general/TargetTitle'
import AllAppsIcon from '../../../assets/AllApps.svg'
import Label from '../../general/Label'
import Text from '../../general/Text'
import MobileHeader from '../../layout/MobileHeader'

const AppSelector: React.FC = () => {
  const { pathname } = useLocation()
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
      {isMobile && pathname.endsWith('/notifications') ? (
        <>
          <MobileHeader title="Notifications" />
        </>
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
          </TargetTitle>
        </>
      )}

      <div className="AppSelector__lists">
        <div className="AppSelector__wrapper">
          {!isMobile && (
            <>
              <Label color="main">Explore</Label>
              <ul className="AppSelector__list">
                <NavLink to={`/notifications/new-app`} end className="AppSelector__link-appsItem">
                  <div className="AppSelector__notifications">
                    <div className="AppSelector__notifications-apps">
                      <img
                        className="AppSelector__link-apps"
                        src={AllAppsIcon}
                        alt="Explore all apps logo"
                        loading="lazy"
                      />
                      <Text variant="small-500">Explore all apps</Text>
                    </div>
                  </div>
                </NavLink>
              </ul>
            </>
          )}
        </div>
        {filteredApps.length > 0 && (
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
        )}
      </div>
      {/* <EmptyApps /> */}
    </div>
  )
}

export default AppSelector
