import React, { useContext, useEffect, useState } from 'react'

import type { NotifyClientTypes } from '@walletconnect/notify-client'
import { AnimatePresence, m } from 'framer-motion'
import debounce from 'lodash.debounce'
import { useLocation } from 'react-router-dom'
import { from } from 'rxjs'

import AllAppsIcon from '@/assets/AllApps.svg'
import SearchIcon from '@/assets/Search.svg'
import Input from '@/components/general/Input'
import Label from '@/components/general/Label'
import NavLink from '@/components/general/NavLink'
import TargetTitle from '@/components/general/TargetTitle'
import Text from '@/components/general/Text'
import MobileHeader from '@/components/layout/MobileHeader'
import W3iContext from '@/contexts/W3iContext/context'
import { useIsMobile } from '@/utils/hooks'
import { handleImageFallback } from '@/utils/ui'

import LinkItemSkeleton from './LinkItemSkeleton'

import './AppSelector.scss'

const SUBSCRIPTION_LOADER_TIMEOUT = 3000

const AppSelector: React.FC = () => {
  const { pathname } = useLocation()
  const [search, setSearch] = useState('')
  const isMobile = useIsMobile()
  const [filteredApps, setFilteredApps] = useState<NotifyClientTypes.NotifySubscription[]>([])
  const [loading, setLoading] = useState(true)
  const { activeSubscriptions } = useContext(W3iContext)

  const fetchApps = async (searchQuery: string) => {
    const newFilteredApps = [] as NotifyClientTypes.NotifySubscription[]

    from(activeSubscriptions).subscribe({
      next: app => {
        if (!loading) {
          setLoading(false)
        }
        const isAppNameMatch = app.metadata.name.toLowerCase().includes(searchQuery.toLowerCase())
        if (isAppNameMatch) {
          newFilteredApps.push(app)
        }
      },
      complete: () => {
        setFilteredApps(newFilteredApps)
      }
    })
  }

  const searchApps = debounce((searchQuery: string) => {
    if (!searchQuery) {
      setFilteredApps(activeSubscriptions)
      return
    }

    fetchApps(searchQuery)
  }, 100)

  useEffect(() => {
    fetchApps(search)
  }, [activeSubscriptions])

  useEffect(() => {
    searchApps(search)
  }, [search])

  useEffect(() => {
    if (filteredApps?.length) {
      setLoading(false)
      return
    }

    setTimeout(() => {
      setLoading(false)
    }, SUBSCRIPTION_LOADER_TIMEOUT)
  }, [filteredApps?.length])

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
              <Label color="main">Discover</Label>
              <ul className="AppSelector__list">
                <NavLink to={`/notifications/new-app`} end className="AppSelector__link-appsItem">
                  <div className="AppSelector__notifications">
                    <div className="AppSelector__notifications-apps">
                      <img
                        className="AppSelector__link-apps"
                        src={AllAppsIcon}
                        alt="Discover apps logo"
                        loading="lazy"
                      />
                      <Text variant="small-500">Discover apps</Text>
                    </div>
                  </div>
                </NavLink>
              </ul>
            </>
          )}
        </div>
        <div className="AppSelector__wrapper">
          <Label color="main">Subscribed</Label>
          <ul className="AppSelector__list">
            {loading
              ? Array(3)
                  .fill(<LinkItemSkeleton />)
                  .map(x => x)
              : null}
            {!loading &&
              filteredApps?.map(app => (
                <AnimatePresence>
                  <m.div initial={{ opacity: 0 }} exit={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <NavLink
                      key={app.topic}
                      to={`/notifications/${app.topic}`}
                      className="AppSelector__link-item"
                    >
                      <div className="AppSelector__notifications">
                        <div className="AppSelector__notifications-link">
                          <div className="AppSelector__link-logo">
                            <img
                              src={app.metadata.icons?.[0] || '/fallback.svg'}
                              alt={`${app.metadata.name} logo`}
                              onError={handleImageFallback}
                              loading="lazy"
                            />
                          </div>

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
                  </m.div>
                </AnimatePresence>
              ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default AppSelector
