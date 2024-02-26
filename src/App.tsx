import { Fragment, useContext } from 'react'

import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'

import MobileFooter from '@/components/layout/MobileFooter'
import Sidebar from '@/components/layout/Sidebar'
import AuthProtectedPage from '@/components/utils/AuthProtectedPage'
import W3iContext from '@/contexts/W3iContext/context'
import { useMobileResponsiveGrid } from '@/utils/hooks'

import './App.scss'

const App = () => {
  const { uiEnabled } = useContext(W3iContext)
  const location = useLocation()

  const ref = useMobileResponsiveGrid()

  return (
    <AuthProtectedPage>
      <LazyMotion features={domAnimation}>
        <m.div ref={ref} data-path={location.pathname} className="App">
          <Fragment>
            {uiEnabled.sidebar ? <Sidebar isLoggedIn={true} /> : null}
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
