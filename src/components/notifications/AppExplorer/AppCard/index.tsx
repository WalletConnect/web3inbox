import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import './AppCard.scss'
import Button from '../../../general/Button'
import W3iContext from '../../../../contexts/W3iContext/context'
import { showErrorMessageToast, showSuccessMessageToast } from '../../../../utils/toasts'
import Spinner from '../../../general/Spinner'
import Text from '../../../general/Text'
import CheckMarkIcon from '../../../general/Icon/CheckMarkIcon'
import { useNavigate } from 'react-router-dom'

interface AppCardProps {
  name: string
  description: string
  logo: string
  isVerified: boolean
  bgColor: {
    dark: string
    light: string
  }
  url: string
}

const AppCard: React.FC<AppCardProps> = ({ name, description, logo, bgColor, url, isVerified }) => {
  const [subscribing, setSubscribing] = useState(false)
  const nav = useNavigate()
  const ref = useRef<HTMLDivElement>(null)
  const { notifyClientProxy, userPubkey } = useContext(W3iContext)

  const { activeSubscriptions } = useContext(W3iContext)

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
      </div>
      <div className="AppCard__body">
        <div className="AppCard__body__title">
          <Text className="" variant="large-600">
            {name}
          </Text>
        </div>
        <Text className="AppCard__body__subtitle" variant="tiny-500">
          {isVerified ? 'Official app' : new URL(url).host}
        </Text>
        <Text className="AppCard__body__description" variant="paragraph-500">
          {description}
        </Text>
        {subscribed ? (
          <>
            <Button disabled className="AppCard__body__subscribed">
              Subscribed
              <CheckMarkIcon />
            </Button>
          </>
        ) : (
          <Button
            disabled={subscribing}
            className="AppCard__body__subscribe"
            onClick={handleSubscription}
          >
            {subscribing ? <Spinner width="1em" /> : 'Subscribe'}
          </Button>
        )}
      </div>
    </div>
  )
}

export default AppCard
