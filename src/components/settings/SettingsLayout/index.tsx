import React, { Fragment, useEffect } from 'react'

import { AnimatePresence } from 'framer-motion'
import { motion } from 'framer-motion'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import { isMobile } from '@/utils/ui'

import SettingsSelector from '../SettingsSelector'

const SettingsLayout: React.FC = () => {
  const { pathname } = useLocation()
  const nav = useNavigate()

  useEffect(() => {
    if (pathname === '/settings' && !isMobile()) {
      nav('/settings/notification')
    }
  }, [pathname])

  return (
    <Fragment>
      <div className="TargetSelector">
        <AnimatePresence>
          <motion.div
            style={{ height: '100%' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.33 }}
          >
            <SettingsSelector />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="Main">
        <Outlet />
      </div>
    </Fragment>
  )
}

export default SettingsLayout
