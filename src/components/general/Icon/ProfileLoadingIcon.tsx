import React from 'react'

const ProfileLoadingIcon: React.FC = () => {
  return (
    <svg fill="none" viewBox="0 0 28 28">
      <g
        stroke="#141414"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.67"
        clip-path="url(#a)"
      >
        <path d="M13.92 3.5a10.5 10.5 0 1 1 0 21M10.33 23.86a10.5 10.5 0 0 1-3.16-1.82M7.17 5.96c.94-.79 2-1.4 3.16-1.82M3.58 12.18c.21-1.2.64-2.37 1.25-3.43M3.58 15.82c.21 1.2.64 2.37 1.25 3.43" />
        <path d="M18.67 18.67a2.45 2.45 0 0 0-2.3-1.56h-4.75a2.46 2.46 0 0 0-2.29 1.56M14 14.58a2.62 2.62 0 1 0 0-5.25 2.62 2.62 0 0 0 0 5.25Z" />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h28v28H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default ProfileLoadingIcon
