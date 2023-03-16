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
import debounce from 'lodash.debounce'
import './NewChat.scss'
import { truncate } from '../../../utils/string'

const NewChat: React.FC = () => {
  const { chatClientProxy, userPubkey } = useContext(W3iContext)
  const { mode } = useContext(SettingsContext)
  const [isInviting, setIsInviting] = useState(false)
  const [query, setQuery] = useState('')

  const [debouncedQuery, setDebouncedQuery] = useState<string>('')
  const debouncedUpdateQuery = useCallback(debounce(setDebouncedQuery, 300), [setDebouncedQuery])

  const [doesExistOnKeyserver, setDoesExistOnKeyserver] = useState(false)
  const [searchingOnKeyserver, setSearchingOnKeyserver] = useState(false)
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

  useEffect(() => {
    debouncedUpdateQuery(query)
  }, [query, debouncedUpdateQuery])

  useEffect(() => {
    const checkIfOnKeyserver = async () => {
      if (!(isValidAddressOrEnsDomain(debouncedQuery) && chatClientProxy)) {
        return false
      }

      try {
        setSearchingOnKeyserver(true)
        const resolvedAddress = await resolveAddress(debouncedQuery)
        await chatClientProxy.resolve({ account: resolvedAddress })
        setSearchingOnKeyserver(false)

        return true
      } catch {
        setSearchingOnKeyserver(false)

        return false
      }
    }

    checkIfOnKeyserver().then(doesExist => {
      setDoesExistOnKeyserver(doesExist)
    })
  }, [debouncedQuery])

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

  const disabledReason = useMemo(() => {
    const truncatedQuery = truncate(query, 20)

    if (!isValidAddressOrEnsDomain(query)) {
      return `Address ${truncatedQuery} not valid ethereum domain name or address`
    } else if (isInviting) {
      return `Currently inviting ${truncatedQuery}`
    } else if (!doesExistOnKeyserver) {
      return `${truncatedQuery} not registered on chat keyserver`
    } else if (query.length === 0) {
      return `Need to provide an address to invite`
    }

    return ``
  }, [query, isInviting, doesExistOnKeyserver])

  const isDisabled = useMemo(() => Boolean(disabledReason), [disabledReason])

  return (
    <Fragment>
      <div className="NewChat">
        {isMobile ? (
          <div className="NewChat__mobile-header">
            <div className="NewChat__search-box">
              <SearchSuggestions onNameClick={name => setQuery(name)} name={debouncedQuery} />
              <BackButton backTo="/messages">Chat</BackButton>
              <MobileHeading size="small">New Chat</MobileHeading>
              <div className="NewChat__search-box__actions">
                <Button
                  customType="action-icon"
                  className="NewChat__search-box__actions__invite"
                  onClick={() => {
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
            <SearchSuggestions onNameClick={name => setQuery(name)} name={debouncedQuery} />
            <Input
              value={query}
              placeholder="ENS Username (vitalik.eth) / Wallet Address (0x423…)"
              onChange={e => setQuery(e.target.value)}
            />
            <Button
              onClick={() => {
                invite(query)
              }}
              title={disabledReason}
              disabled={isDisabled}
            >
              {
                // eslint-disable-next-line no-nested-ternary
                isInviting ? `Inviting...` : searchingOnKeyserver ? `Looking up...` : `Send Invite`
              }
            </Button>
          </div>
        )}
      </div>
      {/* <SearchHistoryContacts /> */}
    </Fragment>
  )
}

export default NewChat
