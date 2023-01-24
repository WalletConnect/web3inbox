import React, { Fragment, useCallback, useState } from 'react'
import './EmptyThreads.scss'
import CrossIcon from '../../../general/Icon/CrossIcon'
import Button from '../../../general/Button'

const EmptyThreads: React.FC = () => {
  const [isEmptyThreadsClosed, setIsEmptyThreadsClosed] = useState(
    () => localStorage.getItem('w3i-empty-threads-infos') === 'keep-closed'
  )
  const handleCloseEmptyBox = useCallback(() => {
    localStorage.setItem('w3i-empty-threads-infos', 'keep-closed')
    setIsEmptyThreadsClosed(true)
  }, [])

  return isEmptyThreadsClosed ? (
    <Fragment />
  ) : (
    <div className="empty-threads">
      <Button className="empty-threads__close" onClick={handleCloseEmptyBox}>
        <CrossIcon fillColor="#141414" />
      </Button>
      Empty threads
    </div>
  )
}

export default EmptyThreads
