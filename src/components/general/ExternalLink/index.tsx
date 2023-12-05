import React from 'react'

import Text from '../Text'

import './ExternalLink.scss'

type HTMLAnchorProps = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>
type TAnchorProps = HTMLAnchorProps & {
  link: string
}

const ExternalLink: React.FC<TAnchorProps> = ({ children, link, ...props }) => {
  return (
    <a {...props} target="_blank" rel="noopener noreferrer" className="Anchor" href={link}>
      <Text variant="small-600">{children}</Text>
      <svg fill="none" viewBox="0 0 13 12">
        <path
          fill="#3396FF"
          d="M4 3a.5.5 0 0 0 0 1h3.8L3.64 8.15a.5.5 0 0 0 .7.7L8.5 4.71V8.5a.5.5 0 0 0 1 0v-5A.5.5 0 0 0 9 3H4Z"
        />
      </svg>
    </a>
  )
}

export default ExternalLink
