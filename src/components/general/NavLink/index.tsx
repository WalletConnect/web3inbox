import React from 'react'

import cn from 'classnames'
import type { NavLinkProps } from 'react-router-dom'
import { NavLink as RouterNavLink } from 'react-router-dom'

import './NavLink.scss'

interface INavLinkProps extends NavLinkProps {
  to: string
  children: React.ReactNode | React.ReactNode[]
  className?: string
}

const NavLink: React.FC<INavLinkProps> = ({ to, children, className, ...props }) => {
  return (
    <RouterNavLink
      {...props}
      to={to}
      className={({ isActive }) => cn('NavLink', { 'NavLink-active': isActive }, className)}
    >
      {children}
    </RouterNavLink>
  )
}

export default NavLink
