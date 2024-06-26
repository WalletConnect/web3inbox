import React from 'react'

const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = props => {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      className={props.className}
    >
      <path
        d="M6 0C5.58579 0 5.25 0.335786 5.25 0.75V4.75C5.25 5.02614 5.02614 5.25 4.75 5.25H0.75C0.335786 5.25 0 5.58579 0 6C0 6.41421 0.335786 6.75 0.75 6.75H4.75C5.02614 6.75 5.25 6.97386 5.25 7.25V11.25C5.25 11.6642 5.58579 12 6 12C6.41421 12 6.75 11.6642 6.75 11.25V7.25C6.75 6.97386 6.97386 6.75 7.25 6.75H11.25C11.6642 6.75 12 6.41421 12 6C12 5.58579 11.6642 5.25 11.25 5.25H7.25C6.97386 5.25 6.75 5.02614 6.75 4.75V0.75C6.75 0.335786 6.41421 0 6 0Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default PlusIcon
