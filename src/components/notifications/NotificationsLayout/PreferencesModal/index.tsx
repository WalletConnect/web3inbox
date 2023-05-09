import type { PushClientTypes } from '@walletconnect/push-client'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import SettingsContext from '../../../../contexts/SettingsContext/context'
import W3iContext from '../../../../contexts/W3iContext/context'
import { useColorModeValue, useModals } from '../../../../utils/hooks'
import { preferencesModalService } from '../../../../utils/store'
import Button from '../../../general/Button'
import Divider from '../../../general/Divider'
import CrossIcon from '../../../general/Icon/CrossIcon'
import { Modal } from '../../../general/Modal/Modal'
import Toggle from '../../../general/Toggle'
import './PreferencesModal.scss'

export const PreferencesModal: React.FC = () => {
  const { activeSubscriptions, pushClientProxy } = useContext(W3iContext)
  const { mode } = useContext(SettingsContext)
  const themeColors = useColorModeValue(mode)
  const { preferencesModalAppId } = useModals()
  const [scopes, setScopes] = useState<PushClientTypes.PushSubscription['scope']>({})

  // Reduces the scopes mapping to only an array of enabled scopes
  const getEnabledScopes = (scopesMap: PushClientTypes.PushSubscription['scope']) => {
    const enabledScopeKeys: string[] = []
    Object.entries(scopesMap).forEach(([key, scope]) => {
      if (scope.enabled) {
        enabledScopeKeys.push(key)
      }
    })

    return enabledScopeKeys
  }

  useEffect(() => {
    const app = activeSubscriptions.find(sub => sub.topic === preferencesModalAppId)
    if (!app) {
      return
    }

    setScopes(app.scope)
  }, [preferencesModalAppId, setScopes, activeSubscriptions])

  const handleUpdatePreferences = useCallback(() => {
    preferencesModalService.closeModal()
    if (preferencesModalAppId) {
      const topic = preferencesModalAppId
      pushClientProxy?.update({
        topic,
        scope: getEnabledScopes(scopes)
      })
    }
  }, [preferencesModalAppId, pushClientProxy, scopes])

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
        {Object.entries(scopes).map(([title, scope]) => (
          <div key={title} className="PreferencesModal__content">
            <div className="PreferencesModal__content__setting">
              <div>
                <h4 style={{ textTransform: 'capitalize' }}>{title} Notifications</h4>
                <div className="PreferencesModal__content__setting__helper-text">
                  {scope.description}
                </div>
              </div>
              <Toggle
                checked={scope.enabled}
                setChecked={enabled => {
                  setScopes(oldScopes => {
                    return {
                      ...oldScopes,
                      [title]: {
                        ...oldScopes[title],
                        enabled
                      }
                    }
                  })
                }}
                name={title}
                id={title}
              />
            </div>
          </div>
        ))}
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
