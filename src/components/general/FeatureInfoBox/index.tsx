import React, { Fragment, useCallback, useContext, useState } from 'react'
import SettingsContext from '../../../contexts/SettingsContext/context'
import { useColorModeValue } from '../../../utils/hooks'
import Button from '../Button'
import CrossIcon from '../Icon/CrossIcon'
import './FeatureInfoBox.scss'

interface IIcon {
  icon: string
  alt: string
}

interface IFeatureInfoBoxProps {
  localStorageKey: string
  header: string
  mainIcon: IIcon
  sections: {
    title: string
    icons: IIcon[]
  }[]
}

const FeatureInfoBox: React.FC<IFeatureInfoBoxProps> = ({
  header,
  mainIcon,
  sections,
  localStorageKey
}) => {
  const { mode } = useContext(SettingsContext)
  const themeColors = useColorModeValue(mode)
  const [isFeatureInfoBoxClosed, setIsFeatureInfoBoxClosed] = useState(
    () => localStorage.getItem(localStorageKey) === 'keep-closed'
  )
  const handleCloseInfoBox = useCallback(() => {
    localStorage.setItem(localStorageKey, 'keep-closed')
    setIsFeatureInfoBoxClosed(true)
  }, [])

  return isFeatureInfoBoxClosed ? (
    <Fragment />
  ) : (
    <div className="FeatureInfoBox">
      <Button className="FeatureInfoBox__close" onClick={handleCloseInfoBox}>
        <CrossIcon fillColor={themeColors['--fg-color-1']} />
      </Button>
      <div className="FeatureInfoBox__container">
        <img src={mainIcon.icon} alt={mainIcon.alt} />
        <div className="FeatureInfoBox__container__functionalities">{header}</div>
        {sections.map(section => (
          <div key={section.title} className="FeatureInfoBox__container__functionality">
            <div className="FeatureInfoBox__container__functionality__icons">
              {section.icons.map(({ icon, alt }) => (
                <img key={alt} src={icon} alt={alt} />
              ))}
            </div>
            {section.title}
          </div>
        ))}
      </div>
    </div>
  )
}

export default FeatureInfoBox
