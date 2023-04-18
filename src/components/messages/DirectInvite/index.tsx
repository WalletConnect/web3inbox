import { useContext, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import W3iContext from '../../../contexts/W3iContext/context'
import Spinner from '../../general/Spinner'

const DirectInvite: React.FC = () => {
  const { account } = useParams<{ account: string }>()
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
        toast('Failed to invite', {
          type: 'error'
        })
        nav('/messages')
      }
    }

    invite()
  }, [account, key, userPubkey, nav])

  return (
    <div style={{ display: 'grid', placeItems: 'center' }}>
      <Spinner width="5em" />
    </div>
  )
}

export default DirectInvite
