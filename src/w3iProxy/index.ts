import ChatClient from '@walletconnect/chat-client'
import { Core } from '@walletconnect/core'
import { WalletClient as PushWalletClient } from '@walletconnect/push-client'
import type { UiEnabled } from '../contexts/W3iContext/context'
import W3iAuthFacade from './w3iAuthFacade'
import W3iChatFacade from './w3iChatFacade'
import W3iPushFacade from './w3iPushFacade'
import type { ISyncClient } from '@walletconnect/sync-client'
import { SyncClient, SyncStore } from '@walletconnect/sync-client'

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

  /**
   *
   */
  public constructor(
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
    window.web3inbox = this
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
    const core = new Core({
      logger: 'debug',
      relayUrl: this.relayUrl,
      projectId: this.projectId
    })

    this.syncClient = await SyncClient.init({
      core,
      projectId: this.projectId
    })

    /*
     * Has to be init'd even if uiEnabled.chat is false due to the fact it
     * currently manages account
     */
    if (this.chatProvider === 'internal') {
      console.log('Init chat')

      this.chatClient = await ChatClient.init({
        projectId: this.projectId,
        SyncStoreController: SyncStore,
        core,
        syncClient: this.syncClient,
        keyserverUrl: 'https://keys.walletconnect.com'
      })
      await this.chatFacade.initInternalProvider(this.chatClient)
    }

    if (this.pushProvider === 'internal' && this.uiEnabled.push) {
      console.log('Init push')
      this.pushClient = await PushWalletClient.init({
        logger: 'info',
        core
      })

      this.pushFacade.initInternalProvider(this.pushClient)
    }

    if (this.authProvider === 'internal') {
      this.authFacade.initInternalProvider()
    }
  }
}

export default Web3InboxProxy
