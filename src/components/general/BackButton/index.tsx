import type { ReactNode } from 'react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useIsMobile } from '../../../utils/hooks'
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

  const nav = useNavigate()

  return isMobile || force ? (
    <div
      onClick={() => {
        nav(backTo)
      }}
      className="BackButton"
    >
      <svg
        width="10"
        height="20"
        viewBox="0 0 10 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7.23547 0.941281C7.68211 0.414878 8.47092 0.350222 8.99733 0.796866C9.52373 1.24351 9.58838 2.03232 9.14174 2.55872L3.23964 9.51477C3.00215 9.79467 3.00215 10.2053 3.23964 10.4852L9.14174 17.4413C9.58838 17.9677 9.52373 18.7565 8.99733 19.2031C8.47092 19.6498 7.68211 19.5851 7.23547 19.0587L1.33337 12.1027C0.304242 10.8898 0.304241 9.11023 1.33337 7.89733L7.23547 0.941281Z"
          fill="#3396FF"
        />
      </svg>
      {children}
    </div>
  ) : null
}

export default BackButton
