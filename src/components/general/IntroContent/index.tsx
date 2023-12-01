import React from 'react'

import { motion } from 'framer-motion'

import BackgroundImage from '@/assets/IntroBackground.png'
import { useIsMobile } from '@/utils/hooks'

import Text from '../Text'
import './IntroContent.scss'

interface IIntroContent {
  icon: React.ReactNode
  title: string
  subtitle: string
  scale: number
  animation?: boolean
  button?: React.ReactNode
}

const IntroContent: React.FC<IIntroContent> = ({
  icon,
  title,
  subtitle,
  button,
  scale,
  animation
}) => {
  const isMobile = useIsMobile()
  const animateImage = isMobile ? false : animation

  return (
    <div className="IntroContent">
      <motion.img
        transition={{ duration: 0.66 }}
        initial={{ scale: animateImage ? 1.75 : scale, translateY: '-15%', translateX: '5%' }}
        animate={{ scale: isMobile ? 2 : scale, translateY: '-15%', translateX: '5%' }}
        className="IntroContent__Background"
        src={BackgroundImage}
      />
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
