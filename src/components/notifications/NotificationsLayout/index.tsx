import React, { Fragment } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import AppSelector from '../AppSelector'
import { AnimatePresence } from 'framer-motion'
import { motion } from 'framer-motion'

const NotificationsLayout: React.FC = () => {
  const { pathname } = useLocation()

  if (pathname === '/notifications') {
    return <Navigate to="/notifications/new-app" />
  }

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
