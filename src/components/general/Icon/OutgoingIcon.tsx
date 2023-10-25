import React from 'react'

const OutgoingIcon: React.FC = () => {
  return (
    <svg fill="none" viewBox="0 0 28 28">
      <g clip-path="url(#a)">
        <path
          stroke="#141414"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.67"
          d="M8.17 23.33a5.19 5.19 0 0 1 5.19-5.18h5.95a5.19 5.19 0 0 1 5.2 5.18M8.16 14H2.34m0 0 2.33-2.33M2.34 14l2.33 2.33m16.62-6.7a4.96 4.96 0 1 1-9.91 0 4.96 4.96 0 0 1 9.91 0Z"
        />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h28v28H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default OutgoingIcon
