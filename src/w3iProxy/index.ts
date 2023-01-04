import ChatClient from '@walletconnect/chat-client'
import W3iChatFacade from './w3iChatFacade'

export type W3iChatClient = Omit<W3iChatFacade, 'initState'>

declare global {
  interface Window {
    web3inbox: Web3InboxProxy
  }
}

class Web3InboxProxy {
  private readonly chatFacade: W3iChatFacade
  private readonly chatProvider: W3iChatFacade['providerName']
  private chatClient?: ChatClient
  private readonly relayUrl?: string
  private readonly projectId?: string

  /**
   *
   */
  public constructor(
    chatProvider: Web3InboxProxy['chatProvider'],
    projectId: string,
    relayUrl: string
  ) {
    this.chatProvider = chatProvider
    this.relayUrl = relayUrl
    this.projectId = projectId
    this.chatFacade = new W3iChatFacade(this.chatProvider)
    window.web3inbox = this
  }

  public get chat(): W3iChatClient {
    return this.chatFacade
  }

  public async init() {
    if (this.chatProvider !== 'internal') {
      return
    }

    this.chatClient = await ChatClient.init({
      logger: 'debug',
      relayUrl: this.relayUrl,
      projectId: this.projectId
    })

    this.chatFacade.initInternalProvider(this.chatClient)
  }
}

export default Web3InboxProxy
