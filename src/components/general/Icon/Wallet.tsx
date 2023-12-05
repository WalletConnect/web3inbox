import React from 'react'

import cn from 'classnames'

const Wallet = ({ className }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg className={cn(className)} viewBox="0 0 14 14">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M0 3.85a2.27 2.27 0 0 1 2.27-2.28h7.88a2.28 2.28 0 0 1 2.28 2.28v.2c.9.3 1.57 1.15 1.57 2.16V7.8c0 1.01-.66 1.87-1.57 2.16v.2a2.28 2.28 0 0 1-2.28 2.28H2.27A2.28 2.28 0 0 1 0 10.15v-6.3Zm11.03 6.21H9.36a3.06 3.06 0 0 1 0-6.12h1.67v-.09c0-.48-.4-.88-.88-.88H2.27c-.48 0-.87.4-.87.88v6.3c0 .48.4.88.88.88h7.87c.48 0 .88-.4.88-.88v-.09ZM9.36 5.34a1.66 1.66 0 0 0 0 3.32h2.37c.48 0 .87-.39.87-.87V6.2c0-.48-.4-.87-.88-.87H9.37Z"
        clipRule="evenodd"
      />
    </svg>
  )
}

export default Wallet
