import React from 'react'
import './IntroContent.scss'
import Text from '../Text'
import BackgroundImage from '../../../assets/IntroBackground.png'

interface IIntroContent {
  icon: React.ReactNode
  title: string
  subtitle: string
  button?: React.ReactNode
}

const IntroContent: React.FC<IIntroContent> = ({ icon, title, subtitle, button }) => {
  return (
    <div className="IntroContent">
      <img className="IntroContent__Background" src={BackgroundImage} />
      {icon}
      <div className="IntroContent__Text">
        <Text variant="large-600">{title}</Text>
        <Text variant="small-400">{subtitle}</Text>
      </div>
      {button ? button : null}
    </div>
  )
}

export default IntroContent
