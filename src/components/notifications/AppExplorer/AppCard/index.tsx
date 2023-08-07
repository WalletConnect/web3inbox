import React, { useCallback, useContext, useMemo, useState } from 'react'

import externalLinkIcon from '../../../../assets/ExternalLink.svg'
import SettingsContext from '../../../../contexts/SettingsContext/context'
import './AppCard.scss'
import Button from '../../../general/Button'
import W3iContext from '../../../../contexts/W3iContext/context'
import { showErrorMessageToast, showSuccessMessageToast } from '../../../../utils/toasts'
import { handleImageFallback } from '../../../../utils/ui'
import Spinner from '../../../general/Spinner'
import Text from '../../../general/Text'
import { requestNotificationPermission } from '../../../../utils/notifications'

interface AppCardProps {
  name: string
  description: string
  logo: string
  bgColor: {
    dark: string
    light: string
  }
  url: string
}

const AppCard: React.FC<AppCardProps> = ({ name, description, logo, bgColor, url }) => {
  const [subscribing, setSubscribing] = useState(false)
  const { mode } = useContext(SettingsContext)
  const { pushClientProxy, userPubkey, pushProvider } = useContext(W3iContext)
  const cardBgColor = useMemo(() => {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    const specifiedMode = mode === 'system' ? systemTheme : mode

    return specifiedMode === 'dark' ? bgColor.dark : bgColor.light
  }, [mode, bgColor])

  const handleSubscription = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      if (!userPubkey) {
        return
      }

      setSubscribing(true)

      try {
        pushClientProxy?.observeOne('push_subscription', {
          next: () => {
            showSuccessMessageToast(`Subscribed to ${name}`)
          }
        })
        await pushClientProxy?.subscribe({
          account: `eip155:1:${userPubkey}`,
          metadata: {
            name,
            description,
            icons: [logo],
            url
          }
        })
      } catch (error) {
        showErrorMessageToast(`Failed to subscribe to ${name}`)
      }
    },
    [userPubkey, name, description, logo, bgColor, url, setSubscribing]
  )

  return (
    <a
      className="AppCard"
      style={{ backgroundColor: cardBgColor }}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="AppCard__header">
        <img
          className="AppCard__header__logo"
          src={logo}
          alt={`${name} logo`}
          onError={handleImageFallback}
        />
        <img
          className="AppCard__header__link-icon"
          src={externalLinkIcon}
          alt={`navigate to ${url}`}
        />
      </div>

      <div className="AppCard__body">
        <Text variant="large-700">{name}</Text>
        <Text variant="paragraph-500">{description}</Text>
        <div className="AppCard__body__url">
          <Text variant="small-400"> {url.replace('https://', '')}</Text>
        </div>
        <Button
          disabled={subscribing}
          className="AppCard__body__subscribe"
          onClick={e => {
            if (pushProvider === 'internal') {
              /*
               * It's better to have Notification.requestPermission directly after a click was
               * fired, according to MDN best practices.
               */
              requestNotificationPermission().then(async () => handleSubscription(e))
            } else {
              handleSubscription(e)
            }
          }}
        >
          {subscribing ? <Spinner width="1em" /> : 'Subscribe'}
        </Button>
      </div>
    </a>
  )
}

export default AppCard
