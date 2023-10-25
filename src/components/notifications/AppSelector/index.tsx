import type { NotifyClientTypes } from '@walletconnect/notify-client'
import debounce from 'lodash.debounce'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { from } from 'rxjs'
import SearchIcon from '../../../assets/Search.svg'
import W3iContext from '../../../contexts/W3iContext/context'
import { useIsMobile, useSearch } from '../../../utils/hooks'
import Input from '../../general/Input'
import NavLink from '../../general/NavLink'
import './AppSelector.scss'
import { useLocation, useNavigate } from 'react-router-dom'
import TargetTitle from '../../general/TargetTitle'
import AllAppsIcon from '../../../assets/AllApps.svg'
import Label from '../../general/Label'
import Text from '../../general/Text'
import MobileHeader from '../../layout/MobileHeader'
import { AnimatePresence, motion } from 'framer-motion'
import { handleImageFallback } from '../../../utils/ui'

const AppSelector: React.FC = () => {
  const { pathname } = useLocation()
  const [search, setSearch] = useState('')
  const isMobile = useIsMobile()
  const [dropdownToShow, setDropdownToShow] = useState<string | undefined>()
  const [filteredApps, setFilteredApps] = useState<NotifyClientTypes.NotifySubscription[]>([])
  const { activeSubscriptions, dappOrigin, notifyRegisterMessage } = useContext(W3iContext)
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
      const dappSub = activeSubscriptions.find(sub => sub.metadata.appDomain === dappOrigin)

      if (dappSub?.topic) {
        nav(`/notifications/${dappSub.topic}`)
      } else {
        nav(`/widget/subscribe`)
      }
    }
  }, [dappOrigin, nav, activeSubscriptions, notifyRegisterMessage])

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
                <AnimatePresence key={app.topic}>
                  <motion.div
                    initial={{ opacity: 0 }}
                    exit={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
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
                            src={
                              app.metadata.icons?.length ? app.metadata.icons[0] : '/fallback.svg'
                            }
                            alt={`${app.metadata.name} logo`}
                            onError={handleImageFallback}
                            loading="lazy"
                          />
                          <div className="AppSelector__link__wrapper">
                            <Text className="AppSelector__link__title" variant="small-500">
                              {app.metadata.name}
                            </Text>
                            <Text className="AppSelector__link__subtitle" variant="small-500">
                              {app.metadata.description}
                            </Text>
                          </div>
                        </div>
                      </div>
                    </NavLink>
                  </motion.div>
                </AnimatePresence>
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
