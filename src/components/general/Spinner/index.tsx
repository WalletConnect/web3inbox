import React from 'react'

import './Spinner.scss'

interface SpinnerProps {}

const Spinner: React.FC<SpinnerProps> = () => {
  return (
    <svg className="Spinner" width="1rem" viewBox="0 0 100 100" fill="none">
      <path
        d="M93 50C93 58.5046 90.4781 66.8182 85.7532 73.8895C81.0283 80.9608 74.3126 86.4723 66.4554 89.7268C58.5982 92.9814 49.9523 93.8329 41.6111 92.1738C33.2699 90.5146 25.6081 86.4192 19.5944 80.4056L28.5995 71.4005C32.8321 75.6332 38.2248 78.5156 44.0956 79.6834C49.9664 80.8512 56.0517 80.2518 61.5819 77.9611C67.1121 75.6705 71.8388 71.7913 75.1644 66.8143C78.4899 61.8373 80.2649 55.9858 80.2649 50L93 50Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default Spinner
