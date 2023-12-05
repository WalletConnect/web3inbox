import React from 'react'

import Wallet from '@/components/general/Icon/Wallet'

import './SignatureLoadingVisual.scss'

interface SignatureLoadingVisualProps {
  radius?: number
}

export const SignatureLoadingVisual: React.FC<SignatureLoadingVisualProps> = ({ radius = 34 }) => {
  const clampedRadius = radius > 50 ? 50 : radius
  const standardValue = 36
  const radiusFactor = standardValue - clampedRadius
  const dashArrayStart = 116 + radiusFactor
  const dashArrayEnd = 245 + radiusFactor
  const dashOffset = 360 + radiusFactor * 1.75

  return (
    <div className="SignatureModal__loading-visual">
      <div className="SignatureModal__loading-visual__container">
        <svg
          className="SignatureModal__loading-visual__container__circle"
          viewBox="0 0 110 110"
          width="110"
          height="110"
        >
          <rect
            x="2"
            y="2"
            width="106"
            height="106"
            rx={clampedRadius}
            strokeDasharray={`${dashArrayStart} ${dashArrayEnd}`}
            strokeDashoffset={dashOffset}
          />
        </svg>
        <div className="SignatureModal__loading-visual__container__content">
          <Wallet className="icon" />
        </div>
      </div>
    </div>
  )
}
