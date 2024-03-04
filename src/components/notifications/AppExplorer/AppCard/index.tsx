import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

import { useAllSubscriptions, useSubscribe, useSubscription } from '@web3inbox/react'
import classNames from 'classnames'
import { useNavigate } from 'react-router-dom'

import SpannerSVG from '@/assets/Spanner.svg'
import Badge from '@/components/general/Badge'
import Text from '@/components/general/Text'
import W3iContext from '@/contexts/W3iContext/context'
import { logError } from '@/utils/error'
import { showErrorMessageToast, showSuccessMessageToast } from '@/utils/toasts'

import SubscribeButton from './SubscribeButton'

import './AppCard.scss'

interface AppCardProps {
  name: string
  description: string
  loadingSubscription: boolean
  logo: string
  url: string
  isVerified?: boolean
  isComingSoon: boolean
}

const AppCard: React.FC<AppCardProps> = ({
  description,
  isComingSoon,
  isVerified,
  loadingSubscription,
  logo,
  name,
  url
}) => {
  const [subscribing, setSubscribing] = useState(false)
  const nav = useNavigate()
  const ref = useRef<HTMLDivElement>(null)
  const { userPubkey } = useContext(W3iContext)

  const { data: activeSubscriptions } = useAllSubscriptions()
  const { subscribe } = useSubscribe()

  // todo: pass params to subscribe
  // subscribe()

  const host = new URL(url).host
  const projectURL = new URL(url)

  useEffect(() => {
    // If the account changes, the subscribing flow has broken.
    setSubscribing(false)
  }, [userPubkey])

  const subscribed =
    userPubkey &&
    activeSubscriptions?.some(element => {
      return projectURL.hostname === element.metadata.appDomain
    })
  const logoURL = logo || '/fallback.svg'

  const handleSubscription = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()

      if (!userPubkey) {
        return
      }

      setSubscribing(true)
      try {
        await subscribe(undefined, host)
      } catch (error) {
        logError(error)
        setSubscribing(false)
        showErrorMessageToast(`Failed to subscribe to ${name}`)
      }
    },
    [userPubkey, name, description, logo, url, setSubscribing, subscribed]
  )

  const handleNavigateApp = () => {
    if (subscribed) {
      try {
        const appDomain = new URL(url).host
        const topic = activeSubscriptions?.find(sub => sub.metadata.appDomain === appDomain)?.topic
        if (topic) {
          nav(`/notifications/${appDomain}`)
        } else {
          throw new Error(`No matching subscription found to domain, ${appDomain}`)
        }
      } catch (e: any) {
        logError(e)
      }
    }
  }

  useEffect(() => {
    if (subscribing && subscribed) {
      showSuccessMessageToast(`Subscribed to ${name}`)
      setSubscribing(false)
    }
  }, [subscribing, subscribed])

  return (
    <div
      ref={ref}
      className={classNames('AppCard', isComingSoon && 'AppCard__coming-soon')}
      rel="noopener noreferrer"
      style={{ cursor: subscribed ? 'pointer' : 'default' }}
      onClick={handleNavigateApp}
    >
      <div className="AppCard__background" style={{ backgroundImage: `url(${logoURL})` }} />
      <div className="AppCard__header">
        <div className="AppCard__header__logo">
          <img src={logo || '/fallback.svg'} alt={`${name} logo`} />
          {!isVerified && !isComingSoon ? (
            <img src={SpannerSVG} className="AppCard__header__logo__dev-icon" alt="Dev mode icon" />
          ) : null}
        </div>
        {isComingSoon ? (
          <Badge variant="outline">Coming soon</Badge>
        ) : (
          <SubscribeButton
            className="mobile"
            subscribed={Boolean(subscribed)}
            subscribing={subscribing}
            onNavigateToApp={handleNavigateApp}
            onSubscribe={handleSubscription}
            loading={loadingSubscription}
          />
        )}
      </div>
      <div className="AppCard__body">
        <div className="AppCard__body__title">
          <Text variant="large-600">{name}</Text>
          {!isVerified && !isComingSoon ? <Badge>DEV</Badge> : null}
        </div>
        <Text className="AppCard__body__subtitle" variant="tiny-500">
          {host}
        </Text>
        <Text className="AppCard__body__description" variant="paragraph-500">
          {description}
        </Text>
        {isComingSoon ? null : (
          <SubscribeButton
            subscribed={Boolean(subscribed)}
            subscribing={subscribing}
            onNavigateToApp={handleNavigateApp}
            onSubscribe={handleSubscription}
            loading={loadingSubscription}
          />
        )}
      </div>
    </div>
  )
}

export default AppCard
