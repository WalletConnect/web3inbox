import React from 'react'

const NewMessageIcon: React.FC = () => {
  return (
    <svg fill="none" viewBox="0 0 28 28">
      <g clip-path="url(#a)">
        <path
          stroke="#141414"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.67"
          d="M16.34 3.84c-.76-.16-1.53-.26-2.34-.26-5.78 0-10.5 4.25-10.5 9.55a9.26 9.26 0 0 0 4.2 7.62v3.75l4.12-2.04h0c.7.14 1.43.21 2.18.21 5.78 0 10.5-4.25 10.5-9.54 0-.52-.05-1.02-.14-1.5m-.54-7.45a2.33 2.33 0 1 1-3.3 3.3 2.33 2.33 0 0 1 3.3-3.3Z"
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

export default NewMessageIcon
