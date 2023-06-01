import ChatClient from '@walletconnect/chat-client'
import { Core } from '@walletconnect/core'
import { WalletClient as PushWalletClient } from '@walletconnect/push-client'
import type { UiEnabled } from '../contexts/W3iContext/context'
import W3iAuthFacade from './w3iAuthFacade'
import W3iChatFacade from './w3iChatFacade'
import W3iPushFacade from './w3iPushFacade'
import type { ISyncClient } from '@walletconnect/sync-client'
import { SyncClient, SyncStore } from '@walletconnect/sync-client'
import type { ICore } from '@walletconnect/types'

export type W3iChatClient = Omit<W3iChatFacade, 'initState'>
export type W3iPushClient = Omit<W3iPushFacade, 'initState'>

declare global {
  interface Window {
    web3inbox: Web3InboxProxy
  }
}

class Web3InboxProxy {
  private readonly chatFacade: W3iChatFacade
  private readonly chatProvider: W3iChatFacade['providerName']
  private chatClient?: ChatClient
  private readonly pushFacade: W3iPushFacade
  private readonly pushProvider: W3iPushFacade['providerName']
  private pushClient?: PushWalletClient
  private readonly authFacade: W3iAuthFacade
  private readonly authProvider: W3iAuthFacade['providerName']
  private readonly relayUrl?: string
  private readonly projectId: string
  private readonly uiEnabled: UiEnabled
  private syncClient: ISyncClient | undefined
  private readonly core: ICore

  private isInitialized = false

  /**
   *
   */
  private constructor(
    chatProvider: Web3InboxProxy['chatProvider'],
    pushProvider: Web3InboxProxy['pushProvider'],
    authProvider: Web3InboxProxy['authProvider'],
    projectId: string,
    relayUrl: string,
    uiEnabled: UiEnabled
  ) {
    // Bind Chat properties
    this.chatProvider = chatProvider
    this.chatFacade = new W3iChatFacade(this.chatProvider)
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
    this.core = new Core({
      logger: 'debug',
      relayUrl: this.relayUrl,
      projectId: this.projectId
    })
  }

  public static getProxy(
    chatProvider: Web3InboxProxy['chatProvider'],
    pushProvider: Web3InboxProxy['pushProvider'],
    authProvider: Web3InboxProxy['authProvider'],
    projectId: string,
    relayUrl: string,
    uiEnabled: UiEnabled
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!window.web3inbox) {
      window.web3inbox = new Web3InboxProxy(
        chatProvider,
        pushProvider,
        authProvider,
        projectId,
        relayUrl,
        uiEnabled
      )
    }

    return window.web3inbox
  }

  public get chat(): W3iChatClient {
    return this.chatFacade
  }

  public get push(): W3iPushFacade {
    return this.pushFacade
  }

  public get auth(): W3iAuthFacade {
    return this.authFacade
  }

  public async init() {
    if (this.isInitialized) {
      return
    }

    if (!this.syncClient) {
      this.syncClient = await SyncClient.init({
        core: this.core,
        projectId: this.projectId
      })
    }

    if (this.chatProvider === 'internal' && this.uiEnabled.chat && !this.chatClient) {
      this.chatClient = await ChatClient.init({
        projectId: this.projectId,
        SyncStoreController: SyncStore,
        core: this.core,
        syncClient: this.syncClient,
        keyserverUrl: 'https://keys.walletconnect.com'
      })
      await this.chatFacade.initInternalProvider(this.chatClient)
    }

    if (this.pushProvider === 'internal' && this.uiEnabled.push && !this.pushClient) {
      this.pushClient = await PushWalletClient.init({
        logger: 'info',
        core: this.core
      })

      this.pushFacade.initInternalProvider(this.pushClient)
    }

    if (this.authProvider === 'internal') {
      this.authFacade.initInternalProvider()
    }

    this.isInitialized = true
  }
}

export default Web3InboxProxy
