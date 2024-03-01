import React, { useCallback, useEffect, useState } from 'react'

import type { NotifyClientTypes } from '@walletconnect/notify-client'
import { useNotificationTypes, useSubscription } from '@web3inbox/react'

import Button from '@/components/general/Button'
import CrossIcon from '@/components/general/Icon/CrossIcon'
import { Modal } from '@/components/general/Modal/Modal'
import Spinner from '@/components/general/Spinner'
import Text from '@/components/general/Text'
import Toggle from '@/components/general/Toggle'
import { logError } from '@/utils/error'
import { useModals } from '@/utils/hooks'
import { preferencesModalService } from '@/utils/store'
import { showErrorMessageToast, showSuccessMessageToast } from '@/utils/toasts'

import './PreferencesModal.scss'

export const PreferencesModal: React.FC = () => {
  const { preferencesModalAppId: domain } = useModals()

  const { update, data: appScopes } = useNotificationTypes(undefined, domain)
  const { data: app } = useSubscription(undefined, domain)
  const [scopes, setScopes] = useState<NotifyClientTypes.NotifySubscription['scope']>(appScopes ?? {})
  console.log({ app, scopes})
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
    setScopes(appScopes ?? {})
  }, [setScopes, appScopes])

  const handleUpdatePreferences = useCallback(async () => {
    setLoading(true)
    if (domain) {
      try {
        await update(getEnabledScopes(scopes)).then(() => {
          preferencesModalService.closeModal()
          setLoading(false)
          showSuccessMessageToast('Preferences updated successfully')
        })
      } catch (error) {
        logError(error)
        showErrorMessageToast('Failed to update preferences')
        setLoading(false)
      }
    }
  }, [domain, scopes])

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
