import React, { Fragment, useCallback, useContext, useState } from 'react'
import SettingsContext from '../../../contexts/SettingsContext/context'
import { useColorModeValue } from '../../../utils/hooks'
import type { IICon, ISection } from '../../../utils/types'
import Button from '../Button'
import CrossIcon from '../Icon/CrossIcon'
import IconWrapper from '../Icon/IconWrapper/IconWrapper'
import './FeatureInfoBox.scss'

interface IFeatureInfoBoxProps {
  localStorageKey: string
  header: string
  mainIcon: IICon
  sections: ISection[]
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
              {section.icons.map(({ icon, alt, shape, bgColor }) => (
                <IconWrapper key={alt} shape={shape} bgColor={bgColor}>
                  <img src={icon} alt={alt} />
                </IconWrapper>
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
