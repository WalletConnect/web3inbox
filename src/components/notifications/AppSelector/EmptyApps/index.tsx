import React from 'react'

import Alarm from '@/assets/Alarm.png'
import Chart from '@/assets/Chart.png'
import ColoredNotificationBell from '@/assets/ColoredNotificationBell.png'
import FramedPicture from '@/assets/FramedPicture.png'
import Inbox from '@/assets/Inbox.png'
import MobilePhone from '@/assets/MobilePhone.png'
import Toggle from '@/assets/Toggle.png'
import FeatureInfoBox from '@/components/general/FeatureInfoBox'
import type { ISection } from '@/utils/types'

const sections: ISection[] = [
  {
    title: 'Enable notifications on any of the apps you use',
    icons: [
      {
        icon: ColoredNotificationBell,
        alt: 'notifications-icon',
        bgColor: 'nightBlue',
        shape: 'circle'
      },
      {
        icon: Toggle,
        alt: 'toggle-icon',
        shape: 'standalone'
      }
    ]
  },
  {
    title: 'Browse across the many apps we compiled that offer a great notification experience',
    icons: [
      {
        icon: Chart,
        alt: 'chart-icon',
        bgColor: 'orange',
        shape: 'square'
      },
      {
        icon: FramedPicture,
        alt: 'landscape-icon',
        bgColor: 'blue',
        shape: 'square'
      }
    ]
  },
  {
    title: 'Once enabled, your notifications will appear here and in your wallet',
    icons: [
      {
        icon: Inbox,
        alt: 'inbox-icon',
        bgColor: 'purple',
        shape: 'circle'
      },
      {
        icon: MobilePhone,
        alt: 'mobile-phone-icon',
        bgColor: 'green',
        shape: 'square'
      }
    ]
  }
]

const EmptyApps: React.FC = () => {
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
