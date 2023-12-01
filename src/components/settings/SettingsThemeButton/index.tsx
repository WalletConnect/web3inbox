import React from 'react'

import Text from '@/components/general/Text'

import './SettingsThemeButton.scss'

interface IProps {
  title: string
  subtitle: string
  value: string
  icon: React.ReactNode
  disabled?: boolean
  checked?: boolean
}

const SettingsThemeButton: React.FC<IProps> = ({
  title,
  subtitle,
  icon,
  value,
  disabled,
  checked
}) => {
  return (
    <>
      <input
        className="SettingsThemeInput"
        id={value}
        type="radio"
        name="theme"
        value={value}
        onClick={() => {}}
        checked={checked}
        disabled={disabled}
      />
      <label
        htmlFor={value}
        className={`SettingsThemeButton ${disabled ? 'SettingsThemeButton__disabled' : ''}`}
      >
        <div className="SettingsThemeButton__icon">{icon}</div>
        <div className="SettingsThemeButton__wrapper">
          <Text className="SettingsThemeButton__title" variant="paragraph-600">
            {title}
          </Text>
          <Text className="SettingsThemeButton__subtitle" variant="small-500">
            {subtitle}
          </Text>
        </div>
      </label>
    </>
  )
}

export default SettingsThemeButton
