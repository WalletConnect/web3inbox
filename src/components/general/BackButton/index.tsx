import type { ReactNode } from 'react'
import { useContext } from 'react'
import React from 'react'

import { useNavigate } from 'react-router-dom'

import SettingsContext from '@/contexts/SettingsContext/context'
import { useColorModeValue, useIsMobile } from '@/utils/hooks'

import './BackButton.scss'

/*
 * Using backTo instead of something like `history.back` to
 * avoid having the case of losing the history when the user directly
 * navigates to something like /messages/chat/peer
 */
interface BackButtonProps {
  backTo: string
  force?: boolean
  children?: ReactNode
}

const BackButton: React.FC<BackButtonProps> = ({ backTo, children, force }) => {
  const isMobile = useIsMobile()

  const { mode } = useContext(SettingsContext)
  const themeColors = useColorModeValue(mode)

  const nav = useNavigate()

  return isMobile || force ? (
    <div
      onClick={() => {
        nav(backTo)
      }}
      className="BackButton"
    >
      <svg fill="none" viewBox="0 0 12 12">
        <path
          fill={themeColors['--fg-color-1']}
          fillRule="evenodd"
          d="M8.7.3a1 1 0 0 1 0 1.4L4.42 6l4.3 4.3a1 1 0 1 1-1.42 1.4l-5-5a1 1 0 0 1 0-1.4l5-5a1 1 0 0 1 1.42 0Z"
          clipRule="evenodd"
        />
      </svg>
      {children && <p className="BackButton__Title">{children}</p>}
    </div>
  ) : null
}

export default BackButton
