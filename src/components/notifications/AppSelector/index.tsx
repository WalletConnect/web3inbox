import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Input from '../../general/Input'
import Search from '../../../assets/Search.svg'
import Logo from '../../../assets/Logo.svg'
import PlusIcon from '../../../assets/Plus.svg'
import NavLink from '../../general/NavLink'
import debounce from 'lodash.debounce'
import { from } from 'rxjs'
import EmptyApps from './EmptyApps'
import './AppSelector.scss'
import CircleBadge from '../../general/Badge/CircleBadge'

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

const AppSelector: React.FC = () => {
  const [search, setSearch] = useState('')
  const [showMockApps] = useState(false)

  const myApps = useMemo(
    () => [
      {
        id: 'foundation',
        name: 'Foundation',
        color: 'black',
        notifications: [
          {
            id: 'fake-uuid',
            title: 'You won an auction',
            message: `You successfully bought ‘x l o 35’ for 1 ETH from @emrecolako`
          },
          {
            id: 'a-fake-uuid',
            title: 'You have a new follower',
            message: '@enmity followed you'
          }
        ]
      },
      {
        id: 'uniswap',
        name: 'Uniswap',
        logo: 'https://explorer-api.walletconnect.com/v3/logo/md/32a77b79-ffe8-42c3-61a7-3e02e019ca00?projectId=2f05ae7f1116030fde2d36508f472bfb',
        color: 'pink',
        notifications: [
          {
            id: 'an-other-fake-uuid',
            title: 'ETH Price Alert',
            message: 'ETH passed the treshold of $2000'
          }
        ]
      },
      { id: 'nouns-dao', name: 'Nouns DAO', color: 'yellow' },
      { id: 'lenster', name: 'Lenster', color: 'purple' }
    ],
    []
  )

  const [filteredApps, setFilteredApps] = useState<PushApp[]>([])

  const filterApps = useCallback(
    debounce((searchQuery: string) => {
      if (!searchQuery) {
        setFilteredApps(showMockApps ? myApps : [])

        return
      }

      const newFilteredApps = [] as PushApp[]

      from(myApps).subscribe({
        next: app => {
          if (app.name.toLowerCase().includes(searchQuery)) {
            newFilteredApps.push(app)
          }
        },
        complete: () => {
          setFilteredApps(newFilteredApps)
        }
      })
    }, 50),
    [myApps]
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
        <NavLink to={`/notifications/${app.id}`} className="AppSelector__link">
          <div className="AppSelector__notifications">
            <div className="AppSelector__notifications-link">
              <img className="AppSelector__link-logo" src={app.logo ?? Logo} alt="Invites" />
              <span>{app.name}</span>
            </div>
            {app.notifications && <CircleBadge>{app.notifications.length}</CircleBadge>}
          </div>
        </NavLink>
      ))}
      {filteredApps.length === 0 && <EmptyApps />}
    </div>
  )
}

export default AppSelector
