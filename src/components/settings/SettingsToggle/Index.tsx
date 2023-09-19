import React, { ReactNode, useState } from 'react'
import './SettingsToggle.scss'
import Text from '../../general/Text'
import Toggle from '../../general/Toggle'

interface IProps {
  title: string
  subtitle?: string
  active: boolean
  icon: ReactNode
}

const SettingsToggle: React.FC<IProps> = ({ icon, title, subtitle, active }) => {
  const [status, setStatus] = useState<boolean>(active)

  return (
    <div className="SettingsToggle">
      <div className="SettingsToggle__wrapper">
        <div className="SettingsToggle__textwrapper">
          {icon}
          <Text className="SettingsToggle__title" variant="paragraph-500">
            {title}
          </Text>
        </div>
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
