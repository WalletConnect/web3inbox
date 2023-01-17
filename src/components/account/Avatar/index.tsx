import React from 'react'
import { generateAvatarColors } from '../../../utils/ui'
import './Avatar.scss'

interface AvatarProps {
  src?: string | null
  address?: string
  width: number | string
  height: number | string
}

const Avatar: React.FC<AvatarProps> = ({ src, address, width, height }) => {
  return (
    <div
      className="Avatar"
      style={{ width, height, ...(address ? generateAvatarColors(address) : {}) }}
    >
      {src && <img className="Avatar__icon" src={src} alt="Avatar" />}
    </div>
  )
}

export default Avatar
