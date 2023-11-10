import React from 'react'

const AppearanceIcon: React.FC = () => {
  return (
    <svg fill="none" viewBox="0 0 20 20">
      <g
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.67"
        clipPath="url(#a)"
      >
        <path d="M1.67 10c0 4.6 3.73 8.33 8.33 8.33a2.5 2.5 0 0 0 2.5-2.5v-.41c0-.39 0-.58.02-.75a2.5 2.5 0 0 1 2.15-2.15c.17-.02.36-.02.75-.02h.41a2.5 2.5 0 0 0 2.5-2.5 8.33 8.33 0 0 0-16.66 0Z" />
        <path d="M5.83 10.83a.83.83 0 1 0 0-1.66.83.83 0 0 0 0 1.66ZM13.33 7.5a.83.83 0 1 0 0-1.67.83.83 0 0 0 0 1.67ZM8.33 6.67a.83.83 0 1 0 0-1.67.83.83 0 0 0 0 1.67Z" />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h20v20H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default AppearanceIcon
