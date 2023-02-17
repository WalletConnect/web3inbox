import React, { useCallback, useContext } from 'react'
import SettingsContext from '../../../../contexts/SettingsContext/context'
import { useColorModeValue, useModals } from '../../../../utils/hooks'
import { preferencesModalService } from '../../../../utils/store'
import Button from '../../../general/Button'
import Divider from '../../../general/Divider'
import CrossIcon from '../../../general/Icon/CrossIcon'
import { Modal } from '../../../general/Modal/Modal'
import Toggle from '../../../general/Toggle'
import './PreferencesModal.scss'

export const PreferencesModal: React.FC = () => {
  const { mode } = useContext(SettingsContext)
  const themeColors = useColorModeValue(mode)
  const { preferencesModalAppId } = useModals()

  const handleUpdatePreferences = useCallback(() => {
    console.log({ handleUpdatePreferencesAppId: preferencesModalAppId })
  }, [preferencesModalAppId])

  return (
    <Modal onToggleModal={preferencesModalService.toggleModal}>
      <div className="PreferencesModal">
        <div className="PreferencesModal__header">
          <h2>Preferences</h2>
          <Button
            className="PreferencesModal__close"
            customType="action-icon"
            onClick={preferencesModalService.closeModal}
          >
            <CrossIcon fillColor={themeColors['--fg-color-1']} />
          </Button>
        </div>
        <Divider />
        <div className="PreferencesModal__content">
          <div className="PreferencesModal__content__setting">
            <div>
              <h4>Auction Notifications</h4>
              <div className="PreferencesModal__content__setting__helper-text">
                Receive notifications when your bids are confirmed, when you have been outbid, and
                when an auction has ended.
              </div>
            </div>
            <Toggle name="auction" id="auction" />
          </div>

          <div className="PreferencesModal__content__setting">
            <div>
              <h4>Buy Now Notifications</h4>
              <div className="PreferencesModal__content__setting__helper-text">
                Receive notifications when someone buys your NFT
              </div>
            </div>
            <Toggle name="buy-now" id="buy-now" />
          </div>

          <div className="PreferencesModal__content__setting">
            <div>
              <h4>Offer Notifications</h4>
              <div className="PreferencesModal__content__setting__helper-text">
                Receive notifications when someone sends you an offer, and when someone accepts your
                offer.
              </div>
            </div>
            <Toggle name="offer" id="offer" />
          </div>
          <div className="PreferencesModal__content__setting">
            <div>
              <h4>For Sale Notifications</h4>
              <div className="PreferencesModal__content__setting__helper-text">
                Receive notifications when profiles that you follow list a new NFT for auction and
                set a Buy Now price
              </div>
            </div>
            <Toggle name="for-sale" id="for-sale" />
          </div>
        </div>
        <Divider />
        <div className="PreferencesModal__action">
          <Button className="PreferencesModal__action__btn" onClick={handleUpdatePreferences}>
            Update
          </Button>
        </div>
      </div>
    </Modal>
  )
}
