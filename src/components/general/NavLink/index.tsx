import React from 'react'
import { NavLink as RouterNavLink } from 'react-router-dom'
import cn from 'classnames'
import './NavLink.scss'

interface NavLinkProps {
  to: string
  children: React.ReactNode | React.ReactNode[]
  className?: string
}

const NavLink: React.FC<NavLinkProps> = ({ to, children, className }) => {
  return (
    <RouterNavLink
      to={to}
      className={({ isActive }) => cn('NavLink', { 'NavLink-active': isActive }, className)}
    >
      {children}
    </RouterNavLink>
  )
}

export default NavLink
