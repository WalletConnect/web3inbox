import React from 'react'

const MessageCheckmarkIcon: React.FC = () => {
  return (
    <svg fill="none" viewBox="0 0 28 28">
      <g
        stroke="#141414"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.67"
        clip-path="url(#a)"
      >
        <path d="m18.96 12.6-3.74 3.73M15.57 11.67l-4.66 4.66-1.87-1.86" />
        <path d="M5.4 20.02a10.52 10.52 0 1 1 2.58 2.58l-3.31.73.73-3.31Z" />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h28v28H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default MessageCheckmarkIcon
