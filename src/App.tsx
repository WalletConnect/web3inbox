import { Fragment } from 'react'

import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'

import MobileFooter from '@/components/layout/MobileFooter'
import Sidebar from '@/components/layout/Sidebar'
import AuthProtectedPage from '@/components/utils/AuthProtectedPage'
import { useMobileResponsiveGrid } from '@/utils/hooks'

import './App.scss'

const App = () => {
  const location = useLocation()

  const ref = useMobileResponsiveGrid()

  return (
    <AuthProtectedPage>
      <LazyMotion features={domAnimation}>
        <m.div ref={ref} data-path={location.pathname} className="App">
          <Fragment>
            <Sidebar isLoggedIn={true} />
            <Outlet />
            <AnimatePresence mode="wait"></AnimatePresence>
          </Fragment>
        </m.div>
      </LazyMotion>
      <MobileFooter />
    </AuthProtectedPage>
  )
}

export default App
