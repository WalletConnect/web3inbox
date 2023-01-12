import React from 'react'
import { NavLink as RouterNavLink } from 'react-router-dom'
import './NavLink.scss'

interface BaseNavLinkProps {
  to: string
  children: React.ReactNode | React.ReactNode[]
}

type NavLinkWithImgSrcProps =
  | (BaseNavLinkProps & {
      imgSrc?: never
      svgSrc: string
    })
  | (BaseNavLinkProps & {
      svgSrc?: never
      imgSrc: string
    })

const NavLink: React.FC<NavLinkWithImgSrcProps> = ({ to, svgSrc, children, imgSrc }) => {
  return (
    <RouterNavLink
      to={to}
      className={({ isActive }) => `NavLink ${isActive ? 'NavLink-active' : ''} `}
    >
      <div
        className={`NavLink__icon ${svgSrc ? `NavLink__icon-svg` : ''} ${
          imgSrc ? `NavLink__icon-img` : ''
        }`}
      >
        <img src={imgSrc ?? svgSrc} alt="LinkIcon" />
      </div>
      <div className="NavLink__text">{children}</div>
    </RouterNavLink>
  )
}

export default NavLink
