import React, { useCallback, useContext, useEffect, useState } from 'react'

import type { NotifyClientTypes } from '@walletconnect/notify-client'

import Button from '@/components/general/Button'
import CrossIcon from '@/components/general/Icon/CrossIcon'
import { Modal } from '@/components/general/Modal/Modal'
import Spinner from '@/components/general/Spinner'
import Text from '@/components/general/Text'
import Toggle from '@/components/general/Toggle'
import SettingsContext from '@/contexts/SettingsContext/context'
import W3iContext from '@/contexts/W3iContext/context'
import { useColorModeValue, useModals } from '@/utils/hooks'
import { preferencesModalService } from '@/utils/store'
import { showErrorMessageToast, showSuccessMessageToast } from '@/utils/toasts'

import './PreferencesModal.scss'

export const PreferencesModal: React.FC = () => {
  const { activeSubscriptions, notifyClientProxy } = useContext(W3iContext)
  const { preferencesModalAppId } = useModals()
  const [scopes, setScopes] = useState<NotifyClientTypes.NotifySubscription['scope']>({})
  const [loading, setLoading] = useState(false)

  // Reduces the scopes mapping to only an array of enabled scopes
  const getEnabledScopes = (scopesMap: NotifyClientTypes.NotifySubscription['scope']) => {
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

  const handleUpdatePreferences = useCallback(async () => {
    setLoading(true)
    if (preferencesModalAppId) {
      const topic = preferencesModalAppId

      try {
        notifyClientProxy?.observeOne('notify_update', {
          next: () => {
            preferencesModalService.closeModal()
            setLoading(false)
            showSuccessMessageToast('Preferences updated successfully')
          }
        })
        await notifyClientProxy?.update({
          topic,
          scope: getEnabledScopes(scopes)
        })
      } catch (error) {
        console.error(error)
        showErrorMessageToast('Failed to update preferences')
        setLoading(false)
      }
    }
  }, [preferencesModalAppId, notifyClientProxy, scopes])

  return (
    <Modal onCloseModal={preferencesModalService.closeModal}>
      <div className="PreferencesModal">
        <div className="PreferencesModal__header">
          <Text variant="paragraph-600">Preferences</Text>
          <button className="PreferencesModal__close" onClick={preferencesModalService.closeModal}>
            <CrossIcon />
          </button>
        </div>
        <div className="PreferencesModal__content">
          {Object.entries(scopes)
            .sort(([a], [b]) => a.charCodeAt(0) - b.charCodeAt(0))
            .map(([scopeId, scope]) => (
              <div key={scope.name} className="PreferencesModal__content__item">
                <div className="PreferencesModal__content__item__wrapper">
                  <h4 style={{ textTransform: 'capitalize' }}>
                    <Text variant="paragraph-600">{scope.name} Notifications</Text>
                  </h4>
                  <div className="PreferencesModal__content__setting__helper-text">
                    <Text className="PreferencesModal__content__item__subtitle" variant="small-500">
                      {scope.description}
                    </Text>
                  </div>
                </div>
                <Toggle
                  checked={scope.enabled}
                  setChecked={enabled => {
                    setScopes(oldScopes => {
                      return {
                        ...oldScopes,
                        [scopeId]: {
                          ...oldScopes[scopeId],
                          enabled
                        }
                      }
                    })
                  }}
                  name={scope.name}
                  id={scopeId}
                />
              </div>
            ))}
        </div>
        <div className="PreferencesModal__overflow-gradient" />
        <div className="PreferencesModal__action">
          <Button
            disabled={loading}
            className="PreferencesModal__action__btn"
            onClick={handleUpdatePreferences}
          >
            {loading ? <Spinner /> : 'Update'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
