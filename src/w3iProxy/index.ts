import ChatClient from '@walletconnect/chat-client'
import { Core } from '@walletconnect/core'
import { WalletClient as PushWalletClient } from '@walletconnect/push-client'
import W3iChatFacade from './w3iChatFacade'
import W3iPushFacade from './w3iPushFacade'

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
  private readonly relayUrl?: string
  private readonly projectId?: string

  /**
   *
   */
  public constructor(
    chatProvider: Web3InboxProxy['chatProvider'],
    pushProvider: Web3InboxProxy['pushProvider'],
    projectId: string,
    relayUrl: string
  ) {
    // Bind Chat properties
    this.chatProvider = chatProvider
    this.chatFacade = new W3iChatFacade(this.chatProvider)
    // Bind Push properties
    this.pushProvider = pushProvider
    this.pushFacade = new W3iPushFacade(this.pushProvider)
    // Bind other configuration properties
    this.relayUrl = relayUrl
    this.projectId = projectId
    window.web3inbox = this
  }

  public get chat(): W3iChatClient {
    return this.chatFacade
  }

  public get push(): W3iPushFacade {
    return this.pushFacade
  }

  public async init() {
    const core = new Core({
      logger: 'debug',
      relayUrl: this.relayUrl,
      projectId: this.projectId
    })

    console.log('this.chatProvider', this.chatProvider)
    console.log('this.pushProvider', this.pushProvider)

    if (this.chatProvider === 'internal') {
      this.chatClient = await ChatClient.init({ core })
      console.log('this.chatClient', this.chatClient)
      this.chatFacade.initInternalProvider(this.chatClient)
    }

    if (this.pushProvider === 'internal') {
      this.pushClient = await PushWalletClient.init({
        core
      })
      console.log('this.pushClient', this.pushClient)
      this.pushFacade.initInternalProvider(this.pushClient)
    }
  }
}

export default Web3InboxProxy
