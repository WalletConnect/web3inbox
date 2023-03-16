import { fetchEnsAddress } from '@wagmi/core'
import React, { Fragment, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import SettingsContext from '../../../contexts/SettingsContext/context'
import W3iContext from '../../../contexts/W3iContext/context'
import { isValidAddressOrEnsDomain, isValidEnsDomain } from '../../../utils/address'
import { useColorModeValue, useIsMobile } from '../../../utils/hooks'
import BackButton from '../../general/BackButton'
import Button from '../../general/Button'
import SendIcon from '../../general/Icon/SendIcon'
import Input from '../../general/Input'
import MobileHeading from '../../layout/MobileHeading'
import SearchSuggestions from './SearchSuggestions'
import './NewChat.scss'

const NewChat: React.FC = () => {
  const { chatClientProxy, userPubkey } = useContext(W3iContext)
  const { mode } = useContext(SettingsContext)
  const [isInviting, setIsInviting] = useState(false)
  const [query, setQuery] = useState('')
  const isMobile = useIsMobile()
  const themeColors = useColorModeValue(mode)
  const toastTheme = useMemo(() => {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    const specifiedMode = mode === 'system' ? systemTheme : mode

    return specifiedMode
  }, [mode])

  const resolveAddress = async (inviteeAddress: string) => {
    // eslint-disable-next-line prefer-regex-literals
    if (isValidEnsDomain(inviteeAddress)) {
      const resolvedAddress = await fetchEnsAddress({
        name: inviteeAddress
      })

      if (resolvedAddress) {
        return `eip155:1:${resolvedAddress}`
      }
    }

    return `eip155:1:${inviteeAddress}`
  }

  const invite = useCallback(
    async (inviteeAddress: string) => {
      setIsInviting(true)
      if (!userPubkey || !chatClientProxy) {
        setIsInviting(false)

        return
      }

      try {
        const resolvedAddress = await resolveAddress(inviteeAddress)

        await chatClientProxy.invite({
          inviteeAccount: resolvedAddress,
          inviterAccount: `eip155:1:${userPubkey}`,
          inviteePublicKey: await chatClientProxy.resolve({ account: resolvedAddress }),
          message: 'Hey there! Wanna chat?'
        })

        toast('Invite sent successfully', {
          type: 'success',
          position: 'bottom-right',
          autoClose: 5000,
          theme: toastTheme,
          style: {
            borderRadius: '1em'
          }
        })
      } catch (error) {
        if (error instanceof Error) {
          toast(error.message, {
            type: 'error',
            position: 'bottom-right',
            autoClose: 5000,
            theme: toastTheme,
            style: {
              borderRadius: '1em'
            }
          })
        }
      } finally {
        setQuery('')
        setIsInviting(false)
      }
    },
    [userPubkey, chatClientProxy]
  )

  const isDisabled = useMemo(
    () => !isValidAddressOrEnsDomain(query) || isInviting,
    [query, isInviting]
  )

  return (
    <Fragment>
      <div className="NewChat">
        {isMobile ? (
          <div className="NewChat__mobile-header">
            <div className="NewChat__search-box">
              <SearchSuggestions onNameClick={name => setQuery(name)} name={query} />
              <BackButton backTo="/messages">Chat</BackButton>
              <MobileHeading size="small">New Chat</MobileHeading>
              <div className="NewChat__search-box__actions">
                <Button
                  customType="action-icon"
                  className="NewChat__search-box__actions__invite"
                  onClick={() => {
                    console.log('Button clicked.')
                    invite(query)
                  }}
                  disabled={isDisabled}
                >
                  <SendIcon fillColor={isDisabled ? themeColors['--fg-color-3'] : 'white'} />
                </Button>
              </div>
            </div>
            <div className="NewChat__input-container">
              <Input
                value={query}
                placeholder="ENS Username (vitalik.eth) / Wallet Address (0x423…)"
                onChange={e => setQuery(e.target.value)}
              />
            </div>
          </div>
        ) : (
          <div className="NewChat__search-box">
            <SearchSuggestions onNameClick={name => setQuery(name)} name={query} />
            <Input
              value={query}
              placeholder="ENS Username (vitalik.eth) / Wallet Address (0x423…)"
              onChange={e => setQuery(e.target.value)}
            />
            <Button
              onClick={() => {
                console.log('Button clicked.')
                invite(query)
              }}
              disabled={isDisabled}
            >
              {isInviting ? `Inviting...` : `Send Invite`}
            </Button>
          </div>
        )}
      </div>
      {/* <SearchHistoryContacts /> */}
    </Fragment>
  )
}

export default NewChat
