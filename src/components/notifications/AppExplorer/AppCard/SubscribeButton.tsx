import React from 'react'

import cn from 'classnames'

import ChevronRightIcon from '@/components/general/Icon/ChevronRightIcon'
import Spinner from '@/components/general/Spinner'

import './AppCard.scss'

interface SubscribeButtonProps {
  className?: string
  subscribing: boolean
  subscribed: boolean
  onNavigateToApp: () => void
  onSubscribe: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>
}

const SubscribeButton: React.FC<SubscribeButtonProps> = ({
  className,
  subscribing,
  subscribed,
  onNavigateToApp,
  onSubscribe
}) => {
  if (subscribed) {
    return (
      <button onClick={onNavigateToApp} className={cn('AppCard__body__subscribed', className)}>
        Subscribed
        <ChevronRightIcon />
      </button>
    )
  }

  return (
    <button
      disabled={subscribing}
      className={cn('AppCard__body__subscribe', className)}
      onClick={onSubscribe}
    >
      {subscribing ? <Spinner /> : 'Subscribe'}
    </button>
  )
}

export default SubscribeButton
