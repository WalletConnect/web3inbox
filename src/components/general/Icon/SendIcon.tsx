import React from 'react'

interface ISendIconProps {
  fillColor?: string
}

const SendIcon: React.FC<ISendIconProps> = () => {
  return (
    <svg fill="none" width="16" height="16" viewBox="0 0 15 16">
      <path
        fill="#9EA9A9"
        d="M14.42 7.03a1.1 1.1 0 0 1 0 1.94L2 15.66a.75.75 0 0 1-1.08-.87l1.17-4.08a2 2 0 0 1 1.67-1.43l5.74-.72a.57.57 0 0 0 0-1.12l-5.74-.72A2 2 0 0 1 2.1 5.29L.92 1.2A.75.75 0 0 1 2 .34l12.42 6.69Z"
      />
    </svg>
  )
}

export default SendIcon
