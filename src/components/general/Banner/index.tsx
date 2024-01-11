import cn from 'classnames'

import CrossIcon from '@/components/general/Icon/CrossIcon'
import Text from '@/components/general/Text'

import './Banner.scss'

type BannerProps = {
  children: React.ReactNode
  className?: string
}

export default function Banner({ children, className }: BannerProps) {
  return (
    <div className={cn('Banner', className)}>
      <Text variant="small-400">{children}</Text>
      <CrossIcon className="Banner__close-icon" />
    </div>
  )
}
