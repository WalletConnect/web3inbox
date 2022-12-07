import React from 'react'
import './Avatar.scss'

interface AvatarProps {
  src?: string | null
  width: number | string
  height: number | string
}

const Avatar: React.FC<AvatarProps> = ({ src, width, height }) => {
  return (
    <div className="Avatar" style={{ width, height }}>
      {src && <img className="Avatar__icon" src={src} alt="Avatar" />}
    </div>
  )
}

export default Avatar
