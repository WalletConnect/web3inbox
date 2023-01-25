import React, { useMemo } from 'react'
import Alarm from '../../../../assets/Alarm.svg'
import ColoredNotificationBell from '../../../../assets/ColoredNotificationBell.svg'
import Toggle from '../../../../assets/Toggle.svg'
import Chart from '../../../../assets/Chart.svg'
import Landscape from '../../../../assets/Landscape.svg'
import Inbox from '../../../../assets/Inbox.svg'
import MobilePhone from '../../../../assets/MobilePhone.svg'
import FeatureInfoBox from '../../../general/FeatureInfoBox'

const EmptyApps: React.FC = () => {
  const sections = useMemo(
    () => [
      {
        title: 'Enable notifications on any of the apps you use',
        icons: [
          {
            icon: ColoredNotificationBell,
            alt: 'notifications-icon'
          },
          {
            icon: Toggle,
            alt: 'toggle-icon'
          }
        ]
      },
      {
        title: 'Browse across the many apps we compiled that offer a great notification experience',
        icons: [
          {
            icon: Chart,
            alt: 'chart-icon'
          },
          {
            icon: Landscape,
            alt: 'landscape-icon'
          }
        ]
      },
      {
        title: 'Once enabled, your notifications will appear here and in your wallet',
        icons: [
          {
            icon: Inbox,
            alt: 'inbox-icon'
          },
          {
            icon: MobilePhone,
            alt: 'mobile-phone-icon'
          }
        ]
      }
    ],
    []
  )

  return (
    <FeatureInfoBox
      localStorageKey="w3i-empty-apps-infos"
      header="Get notified on activity from your fave web3 apps"
      mainIcon={{
        icon: Alarm,
        alt: 'alarm-icon'
      }}
      sections={sections}
    />
  )
}

export default EmptyApps
