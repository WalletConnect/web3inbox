import React, { useContext, useMemo } from 'react'
import { shareModalService } from '../../../utils/store'
import { Modal } from '../../general/Modal/Modal'
import './Share.scss'
// eslint-disable-next-line no-duplicate-imports
import CopyIcon from '../../general/Icon/CopyIcon'
import { W3mQrCode } from '@web3modal/react'
import SettingsContext from '../../../contexts/SettingsContext/context'
import W3iContext from '../../../contexts/W3iContext/context'
import { truncate } from '../../../utils/string'
import { useEnsAvatar, useEnsName } from 'wagmi'
import { AnimatePresence, m } from 'framer-motion'
import { showErrorMessageToast, showSuccessMessageToast } from '../../../utils/toasts'

interface ModalContentProps {
  modalService: typeof shareModalService
  handleBack?: () => void
}

export const ShareModalContent: React.FC<ModalContentProps> = ({
  modalService,
  handleBack = modalService.toggleModal
}) => {
  const { userPubkey: address } = useContext(W3iContext)
  const addressOrEnsDomain = address as `0x${string}` | undefined
  const { data: ensName } = useEnsName({ address: addressOrEnsDomain })
  const { data: ensAvatar } = useEnsAvatar({ address: addressOrEnsDomain })

  const { mode } = useContext(SettingsContext)
  const uri = `${window.location.origin}/messages/invite/eip155:1:${address ?? ''}`

  const toastTheme = useMemo(() => {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    const specifiedMode = mode === 'system' ? systemTheme : mode

    return specifiedMode
  }, [mode])

  const handleCopyClick = () => {
    window.navigator.clipboard
      .writeText(address ?? '')
      .then(() => {
        showSuccessMessageToast('Copied address to clipboard')
      })
      .catch(() => {
        showErrorMessageToast('Failed to copy address to clipboard')
      })
  }

  return (
    <m.div
      transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
      initial={{
        opacity: 0,
        x: '100%'
      }}
      animate={{
        opacity: 1.01,
        x: '0%'
      }}
      exit={{
        opacity: 0,
        x: '-00%',
        transition: { duration: 0.1 }
      }}
      className="Share"
    >
      <div className="Share__header">
        <button className="Share__header--back" onClick={handleBack}>
          <svg
            width="10"
            height="20"
            viewBox="0 0 10 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M7.23547 0.941281C7.68211 0.414878 8.47092 0.350222 8.99733 0.796866C9.52373 1.24351 9.58838 2.03232 9.14174 2.55872L3.23964 9.51477C3.00215 9.79467 3.00215 10.2053 3.23964 10.4852L9.14174 17.4413C9.58838 17.9677 9.52373 18.7565 8.99733 19.2031C8.47092 19.6498 7.68211 19.5851 7.23547 19.0587L1.33337 12.1027C0.304242 10.8898 0.304241 9.11023 1.33337 7.89733L7.23547 0.941281Z"
              fill="currentcolor"
            />
          </svg>
        </button>
        <p className="Share__header--address">{ensName ?? truncate(address ?? '', 4)}</p>
        <button
          className="Share__header--close"
          onClick={() => {
            modalService.toggleModal()
            localStorage.removeItem('ens-records')
          }}
        >
          ✕
        </button>
      </div>
      <div className="Share__qr">
        <W3mQrCode size={318} imageUrl={ensAvatar ?? '/logo.svg'} uri={uri} />
      </div>
      <div className="Share__address">
        <p className="Share__address--label">Address</p>
        <div className="Share__address__content">
          {truncate(address as `0x${string}`)}
          <button className="Share__address__content--copy" onClick={handleCopyClick}>
            <CopyIcon />
          </button>
        </div>
      </div>
    </m.div>
  )
}

export const Share: React.FC = () => {
  return (
    <Modal onToggleModal={shareModalService.toggleModal}>
      <AnimatePresence mode="wait" initial={false}>
        <ShareModalContent
          key="Share"
          modalService={shareModalService}
          handleBack={shareModalService.toggleModal}
        />
      </AnimatePresence>
    </Modal>
  )
}
