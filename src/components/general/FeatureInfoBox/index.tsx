import React, { Fragment, useCallback, useContext, useState } from 'react'

import SettingsContext from '@/contexts/SettingsContext/context'
import { useColorModeValue } from '@/utils/hooks'
import type { IIcon, ISection } from '@/utils/types'

import Button from '../Button'
import CrossIcon from '../Icon/CrossIcon'
import IconWrapper from '../Icon/IconWrapper/IconWrapper'
import Text from '../Text'

import './FeatureInfoBox.scss'

interface IFeatureInfoBoxProps {
  localStorageKey: string
  header: string
  mainIcon: IIcon
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
  const [isFeatureInfoBoxClosed, setIsFeatureInfoBoxClosed] = useState(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (typeof localStorage === 'undefined' || !localStorage) {
      return true
    }

    return localStorage.getItem(localStorageKey) === 'keep-closed'
  })
  const handleCloseInfoBox = useCallback(() => {
    localStorage.setItem(localStorageKey, 'keep-closed')
    setIsFeatureInfoBoxClosed(true)
  }, [])

  return isFeatureInfoBoxClosed ? (
    <Fragment />
  ) : (
    <div className="FeatureInfoBox">
      <Button className="FeatureInfoBox__close" onClick={handleCloseInfoBox}>
        <CrossIcon />
      </Button>
      <div className="FeatureInfoBox__container">
        <img
          className="FeatureInfoBox__container__main-icon"
          src={mainIcon.icon}
          alt={mainIcon.alt}
          loading="lazy"
        />
        <Text variant="large-500">{header}</Text>

        {sections.map(section => (
          <div key={section.title} className="FeatureInfoBox__container__functionality">
            <div className="FeatureInfoBox__container__functionality__icons">
              {section.icons.map(({ icon, alt, shape, bgColor }) => (
                <IconWrapper key={alt} shape={shape} bgColor={bgColor}>
                  <img src={icon} alt={alt} loading="lazy" />
                </IconWrapper>
              ))}
            </div>
            <Text variant="small-400">{section.title}</Text>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FeatureInfoBox
