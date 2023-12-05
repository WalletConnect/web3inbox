import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import Text from '@/components/general/Text'
import W3iContext from '@/contexts/W3iContext/context'
import { showErrorMessageToast, showSuccessMessageToast } from '@/utils/toasts'

import SubscribeButton from './SubscribeButton'

import './AppCard.scss'

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
  const nav = useNavigate()
  const ref = useRef<HTMLDivElement>(null)
  const { notifyClientProxy, userPubkey } = useContext(W3iContext)
  const { activeSubscriptions } = useContext(W3iContext)

  const host = new URL(url).host

  useEffect(() => {
    // If the account changes, the subscribing flow has broken.
    setSubscribing(false)
  }, [userPubkey])

  const subscribed =
    userPubkey && activeSubscriptions.some(element => element.metadata.name === name)
  const logoURL = logo || '/fallback.svg'

  const handleSubscription = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()

      if (!userPubkey) {
        return
      }

      if (subscribing && subscribed) {
        showSuccessMessageToast(`Subscribed to ${name}`)

        return
      }

      setSubscribing(true)
      try {
        await notifyClientProxy?.subscribe({
          account: userPubkey,
          appDomain: new URL(url).host
        })
      } catch (error) {
        setSubscribing(false)
        showErrorMessageToast(`Failed to subscribe to ${name}`)
      }
    },
    [userPubkey, name, description, logo, bgColor, url, setSubscribing, subscribed]
  )

  const handleNavigateApp = () => {
    if (subscribed) {
      try {
        const appDomain = new URL(url).host
        const topic = activeSubscriptions.find(sub => sub.metadata.appDomain === appDomain)?.topic
        if (topic) {
          nav(`/notifications/${topic}`)
        } else {
          throw new Error(`No matching subscription found to domain, ${appDomain}`)
        }
      } catch (e: any) {
        console.error(`Failed to navigate to app: ${e.message}`)
      }
    }
  }

  return (
    <div
      ref={ref}
      className="AppCard"
      rel="noopener noreferrer"
      style={{ cursor: subscribed ? 'pointer' : 'default' }}
      onClick={handleNavigateApp}
    >
      <div className="AppCard__background" style={{ backgroundImage: `url(${logoURL})` }} />
      <div className="AppCard__header">
        <div className="AppCard__header__logo">
          <img src={logo || '/fallback.svg'} alt={`${name} logo`} />
        </div>
        <SubscribeButton
          className="mobile"
          subscribed={Boolean(subscribed)}
          subscribing={subscribing}
          onNavigateToApp={handleNavigateApp}
          onSubscribe={handleSubscription}
        />
      </div>
      <div className="AppCard__body">
        <div className="AppCard__body__title">
          <Text className="" variant="large-600">
            {name}
          </Text>
        </div>
        <Text className="AppCard__body__subtitle" variant="tiny-500">
          {host}
        </Text>
        <Text className="AppCard__body__description" variant="paragraph-500">
          {description}
        </Text>
        <SubscribeButton
          subscribed={Boolean(subscribed)}
          subscribing={subscribing}
          onNavigateToApp={handleNavigateApp}
          onSubscribe={handleSubscription}
        />
      </div>
    </div>
  )
}

export default AppCard
