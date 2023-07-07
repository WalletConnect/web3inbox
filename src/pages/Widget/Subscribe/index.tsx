import React, { useEffect } from 'react'
import SubscribeModal from '../../../components/notifications/SubscribeModal'
import './SubscribePage.scss'
import { subscribeModalService } from '../../../utils/store'

const SubscribePage: React.FC = () => {
  useEffect(() => {
    subscribeModalService.openModal({
      account: '',
      id: Date.now(),
      metadata: {
        name: 'gm-dapp',
        description: 'Get a gm every hour',
        icons: [
          'https://explorer-api.walletconnect.com/v3/logo/md/32b894e5-f91e-4fcd-6891-38d31fa6ba00?projectId=25de36e8afefd5babb4b45580efb4e06'
        ],
        url: 'https://gm.walletconnect.com'
      }
    })
  }, [subscribeModalService])

  return (
    <div className="SubscribePage">
      <SubscribeModal />
    </div>
  )
}

export default SubscribePage
