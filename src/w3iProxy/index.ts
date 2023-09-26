import { signMessage } from '@wagmi/core'
import { Core } from '@walletconnect/core'
import { IdentityKeys } from '@walletconnect/identity-keys'
import { NotifyClient } from '@walletconnect/notify-client'
import type { ICore } from '@walletconnect/types'
import mixpanel from 'mixpanel-browser'
import type { Logger } from 'pino'
import pino from 'pino'
import type { UiEnabled } from '../contexts/W3iContext/context'
import { identifyMixpanelUserAndInit } from '../utils/mixpanel'
import W3iAuthFacade from './w3iAuthFacade'
import type W3iChatFacade from './w3iChatFacade'
import W3iPushFacade from './w3iPushFacade'

export type W3iChatClient = Omit<W3iChatFacade, 'initState'>
export type W3iPushClient = Omit<W3iPushFacade, 'initState'>

declare global {
  interface Window {
    web3inbox: Web3InboxProxy
  }
}

class Web3InboxProxy {
  private readonly pushFacade: W3iPushFacade
  private readonly pushProvider: W3iPushFacade['providerName']
  private pushClient?: NotifyClient
  private readonly authFacade: W3iAuthFacade
  private readonly authProvider: W3iAuthFacade['providerName']
  private readonly relayUrl?: string
  private readonly projectId: string
  private readonly uiEnabled: UiEnabled
  private readonly core: ICore | undefined
  private readonly logger: Logger
  private mixpanelIsReady: boolean

  private identityKeys?: IdentityKeys

  public readonly dappOrigin: string

  public readonly signMessage: (message: string) => Promise<string>

  private isInitialized = false
  private initializing = false

  /**
   *
   */
  private constructor(
    pushProvider: Web3InboxProxy['pushProvider'],
    authProvider: Web3InboxProxy['authProvider'],
    dappOrigin: string,
    projectId: string,
    relayUrl: string,
    uiEnabled: UiEnabled
  ) {
    // Bind Push properties
    this.pushProvider = pushProvider
    this.pushFacade = new W3iPushFacade(this.pushProvider)
    // Bind Auth Properties
    this.authProvider = authProvider
    this.authFacade = new W3iAuthFacade(this.authProvider)
    // Bind other configuration properties
    this.relayUrl = relayUrl
    this.projectId = projectId
    this.uiEnabled = uiEnabled
    this.mixpanelIsReady = false
    this.logger = pino({
      level: 'debug',
      browser: {
        transmit: {
          level: 'debug',
          send: (level, log) => {
            if (this.mixpanelIsReady) {
              mixpanel.track(
                `(${level}): ${log.messages
                  .map(msg => {
                    if (typeof msg !== 'string') {
                      return JSON.stringify(msg)
                    }

                    return msg
                  })
                  .join('||')}`
              )
            }
          }
        }
      }
    })
    if (this.pushProvider === 'internal') {
      this.core = new Core({
        logger: this.logger,
        relayUrl: this.relayUrl,
        projectId: this.projectId,
        customStoragePrefix: ':w3i'
      })
    }

    this.dappOrigin = dappOrigin

    this.signMessage = async (message: string) => {
      return signMessage({ message })
    }
  }

  public static getProxy(
    pushProvider: Web3InboxProxy['pushProvider'],
    authProvider: Web3InboxProxy['authProvider'],
    dappOrigin: string,
    projectId: string,
    relayUrl: string,
    uiEnabled: UiEnabled
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!window.web3inbox) {
      window.web3inbox = new Web3InboxProxy(
        pushProvider,
        authProvider,
        dappOrigin,
        projectId,
        relayUrl,
        uiEnabled
      )
    }

    return window.web3inbox
  }

  public get notify(): W3iPushFacade {
    return this.pushFacade
  }

  public get auth(): W3iAuthFacade {
    return this.authFacade
  }

  public get isInitializing() {
    return this.initializing
  }

  public getInitComplete() {
    if (!this.isInitialized) {
      return false
    }

    if (this.pushProvider === 'internal') {
      if (!this.pushClient) {
        return false
      }
    }

    return true
  }

  public async init() {
    if (this.isInitialized) {
      return
    }

    this.initializing = true
    if (this.core) {
      await this.core.start()
      const clientId = await this.core.crypto.getClientId()
      if (import.meta.env.VITE_ENABLE_MIXPANEL && import.meta.env.VITE_MIXPANEL_TOKEN) {
        identifyMixpanelUserAndInit(clientId)
        this.mixpanelIsReady = true
      }
    }

    if (this.core) {
      this.identityKeys = new IdentityKeys(this.core)
    }

    if (this.authProvider === 'internal') {
      this.authFacade.initInternalProvider()
    }

    if (this.pushProvider === 'internal' && this.uiEnabled.notify && !this.pushClient) {
      this.pushClient = await NotifyClient.init({
        identityKeys: this.identityKeys,
        logger: this.logger,
        core: this.core
      })

      this.pushFacade.initInternalProvider(this.pushClient)
    }

    this.isInitialized = true
    this.initializing = false
  }
}

export default Web3InboxProxy
