import React from 'react'

import cn from 'classnames'

import ChevronRightIcon from '@/components/general/Icon/ChevronRightIcon'
import Spinner from '@/components/general/Spinner'

import './AppCard.scss'

interface SubscribeButtonProps {
  className?: string
  loading?: boolean
  subscribing: boolean
  subscribed: boolean
  onNavigateToApp: () => void
  onSubscribe: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>
}

const SubscribeButton: React.FC<SubscribeButtonProps> = ({
  className,
  loading,
  subscribing,
  subscribed,
  onNavigateToApp,
  onSubscribe
}) => {
  if (subscribed || loading) {
    return (
      <button
        disabled={loading}
        onClick={onNavigateToApp}
        className={cn('AppCard__body__subscribed', className)}
      >
        {loading ? null : 'Subscribed'}
        {loading ? <Spinner /> : <ChevronRightIcon />}
      </button>
    )
  }

  return (
    <button
      disabled={subscribing}
      className={cn('AppCard__body__subscribe', className)}
      onClick={onSubscribe}
    >
      {subscribing ? 'Subscribing' : 'Subscribe'}
      {subscribing ? <Spinner /> : null}
    </button>
  )
}

export default SubscribeButton
