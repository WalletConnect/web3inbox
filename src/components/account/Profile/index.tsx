import React, { useContext, useState } from 'react'
import { profileModalService, shareModalService } from '../../../utils/store'
import { Modal } from '../../general/Modal/Modal'
import './Profile.scss'
import { useEnsName } from 'wagmi'
import W3iContext from '../../../contexts/W3iContext/context'
import { generateAvatarColors } from '../../../utils/ui'
import CrossIcon from '../../general/Icon/CrossIcon'
import ShareIcon from '../../general/Icon/ShareIcon'
import { truncate } from '../../../utils/string'
import WebsiteIcon from '../../general/Icon/WebsiteIcon'
import TwitterIcon from '../../general/Icon/TwitterIcon'
import GithubIcon from '../../general/Icon/GithubIcon'
import { ShareModalContent } from '../Share/Share'
import { AnimatePresence, m } from 'framer-motion'

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

const ProfileModalContent: React.FC<{
  handleShareClick: () => void
}> = ({ handleShareClick }) => {
  const { userPubkey: address } = useContext(W3iContext)
  const addressOrEnsDomain = address as `0x${string}` | undefined
  const { data: ensName } = useEnsName({ address: addressOrEnsDomain })
  //   Const { data: ensAvatar } = useEnsAvatar({ address: addressOrEnsDomain })

  const userData = {
    website: 'https://boidushya.com',
    twitter: 'https://twitter.com/boidushya',
    github: 'https://github.com/boidushya'
  }

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
      style={{
        position: 'static',
        ...(address ? generateAvatarColors(address) : {})
      }}
    >
      <div className="Profile__TitleBar">
        <div className="Profile__TitleBar__buttons">
          <button onClick={handleShareClick}>
            <ShareIcon />
          </button>
          <button onClick={profileModalService.toggleModal}>
            <CrossIcon />
          </button>
        </div>
        <div className="Profile__TitleBar__background__container">
          <div className="Profile__TitleBar__background" />
        </div>
        <div className="Profile__icon" />
      </div>
      <div className="Profile__Container">
        <div className="Profile__Container__name">{ensName ?? truncate(address ?? '', 4)}</div>
        <div className="Profile__Container__bio">
          Hey i’m a ENS bio. i can include <a href="https://boidushya.com">links to websites</a>,
          and funny characters. i can be long too, witness me!{' '}
        </div>
        <div className="Profile__Container__socials">
          <ProfileLink title="Website" url={userData.website} icon={<WebsiteIcon />} />
          <ProfileLink title="Github" url={userData.github} icon={<GithubIcon />} />
          <ProfileLink title="Twitter" url={userData.twitter} icon={<TwitterIcon />} />
        </div>
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

  /*
   * Once done with the modals, get the height and add this line to Modal component to animate between those heights
   * Code: height={showShareModal ? '444.5px' : '292px'}
   */

  return (
    <Modal onToggleModal={profileModalService.toggleModal}>
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
