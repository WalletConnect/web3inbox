import debounce from 'lodash.debounce'
import React, { useCallback, useEffect, useState } from 'react'
import { from } from 'rxjs'
import foundationLogo from '../../../assets/foundation.svg'
import Logo from '../../../assets/Logo.svg'
import PlusIcon from '../../../assets/Plus.svg'
import Search from '../../../assets/Search.svg'
import zoraLogo from '../../../assets/zora.svg'
import CircleBadge from '../../general/Badge/CircleBadge'
import Input from '../../general/Input'
import NavLink from '../../general/NavLink'
import NotificationActionsDropdown from '../NotificationsActionsDropdown'
import './AppSelector.scss'
import EmptyApps from './EmptyApps'

interface PushApp {
  id: string
  name: string
  color: string
  logo?: string
  notifications?: {
    id: string
    title: string
    message: string
  }[]
}

export const myAppsMock = [
  {
    id: 'foundation',
    name: 'Foundation',
    description: 'A new world is possible 🌐',
    logo: foundationLogo,
    color: '#E6E6E6',
    url: 'https://foundation.app',
    notifications: [
      {
        id: 'fake-uuid',
        image:
          'https://f8n-production.imgix.net/collections/f26vgep49.gif?q=45&w=128&h=128&fit=crop&dpr=2',
        title: 'You won an auction',
        message: `You successfully bought ‘x l o 35’ for 1 ETH from @emrecolako`,
        isRead: true,
        timestamp: new Date().getTime()
      },
      {
        id: 'a-fake-uuid',
        image:
          'https://f8n-production.imgix.net/collections/a39acu5u8.jpg?q=45&w=128&h=128&fit=crop&dpr=2',

        title: 'You have a new follower',
        message: '@enmity followed you',
        isRead: false,
        timestamp: new Date().getTime()
      }
    ]
  },
  {
    id: 'uniswap',
    name: 'Uniswap',
    description: 'The protocol for trading and automated liquidity provision on Ethereum.',
    logo: 'https://explorer-api.walletconnect.com/v3/logo/md/32a77b79-ffe8-42c3-61a7-3e02e019ca00?projectId=2f05ae7f1116030fde2d36508f472bfb',
    color: '#F2D9EA',
    url: 'https://uniswap.org/',
    notifications: [
      {
        id: 'an-other-fake-uuid',
        image: undefined,
        title: 'ETH Price Alert',
        message: 'ETH passed the treshold of $2000',
        isRead: false,
        timestamp: new Date().getTime()
      }
    ]
  },
  {
    id: 'zora',
    name: 'Zora',
    description: 'Tools for collective imagination',
    color: '#DBEEF0',
    url: 'https://zora.co/',
    logo: zoraLogo
  },
  {
    id: 'lenster',
    name: 'Lenster',
    description:
      'Lenster is a composable, decentralized, and permissionless social media web app built with Lens Protocol.',
    color: '#E0D9F2',
    url: 'https://lenster.xyz/',
    logo: 'https://lenster.xyz/logo.svg'
  }
]

const AppSelector: React.FC = () => {
  const [search, setSearch] = useState('')
  const [showMockApps] = useState(true)
  const [dropdownToShow, setDropdownToShow] = useState<string | undefined>()

  const [filteredApps, setFilteredApps] = useState<PushApp[]>([])

  const filterApps = useCallback(
    debounce((searchQuery: string) => {
      if (!searchQuery) {
        setFilteredApps(showMockApps ? myAppsMock : [])

        return
      }

      const newFilteredApps = [] as PushApp[]

      from(myAppsMock).subscribe({
        next: app => {
          const isAppNameMatch = app.name.toLowerCase().includes(searchQuery)
          const isNotificationMatch = app.notifications?.some(
            ({ title, message }) => title.includes(searchQuery) || message.includes(searchQuery)
          )
          if (isAppNameMatch || isNotificationMatch) {
            newFilteredApps.push(app)
          }
        },
        complete: () => {
          setFilteredApps(newFilteredApps)
        }
      })
    }, 50),
    [myAppsMock]
  )

  useEffect(() => {
    filterApps(search)
  }, [search, filterApps])

  return (
    <div className="AppSelector">
      <Input
        onChange={({ target }) => {
          setSearch(target.value)
        }}
        placeholder="Search"
        icon={Search}
      />
      <NavLink to="/notifications/new-app" className="AppSelector__link">
        <img className="AppSelector__link-icon" src={PlusIcon} alt="NewApp" />
        <span>New App</span>
      </NavLink>
      {filteredApps.map(app => (
        <NavLink
          key={app.id}
          to={`/notifications/${app.id}`}
          className="AppSelector__link"
          onMouseEnter={() => setDropdownToShow(app.id)}
          onMouseLeave={() => setDropdownToShow(undefined)}
        >
          <div className="AppSelector__notifications">
            <div className="AppSelector__notifications-link">
              <img className="AppSelector__link-logo" src={app.logo ?? Logo} alt="Invites" />
              <span>{app.name}</span>
            </div>
            {dropdownToShow !== app.id && app.notifications?.length && (
              <CircleBadge>{app.notifications.length}</CircleBadge>
            )}
            {dropdownToShow === app.id && (
              <NotificationActionsDropdown
                appId={app.id}
                btnShape="square"
                w="28px"
                h="28px"
                closeDropdown={() => setDropdownToShow(undefined)}
              />
            )}
          </div>
        </NavLink>
      ))}
      <EmptyApps />
    </div>
  )
}

export default AppSelector
