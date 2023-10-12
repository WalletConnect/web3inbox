import { useContext, useEffect, useMemo, useRef } from 'react'
import { useParams } from 'react-router-dom'
import W3iContext from '../../../../contexts/W3iContext/context'
import { handleImageFallback } from '../../../../utils/ui'
import Text from '../../../general/Text'
import VerifiedIcon from '../../../general/Icon/VerifiedIcon'
import CheckMarkIcon from '../../../general/Icon/CheckMarkIcon'
import Button from '../../../general/Button'
import './AppNotificationsCardMobile.scss'
import SettingsContext from '../../../../contexts/SettingsContext/context'

const AppNotificationsCardMobile: React.FC = () => {
  const { topic } = useParams<{ topic: string }>()
  const { activeSubscriptions, notifyClientProxy } = useContext(W3iContext)
  const app = activeSubscriptions.find(mock => mock.topic === topic)
  const { mode } = useContext(SettingsContext)
  const ref = useRef<HTMLDivElement>(null)

  const cardBgColor = useMemo(() => {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    const specifiedMode = mode === 'system' ? systemTheme : mode

    return specifiedMode === 'dark' ? '#FF00FF' : '#00FF00'
  }, [mode])

  useEffect(() => {
    if (ref.current) {
      ref.current.style.setProperty('--local-bg-color', cardBgColor)
    }
  }, [])

  return (
    <>
      <div className="AppNotificationsCardMobile" ref={ref}>
        <img
          className="AppNotificationsCardMobile__logo"
          src={app?.metadata.icons?.length ? app.metadata.icons[0] : '/fallback.svg'}
          alt={`${app?.metadata.name} logo`}
          onError={handleImageFallback}
        />
        <div className="AppNotificationsCardMobile__wrapper">
          <div className="AppNotificationsCardMobile__title">
            <Text variant="large-600">{app?.metadata.name}</Text>
            <VerifiedIcon />
          </div>
          <Text className="AppNotificationsCardMobile__url" variant="paragraph-500">
            {app?.metadata.appDomain}
          </Text>
        </div>
        <Text className="AppNotificationsCardMobile__description" variant="small-400">
          {app?.metadata.description}
        </Text>
        <Button disabled className="AppNotificationsCardMobile__subscribed">
          Subscribed
          <CheckMarkIcon />
        </Button>
      </div>
    </>
  )
}

export default AppNotificationsCardMobile
