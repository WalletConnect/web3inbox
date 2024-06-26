import React from 'react'

interface IIconProps {
  fillColor?: string
  className?: string
}

const ExternalLinkIcon: React.FC<IIconProps> = props => {
  return (
    <svg
      className={props.className}
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="currentcolor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <path d="M1.99989 1.75C1.99989 1.33579 2.33567 1 2.74989 1H9.49989C10.3283 1 10.9999 1.67157 10.9999 2.5V9.25C10.9999 9.66421 10.6641 10 10.2499 10C9.83567 10 9.49989 9.66421 9.49989 9.25V4.16433C9.49989 3.9416 9.2306 3.83006 9.07311 3.98755L1.5606 11.5001C1.26771 11.7929 0.792837 11.7929 0.499944 11.5001C0.207051 11.2072 0.20705 10.7323 0.499943 10.4394L8.01256 2.92678C8.17005 2.76929 8.05851 2.5 7.83579 2.5H2.74989C2.33567 2.5 1.99989 2.16421 1.99989 1.75Z" />
      </g>
    </svg>
  )
}

export default ExternalLinkIcon
