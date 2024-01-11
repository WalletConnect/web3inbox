import React from 'react'

import type { NavLinkProps } from 'react-router-dom'
import { NavLink as RouterNavLink } from 'react-router-dom'

import './TargetTitle.scss'

interface ITargetTitle extends NavLinkProps {
  to: string
  children: React.ReactNode | React.ReactNode[]
  className: string
}

const TargetTitle: React.FC<ITargetTitle> = ({ to, children, className }) => {
  return (
    <RouterNavLink className={`TargetTitle ${className}`} to={to}>
      {children}
    </RouterNavLink>
  )
}

export default TargetTitle
