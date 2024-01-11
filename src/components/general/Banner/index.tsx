import cn from 'classnames'

import CrossIcon from '@/components/general/Icon/CrossIcon'
import Text from '@/components/general/Text'

import './Banner.scss'

type BannerProps = {
  children: React.ReactNode
  className?: string
  onClose?: () => void
}

export default function Banner({ children, className, onClose }: BannerProps) {
  return (
    <div className={cn('Banner', className)}>
      <Text variant="small-400">{children}</Text>
      <button className="Banner__close-button" onClick={onClose}>
        <CrossIcon className="Banner__close-icon" />
      </button>
    </div>
  )
}
