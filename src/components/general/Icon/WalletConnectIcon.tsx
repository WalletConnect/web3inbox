import React from 'react'

const WalletConnectIcon: React.FC = () => {
  return (
    <svg className="wc-icon" fill="none" viewBox="0 0 40 28">
      <path
        fill="url(#a)"
        d="M10.55 7.83a13.57 13.57 0 0 1 18.9 0l.63.62c.26.25.26.67 0 .92l-2.15 2.1a.34.34 0 0 1-.47 0l-.87-.84a9.46 9.46 0 0 0-13.18 0l-.93.9a.34.34 0 0 1-.47 0l-2.15-2.1a.64.64 0 0 1 0-.92l.7-.68Zm23.34 4.35 1.91 1.87c.27.26.27.67 0 .93l-8.62 8.44a.68.68 0 0 1-.94 0l-6.12-5.99a.17.17 0 0 0-.24 0l-6.12 6a.68.68 0 0 1-.94 0L4.2 14.97a.64.64 0 0 1 0-.93l1.9-1.87a.68.68 0 0 1 .95 0l6.12 6c.07.06.17.06.24 0l6.12-6a.68.68 0 0 1 .94 0l6.12 6c.07.06.17.06.24 0l6.12-6a.68.68 0 0 1 .94 0Z"
      />
      <defs>
        <linearGradient id="a" x1="33.5" x2="7" y1="32.5" y2="2" gradientUnits="userSpaceOnUse">
          <stop stopColor="#BFD9FF" />
          <stop offset="1" stopColor="#0D7DF2" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default WalletConnectIcon
