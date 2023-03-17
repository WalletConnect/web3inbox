import React, { useContext } from 'react'
import SettingsContext from '../../../contexts/SettingsContext/context'
import { useColorModeValue } from '../../../utils/hooks'

interface CrossIconProps {
  fillColor?: string
}

const CrossIcon: React.FC<CrossIconProps> = ({ fillColor }) => {
  const { mode } = useContext(SettingsContext)
  const themeColors = useColorModeValue(mode)

  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9.15901 10.2197C9.4519 10.5126 9.92678 10.5126 10.2197 10.2197C10.5126 9.92678 10.5126 9.4519 10.2197 9.15901L6.63389 5.57323C6.43862 5.37796 6.43862 5.06138 6.63389 4.86612L10.2197 1.28034C10.5126 0.987445 10.5126 0.512572 10.2197 0.219679C9.92678 -0.0732145 9.4519 -0.0732144 9.15901 0.219679L5.57323 3.80546C5.37796 4.00072 5.06138 4.00072 4.86612 3.80546L1.28033 0.21967C0.987437 -0.0732231 0.512563 -0.0732235 0.21967 0.21967C-0.0732233 0.512563 -0.0732233 0.987437 0.21967 1.28033L3.80546 4.86612C4.00072 5.06138 4.00072 5.37796 3.80546 5.57323L0.21967 9.15902C-0.0732229 9.45191 -0.0732234 9.92679 0.21967 10.2197C0.512563 10.5126 0.987437 10.5126 1.28033 10.2197L4.86612 6.63389C5.06138 6.43862 5.37797 6.43862 5.57323 6.63389L9.15901 10.2197Z"
        fill={fillColor ?? themeColors['--fg-color-1']}
      />
    </svg>
  )
}

export default CrossIcon
