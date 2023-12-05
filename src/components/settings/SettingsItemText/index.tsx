import React from 'react'

import Text from '@/components/general/Text'

import './SettingsItemText.scss'

interface IProps {
  title: string
  subtitle: string
}

const SettingsItemText: React.FC<IProps> = ({ title, subtitle }) => {
  return (
    <div className="SettingsItemText">
      <Text className="SettingsItemText__title" variant="paragraph-600">
        {title}
      </Text>
      <Text className="SettingsItemText__subtitle" variant="small-500">
        {subtitle}
      </Text>
    </div>
  )
}

export default SettingsItemText
