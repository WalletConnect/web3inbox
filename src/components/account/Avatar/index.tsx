import React from 'react'

import { generateAvatarColors } from '@/utils/ui'
import './Avatar.scss'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useEnsAvatar, useEnsName } from 'wagmi'

interface AvatarProps {
  address?: string
  width: number | string
  height: number | string
}

const Avatar: React.FC<AvatarProps> = ({ address, width, height }) => {
  const modal = useWeb3Modal()

  const addressOrEnsDomain = address as `0x${string}` | undefined
  const { data: ensName } = useEnsName({ address: addressOrEnsDomain })
  const { data: ensAvatar } = useEnsAvatar({ name: ensName })

  return (
    <div
      className="Avatar"
      style={{
        width,
        height,
        cursor: 'pointer'
      }}
      onClick={() => {
        modal.open()
      }}
    >
      <div
        className="Avatar__container"
        style={{
          width,
          height,
          ...(address ? generateAvatarColors(address) : {})
        }}
      >
        {ensAvatar && <img className="Avatar__icon" src={ensAvatar} alt="Avatar" />}
      </div>
    </div>
  )
}

export default Avatar
