import React, { useContext, useEffect, useState } from 'react'
import { profileModalService } from '../../../utils/store'
import { Modal } from '../../general/Modal/Modal'
import './Profile.scss'
import { useEnsName, usePublicClient } from 'wagmi'
import W3iContext from '../../../contexts/W3iContext/context'
import { generateAvatarColors } from '../../../utils/ui'
import Avatar from '../../account/Avatar'
import CrossIcon from '../../general/Icon/CrossIcon'
import ShareIcon from '../../general/Icon/ShareIcon'
import { truncate } from '../../../utils/string'
import WebsiteIcon from '../../general/Icon/WebsiteIcon'
import TwitterIcon from '../../general/Icon/TwitterIcon'
import GithubIcon from '../../general/Icon/GithubIcon'
import { ShareModalContent } from '../Share/Share'
import { AnimatePresence, m } from 'framer-motion'
import Spinner from '../../general/Spinner'
import EmailIcon from '../../general/Icon/EmailIcon'
import type { EnsRecords } from '../../../utils/ens'
import { getEnsData } from '../../../utils/ens'
import Text from '../../general/Text'

const ProfileLink = ({
  title,
  url,
  icon
}: {
  title: string
  url: string
  icon: React.ReactNode
}) => {
  return (
    <a href={url} target="_blank" className="Profile__Container__socials--item">
      {icon}
      <span>{title}</span>
    </a>
  )
}

declare const localStorage: Storage | undefined

const ProfileModalContent: React.FC<{
  handleShareClick: () => void
}> = ({ handleShareClick }) => {
  const { userPubkey: address } = useContext(W3iContext)
  const [resolvedRecords, setResolvedRecords] = useState<EnsRecords | undefined>(undefined)
  const publicClient = usePublicClient()
  const addressOrEnsDomain = address as `0x${string}` | undefined
  const { data: ensName } = useEnsName({ address: addressOrEnsDomain })

  useEffect(() => {
    if (ensName) {
      getEnsData(ensName, publicClient).then(setResolvedRecords)
    }
  }, [ensName, publicClient])

  return (
    <m.div
      initial={{
        opacity: 0,
        x: '-100%'
      }}
      animate={{
        opacity: 1.01,
        x: '0%'
      }}
      exit={{
        opacity: 0,
        x: '-100%',
        transition: { duration: 0.1 }
      }}
      transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
      className="Profile"
    >
      <div className="Profile__TitleBar">
        <div className="Profile__TitleBar__buttons">
          <button onClick={handleShareClick}>
            <ShareIcon />
          </button>
          <button
            onClick={() => {
              profileModalService.toggleModal()
              localStorage?.removeItem('ens-records')
            }}
          >
            <CrossIcon />
          </button>
        </div>
        <div className="Profile__TitleBar__background__container">
          <div
            className="Profile__TitleBar__background"
            style={{
              position: 'static',
              ...(address ? generateAvatarColors(address) : {})
            }}
          />
        </div>
        <div className="Profile__icon">
          <Avatar address={address} width="4em" height="4em" />
        </div>
      </div>
      <div className="Profile__Container">
        <Text variant="large-500">{ensName ?? truncate(address ?? '', 4)}</Text>

        <AnimatePresence mode="wait">
          {!ensName && (
            <div className="Profile__Container__bio Profile__Container__bio--default">
              <Text variant="small-500">
                Give your profile a personality upgrade with your unique ENS name, bio, and more
              </Text>

              <a href="https://app.ens.domains?utm_source=web3inbox_profile&utm_medium=web&utm_campaign=web3inbox">
                <Text variant="small-500">app.ens.domains</Text>
              </a>
            </div>
          )}
          {ensName &&
            (resolvedRecords ? (
              <m.div
                initial={{
                  y: -5,
                  opacity: 0,
                  transformOrigin: 'top'
                }}
                animate={{
                  y: 0,
                  opacity: 1
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                key="Bio"
              >
                <div className="Profile__Container__bio">
                  {/* Hey i’m a ENS bio. i can include <a href="https://boidushya.com">links to websites</a>,
          and funny characters. i can be long too, witness me!{' '} */}
                  {resolvedRecords.description}
                </div>
                <div className="Profile__Container__socials">
                  {resolvedRecords.url && (
                    <ProfileLink
                      title="Website"
                      url={`https://${resolvedRecords.url}`}
                      icon={<WebsiteIcon />}
                    />
                  )}
                  {resolvedRecords.twitter && (
                    <ProfileLink
                      title="Twitter"
                      url={`https://twitter.com/${resolvedRecords.twitter}`}
                      icon={<TwitterIcon />}
                    />
                  )}
                  {resolvedRecords.email && (
                    <ProfileLink
                      title="Email"
                      url={`mailto:${resolvedRecords.email}`}
                      icon={<EmailIcon />}
                    />
                  )}
                  {resolvedRecords.github && (
                    <ProfileLink
                      title="Github"
                      url={`https://github.com/${resolvedRecords.github}`}
                      icon={<GithubIcon />}
                    />
                  )}
                </div>
              </m.div>
            ) : (
              <m.div
                initial={{
                  y: 5,
                  opacity: 0
                }}
                animate={{
                  y: 0,
                  opacity: 1
                }}
                exit={{
                  opacity: 0
                }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                key="Spinner"
                className="Profile__Container__spinner"
              >
                <span>Fetching ENS Information</span>
                <Spinner width="12px" />
              </m.div>
            ))}
        </AnimatePresence>
      </div>
    </m.div>
  )
}

export const Profile: React.FC = () => {
  const [showShareModal, setShowShareModal] = useState<boolean>(false)
  const handleShareClick = () => {
    setShowShareModal(true)
  }

  const handleShareModalBack = () => {
    setShowShareModal(false)
  }

  return (
    <Modal
      onToggleModal={() => {
        profileModalService.toggleModal()
        localStorage?.removeItem('ens-records')
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {showShareModal ? (
          <ShareModalContent
            key="Share"
            modalService={profileModalService}
            handleBack={handleShareModalBack}
          />
        ) : (
          <ProfileModalContent key="Profile" handleShareClick={handleShareClick} />
        )}
      </AnimatePresence>
    </Modal>
  )
}
