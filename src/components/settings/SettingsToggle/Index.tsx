import React, { useState } from 'react'
import './SettingsToggle.scss'
import Text from '../../general/Text'
import Toggle from '../../general/Toggle'

interface IProps {
  title: string
  subtitle?: string
  active: boolean
}

const SettingsToggle: React.FC<IProps> = ({ title, subtitle, active }) => {
  const [status, setStatus] = useState<boolean>(active)

  return (
    <div className="SettingsToggle">
      <div className="SettingsToggle__wrapper">
        <Text className="SettingsToggle__title" variant="paragraph-500">
          {title}
        </Text>
        <Toggle
          name={title}
          id={title}
          checked={status}
          setChecked={() => {
            setStatus(!status)
          }}
        />
      </div>
      {subtitle && (
        <Text className="SettingsToggle__subtitle" variant="small-500">
          {subtitle}
        </Text>
      )}
    </div>
  )
}

export default SettingsToggle
