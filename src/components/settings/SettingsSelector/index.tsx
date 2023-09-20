import Text from '../../general/Text'
import './SettingsSelector.scss'
import AppearanceIcon from '../../general/Icon/Appearance'
import NotificationIcon from '../../general/Icon/Notification'
import PrivacyIcon from '../../general/Icon/Privacy'
import NavLink from '../../general/NavLink'
import { useIsMobile } from '../../../utils/hooks'
import { useLocation } from 'react-router-dom'
import MobileHeader from '../../layout/MobileHeader'
import ChevronRightIcon from '../../general/Icon/ChevronRightIcon'

const SettingsSelector: React.FC = () => {
  const isMobile = useIsMobile()
  const { pathname } = useLocation()

  return (
    <div className="SettingsSelector">
      {isMobile && pathname.endsWith('/settings') && <MobileHeader title="Settings" />}
      <div className="SettingsSelector__wrapper">
        <Text className="SettingsSelector__title" variant="large-700">
          Settings
        </Text>
        {isMobile ? (
          <>
            {pathname.endsWith('/settings') && (
              <ul className="SettingsSelector__list">
                <NavLink to={`/settings/appearance`} end className="SettingsSelector__link">
                  <div className="SettingsSelector__link__wrapper">
                    <AppearanceIcon />
                    <div className="SettingsSelector__link__icon__wrapper">
                      <div className="SettingsSelector__link__title__wrapper">
                        <Text className="SettingsSelector__link__title" variant="small-500">
                          Appearance
                        </Text>
                        <Text className="SettingsSelector__link__description" variant="small-500">
                          Change how you want Web3Inbox to look, select your preferred currency and
                          interface language.
                        </Text>
                      </div>
                      <ChevronRightIcon />
                    </div>
                  </div>
                </NavLink>
                <NavLink to={`/settings/notification`} end className="SettingsSelector__link">
                  <div className="SettingsSelector__link__wrapper">
                    <NotificationIcon />
                    <div className="SettingsSelector__link__icon__wrapper">
                      <div className="SettingsSelector__link__title__wrapper">
                        <Text className="SettingsSelector__link__title" variant="small-500">
                          Notifications
                        </Text>
                        <Text className="SettingsSelector__link__description" variant="small-500">
                          Select about which events you want to be notified.
                        </Text>
                      </div>
                      <ChevronRightIcon />
                    </div>
                  </div>
                </NavLink>
                {/* <NavLink to={`/settings/privacy`} end className="SettingsSelector__link">
                  <div className="SettingsSelector__link__wrapper">
                    <PrivacyIcon />
                    <div className="SettingsSelector__link__icon__wrapper">
                      <div className="SettingsSelector__link__title__wrapper">
                        <Text className="SettingsSelector__link__title" variant="small-500">
                          Privacy
                        </Text>
                        <Text className="SettingsSelector__link__description" variant="small-500">
                          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
                          eirmod tempor invidunt.
                        </Text>
                      </div>
                      <ChevronRightIcon />
                    </div>
                  </div>
                </NavLink> */}
              </ul>
            )}
          </>
        ) : (
          <>
            <ul className="SettingsSelector__list">
              <NavLink to={`/settings/appearance`} end className="SettingsSelector__link">
                <div className="SettingsSelector__link__wrapper">
                  <AppearanceIcon />
                  <Text className="SettingsSelector__link__title" variant="small-500">
                    Appearance
                  </Text>
                </div>
              </NavLink>
              <NavLink to="/settings/notification" end className="SettingsSelector__link">
                <div className="SettingsSelector__link__wrapper">
                  <NotificationIcon />
                  <Text className="SettingsSelector__link__title" variant="small-500">
                    Notifications
                  </Text>
                </div>
              </NavLink>
              {/* <NavLink to={`/settings/privacy`} end className="SettingsSelector__link">
                <div className="SettingsSelector__link__wrapper">
                  <PrivacyIcon />
                  <Text className="SettingsSelector__link__title" variant="small-500">
                    Privacy
                  </Text>
                </div>
              </NavLink> */}
            </ul>
          </>
        )}
      </div>
    </div>
  )
}

export default SettingsSelector
