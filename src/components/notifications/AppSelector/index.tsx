import React, { useContext, useState } from 'react'

import { useAllSubscriptions } from '@web3inbox/react'
import cx from 'classnames'
import { AnimatePresence, m } from 'framer-motion'
import { useLocation } from 'react-router-dom'

import AllAppsIcon from '@/assets/AllApps.svg'
import SearchIcon from '@/assets/Search.svg'
import Input from '@/components/general/Input'
import Label from '@/components/general/Label'
import NavLink from '@/components/general/NavLink'
import TargetTitle from '@/components/general/TargetTitle'
import Text from '@/components/general/Text'
import MobileHeader from '@/components/layout/MobileHeader'
import W3iContext from '@/contexts/W3iContext/context'
import { NAVIGATION } from '@/utils/constants'
import { useIsMobile } from '@/utils/hooks'
import { handleImageFallback } from '@/utils/ui'

import LinkItemSkeleton from './LinkItemSkeleton'

import './AppSelector.scss'

const SkeletonItems = Array.from({ length: 3 }, (_, idx) => <LinkItemSkeleton key={idx} />)

const AppSelector: React.FC = () => {
  const { pathname } = useLocation()
  const [search, setSearch] = useState('')
  const isMobile = useIsMobile()
  const { clientReady: subscriptionsFinishedLoading } = useContext(W3iContext)
  const { data: activeSubscriptions } = useAllSubscriptions()

  const unreadDapps = activeSubscriptions?.filter(subscription =>
    Boolean(subscription.unreadNotificationCount)
  )
  const readDapps = activeSubscriptions?.filter(
    subscription => !Boolean(subscription.unreadNotificationCount)
  )

  return (
    <div className="AppSelector">
      {isMobile && pathname.endsWith('/notifications') ? (
        <MobileHeader title="Notifications" />
      ) : (
        <Input
          onChange={({ target }) => {
            setSearch(target.value)
          }}
          placeholder="Search"
          icon={SearchIcon}
        />
      )}
      <TargetTitle className="AppSelector__target-title" to="/notifications/new-app">
        <Text variant="large-700">Inbox</Text>
      </TargetTitle>
      <div className="AppSelector__lists">
        <div className="AppSelector__wrapper">
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
        </div>
        <div className="AppSelector__wrapper">
          {!activeSubscriptions?.length || !subscriptionsFinishedLoading ? (
            <Label color="main">Subscribed</Label>
          ) : null}
          <div className="AppSelector__list">
            <ul className="AppSelector__list-unread">
	      <Text className="AppSelector__list-label" variant="small-400">Unread</Text>
              {subscriptionsFinishedLoading &&
                unreadDapps
                  ?.filter(sub => {
                    if (search) {
                      return sub.metadata.name.toLowerCase().includes(search.toLowerCase())
                    }
                    return true
                  })
                  .map((app, idx, fullApps) => {
                    return (
                      <AnimatePresence key={app.topic}>
                        <m.div
                          initial={{ opacity: 0 }}
                          exit={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <NavLink
                            key={app.topic}
                            to={NAVIGATION.notifications.domain(app.metadata.appDomain)}
                            className={cx(
                              'AppSelector__link-item',
                              !subscriptionsFinishedLoading &&
                                fullApps.length - idx + 1 === 0 &&
                                'AppSelector__link-item-loading-in'
                            )}
                          >
                            <div className="AppSelector__notifications">
                              <div className="AppSelector__notifications-link">
                                <div className="AppSelector__link__logo">
                                  <img
                                    className="AppSelector__link__logo__image"
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
                    )
                  })}
            </ul>

            <ul className="AppSelector__list-read">
	      <Text className="AppSelector__list-label" variant="small-400">Read</Text>
              {subscriptionsFinishedLoading &&
                readDapps
                  ?.filter(sub => {
                    if (search) {
                      return sub.metadata.name.toLowerCase().includes(search.toLowerCase())
                    }
                    return true
                  })
                  .map((app, idx, fullApps) => {
                    return (
                      <AnimatePresence key={app.topic}>
                        <m.div
                          initial={{ opacity: 0 }}
                          exit={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <NavLink
                            key={app.topic}
                            to={NAVIGATION.notifications.domain(app.metadata.appDomain)}
                            className={cx(
                              'AppSelector__link-item',
                              !subscriptionsFinishedLoading &&
                                fullApps.length - idx + 1 === 0 &&
                                'AppSelector__link-item-loading-in'
                            )}
                          >
                            <div className="AppSelector__notifications">
                              <div className="AppSelector__notifications-link">
                                <div className="AppSelector__link__logo">
                                  <img
                                    className="AppSelector__link__logo__image"
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
                    )
                  })}
            </ul>
            {!subscriptionsFinishedLoading ? SkeletonItems : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppSelector
