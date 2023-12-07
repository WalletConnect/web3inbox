import { useContext, useEffect, useMemo, useRef } from 'react'

import { useParams } from 'react-router-dom'

import Button from '@/components/general/Button'
import CheckMarkIcon from '@/components/general/Icon/CheckMarkIcon'
import Text from '@/components/general/Text'
import SettingsContext from '@/contexts/SettingsContext/context'
import W3iContext from '@/contexts/W3iContext/context'

import './AppNotificationsCardMobile.scss'

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
    <div className="AppNotificationsCardMobile" ref={ref}>
      <img
        className="AppNotificationsCardMobile__logo"
        src={app?.metadata?.icons?.[0] || '/fallback.svg'}
        alt={`${app?.metadata.name} logo`}
      />
      <div className="AppNotificationsCardMobile__wrapper">
        <div className="AppNotificationsCardMobile__title">
          <Text variant="large-600">{app?.metadata.name}</Text>
        </div>
        <Text className="AppNotificationsCardMobile__url" variant="paragraph-500">
          {app?.metadata.appDomain}
        </Text>
      </div>
      <Text className="AppNotificationsCardMobile__description" variant="small-400">
        {app?.metadata.description}
      </Text>
      <Button disabled className="AppNotificationsCardMobile__subscribed" size="small">
        Subscribed
        <CheckMarkIcon />
      </Button>
    </div>
  )
}

export default AppNotificationsCardMobile
