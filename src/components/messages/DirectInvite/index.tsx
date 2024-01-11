import { useContext, useEffect } from 'react'

import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useEnsName } from 'wagmi'

import Spinner from '@/components/general/Spinner'
import W3iContext from '@/contexts/W3iContext/context'
import { truncate } from '@/utils/string'
import { showErrorMessageToast } from '@/utils/toasts'

import './DirectInvite.scss'

const DirectInvite: React.FC = () => {
  const { account } = useParams<{ account: string }>()
  const { data: ensName } = useEnsName({ address: account as `0x${string}` })
  const loc = useLocation()
  const key = new URLSearchParams(loc.search).get('key')
  const nav = useNavigate()
  const { chatClientProxy, userPubkey } = useContext(W3iContext)

  useEffect(() => {
    if (!account || !chatClientProxy || !userPubkey) {
      return
    }

    const invite = async () => {
      try {
        await chatClientProxy.invite({
          message: 'Invited through QRCode!',
          inviteeAccount: account,
          inviteePublicKey: key ?? (await chatClientProxy.resolve({ account })),
          inviterAccount: `eip155:1:${userPubkey}`
        })
        nav('/messages')
      } catch {
        showErrorMessageToast(`Failed to invite ${account}`)
        nav('/messages')
      }
    }

    invite()
  }, [account, key, userPubkey, nav])

  return (
    <div className="DirectInvite">
      <div className="DirectInvite__message">
        <span>Inviting {ensName ?? truncate(account ?? '', 4)}... </span>
        <Spinner />
      </div>
    </div>
  )
}

export default DirectInvite
