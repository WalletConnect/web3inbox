import React from 'react'
import './AppearanceSettings.scss'
import SettingsHeader from '../SettingsHeader'
import SettingsItem from '../SettingsItem'
import Select from '../../general/Select/Select'
import SettingsThemeButton from '../SettingsThemeButton'
import SunIcon from '../../general/Icon/SunIcon'
import MoonIcon from '../../general/Icon/MoonIcon'
import SystemIcon from '../../general/Icon/SystemIcon'
import MobileHeader from '../../layout/MobileHeader'

const languages = [
  { label: 'English', value: 'english' },
  { label: 'Spanish', value: 'spanish' },
  { label: 'German', value: 'german' }
]
const currencies = [
  { label: '🇺🇸 United States Dollar (USD)', value: 'usd' },
  { label: '🇪🇺 Euro (EUR)', value: 'eur' }
]

const AppearanceSettings: React.FC = () => {
  return (
    <div className="AppearanceSettings">
      <SettingsHeader title="Appearance" />
      <MobileHeader title="Appearance" back="/settings" />
      <div className="AppearanceSettings__wrapper">
        <SettingsItem
          title="Interface theme"
          subtitle="Select how you want Web3Inbox to look."
          className="AppearanceSettings__modes"
        >
          <SettingsThemeButton
            title="Light"
            subtitle="For daytime, increased blue light exposure."
            icon={<SunIcon />}
            value="light"
            checked={true}
          />
          <SettingsThemeButton
            title="Dark"
            subtitle="For night time and to reduce eye strain."
            icon={<MoonIcon />}
            value="dark"
            disabled={true}
          />
          <SettingsThemeButton
            title="System"
            subtitle="Handled automatically by your browser or OS."
            icon={<SystemIcon />}
            value="system"
            disabled={true}
          />
        </SettingsItem>
        <SettingsItem
          title="Currency"
          subtitle="Select your preferred fiat currency to display value in."
        >
          <Select
            name="currencies"
            id="currencies"
            options={currencies}
            onChange={() => {}}
          ></Select>
        </SettingsItem>
        <SettingsItem title="Language" subtitle="Select your preferred interface language.">
          <Select name="languages" id="languages" options={languages} onChange={() => {}}></Select>
        </SettingsItem>
      </div>
    </div>
  )
}

export default AppearanceSettings
