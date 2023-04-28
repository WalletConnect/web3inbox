import React, { useContext, useEffect, useState } from 'react'
import type { MetadataArgs } from '../../../utils/store'
// eslint-disable-next-line no-duplicate-imports
import { subscribeModalService } from '../../../utils/store'
import { Modal } from '../../general/Modal/Modal'
import './Subscribe.scss'
import W3iContext from '../../../contexts/W3iContext/context'
import { AnimatePresence, m } from 'framer-motion'
import Button from '../../general/Button'
import Spinner from '../../general/Spinner'
import MoneyWithWings from '../../../assets/MoneyWithWings.png'
import FramedPicture from '../../../assets/FramedPicture.png'
import Eyes from '../../../assets/Eyes.png'
import Heart from '../../../assets/Heart.png'
import Coin from '../../../assets/Coin.png'
import W3iIcon from '../../../assets/web3inbox.png'
import { useModals } from '../../../utils/hooks'

interface ModalContentProps {
  modalService: typeof subscribeModalService
  handleBack?: () => void
}

export const SubscribeModalContent: React.FC<ModalContentProps> = ({ modalService }) => {
  const [allowing, setAllowing] = useState(false)
  const [declining, setDeclining] = useState(false)
  const { subscribeModalMetadata } = useModals()
  const [appDetails, setAppDetails] = useState<MetadataArgs>()

  useEffect(() => {
    if (!subscribeModalMetadata) {
      return
    }
    setAppDetails(subscribeModalMetadata)
  }, [subscribeModalMetadata])

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { userPubkey: address, pushClientProxy } = useContext(W3iContext)

  const onAllow = () => {
    setAllowing(true)
    if (!appDetails) {
      setTimeout(() => {
        setAllowing(false)
      }, 1000)

      return
    }
    pushClientProxy
      ?.approve({ id: appDetails.id })
      .then(() => {
        console.log(`Allowed push_request for ${appDetails.name} with id ${appDetails.id}`)
      })
      .catch(err => {
        console.error(err)
      })
      .finally(() => {
        setTimeout(() => {
          setAllowing(false)
        }, 1000)
      })
  }

  const onDecline = () => {
    setDeclining(true)
    if (!appDetails) {
      setTimeout(() => {
        setDeclining(false)
      }, 1000)

      return
    }
    pushClientProxy
      ?.reject({ id: appDetails.id, reason: 'Rejected by user from modal' })
      .then(() => {
        console.log(`Rejected push_request for ${appDetails.name} with id ${appDetails.id}`)
      })
      .catch(err => {
        console.error(err)
      })
      .finally(() => {
        setTimeout(() => {
          setDeclining(false)
        }, 1000)
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
      className="Subscribe"
    >
      <div className="Subscribe__header">
        <div className="Subscribe__header--back"></div>
        <p className="Subscribe__header--title">Subscribe</p>
        <button
          className="Subscribe__header--close"
          onClick={() => {
            modalService.closeModal()
            localStorage.removeItem('ens-records')
          }}
        >
          ✕
        </button>
      </div>
      <div className="Subscribe__illustration">
        <AnimatePresence>
          <m.div
            key="Current"
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: '0%' }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0.2 }}
            className="Subscribe__illustration__current"
          >
            {appDetails ? (
              <img src={appDetails.icons[0]} alt="Foundation" />
            ) : (
              <div className="Subscribe__Shimmer Subscribe__Shimmer--logo" />
            )}
          </m.div>
        </AnimatePresence>
        <div className="Subscribe__illustration__mask">
          <AnimatePresence>
            <m.div
              key="Money"
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: '0%' }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.05 }}
              className="Subscribe__illustration__mask__icon Subscribe__illustration__mask__icon--money"
            >
              <img src={MoneyWithWings} alt="Money with wings" />
            </m.div>
            <m.div
              key="Frame"
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: '0%' }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.1 }}
              className="Subscribe__illustration__mask__icon Subscribe__illustration__mask__icon--frame"
            >
              <img src={FramedPicture} alt="Framed Picture" />
            </m.div>
            <m.div
              key="Eyes"
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: '-33.33%' }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.15 }}
              className="Subscribe__illustration__mask__icon Subscribe__illustration__mask__icon--eyes"
            >
              <img src={Eyes} alt="Eyes" />
            </m.div>
            <m.div
              key="Heart"
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: '-66.66%' }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.2 }}
              className="Subscribe__illustration__mask__icon Subscribe__illustration__mask__icon--heart"
            >
              <img src={Heart} alt="Heart" />
            </m.div>
            <m.div
              key="Coin"
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: '-175%' }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.25 }}
              className="Subscribe__illustration__mask__icon Subscribe__illustration__mask__icon--coin"
            >
              <img src={Coin} alt="Coin" />
            </m.div>
          </AnimatePresence>
        </div>
        <AnimatePresence>
          <m.div
            key="W3i"
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: '0%' }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.1 }}
            className="Subscribe__illustration__w3i"
          >
            <img src={W3iIcon} alt="W3i" />
          </m.div>
        </AnimatePresence>
      </div>
      <AnimatePresence>
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.1, duration: 0.2 }}
          className="Subscribe__container"
        >
          {appDetails ? (
            <div className="Subscribe__container--title">Subscribe to {appDetails.name}</div>
          ) : (
            <span className="Subscribe__Shimmer Subscribe__Shimmer--heading" />
          )}

          <div className="Subscribe__container--description">
            <p>
              You will start receiving notifications from{' '}
              {appDetails ? (
                <span>{appDetails.name}</span>
              ) : (
                <span className="Subscribe__Shimmer Subscribe__Shimmer--text" />
              )}
              on Web3Inbox.
            </p>
            <p>You can un-subscribe later.</p>
          </div>
        </m.div>
      </AnimatePresence>
      <div className="Subscribe__content">
        <Button className="Subscribe__content--decline" onClick={onDecline}>
          <AnimatePresence mode="wait">
            {declining ? (
              <m.div
                key="SpinnerDecline"
                initial={{ opacity: 0, y: '0.25em' }}
                animate={{ opacity: 1, y: '0em' }}
                exit={{ opacity: 0, y: '0.25em' }}
              >
                <Spinner width="1.25em" />
              </m.div>
            ) : (
              <m.p
                initial={{ opacity: 0, y: '0.25em' }}
                animate={{ opacity: 1, y: '0em' }}
                exit={{ opacity: 0, y: '0.25em' }}
                key="Decline"
              >
                Decline
              </m.p>
            )}
          </AnimatePresence>
        </Button>
        <Button className="Subscribe__content--allow" onClick={onAllow}>
          <AnimatePresence mode="wait">
            {allowing ? (
              <m.div
                key="SpinnerAllow"
                initial={{ opacity: 0, y: '0.25em' }}
                animate={{ opacity: 1, y: '0em' }}
                exit={{ opacity: 0, y: '0.25em' }}
              >
                <Spinner width="1.25em" />
              </m.div>
            ) : (
              <m.p
                initial={{ opacity: 0, y: '0.25em' }}
                animate={{ opacity: 1, y: '0em' }}
                exit={{ opacity: 0, y: '0.25em' }}
                key="Allow"
              >
                Allow
              </m.p>
            )}
          </AnimatePresence>
        </Button>
      </div>
    </m.div>
  )
}

const Subscribe: React.FC = () => {
  return (
    <Modal onToggleModal={subscribeModalService.closeModal}>
      <AnimatePresence mode="wait" initial={false}>
        <SubscribeModalContent
          key="Subscribe"
          modalService={subscribeModalService}
          handleBack={subscribeModalService.closeModal}
        />
      </AnimatePresence>
    </Modal>
  )
}

export default Subscribe
