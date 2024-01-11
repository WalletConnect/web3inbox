import React, { Fragment, useContext, useEffect } from 'react'

import { AnimatePresence } from 'framer-motion'
import { motion } from 'framer-motion'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import W3iContext from '@/contexts/W3iContext/context'

import AppSelector from '../AppSelector'

import './NotificationsLayout.scss'

const NotificationsLayout: React.FC = () => {
  const { activeSubscriptions } = useContext(W3iContext)
  const { pathname } = useLocation()
  const nav = useNavigate()

  useEffect(() => {
    if (pathname === '/notifications') {
      if (!activeSubscriptions.length) {
        nav('/notifications/new-app')
      }
    }
  }, [])

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
            <AppSelector />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="Main">
        <Outlet />
      </div>
    </Fragment>
  )
}

export default NotificationsLayout
