import React, { Fragment } from 'react'
import { Outlet } from 'react-router-dom'
import AppSelector from '../AppSelector'
import { AnimatePresence } from 'framer-motion'
import { motion } from 'framer-motion'

const NotificationsLayout: React.FC = () => {
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
        <AnimatePresence>
          <motion.div
            style={{ height: '100%' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.33 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>
    </Fragment>
  )
}

export default NotificationsLayout
