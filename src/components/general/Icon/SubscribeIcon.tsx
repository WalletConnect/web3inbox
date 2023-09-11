import React from 'react'

interface ISubscribeIconProps {
  fillColor?: string
}

const SubscribeIcon: React.FC<ISubscribeIconProps> = () => {
  return (
    <svg fill="none" width="20" height="20" viewBox="0 0 20 20">
      <path
        fill="#8B9797"
        fillRule="evenodd"
        d="M8 1a2 2 0 0 0-2 2h8a2 2 0 0 0-2-2H8ZM3 6c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2H3Zm-.5 1C1.67 7 1 7.67 1 8.5v9c0 .83.67 1.5 1.5 1.5h15c.83 0 1.5-.67 1.5-1.5v-9c0-.83-.67-1.5-1.5-1.5h-15Zm6.77 2.73v2.54H6.73a.73.73 0 1 0 0 1.46h2.54v2.54a.73.73 0 0 0 1.46 0v-2.54h2.54a.73.73 0 0 0 0-1.46h-2.54V9.73a.73.73 0 1 0-1.46 0Z"
        clipRule="evenodd"
      />
    </svg>
  )
}

export default SubscribeIcon
