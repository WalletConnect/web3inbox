import React from 'react'
import './SettingsItem.scss'
import SettingsItemText from '../SettingsItemText'

interface IProps {
  title: string
  subtitle: string
  className?: string
  children: React.ReactNode | React.ReactNode[]
}

const SettingsItem: React.FC<IProps> = ({ title, subtitle, className, children }) => {
  return (
    <div className="SettingsItem">
      <SettingsItemText title={title} subtitle={subtitle} />
      <div className={`SettingsItem__content ${className ? className : ''}`}>{children}</div>
    </div>
  )
}

export default SettingsItem
