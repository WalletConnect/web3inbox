import ChatClient from '@walletconnect/chat-client'
import W3iChatFacade from './w3iChatFacade'

export type W3iChatClient = Omit<W3iChatFacade, 'initState'>

class Web3InboxProxy {
  private chatClient: ChatClient | undefined
  private readonly chatFacade: W3iChatFacade
  private readonly relayUrl: string
  private readonly projectId: string

  /**
   *
   */
  public constructor(projectId: string, relayUrl: string) {
    this.relayUrl = relayUrl
    this.projectId = projectId
    this.chatFacade = new W3iChatFacade()
  }

  public get chat(): W3iChatClient {
    return this.chatFacade
  }

  public async init() {
    console.log('pre init', this.chatClient)
    this.chatClient = await ChatClient.init({
      logger: 'debug',
      relayUrl: this.relayUrl,
      projectId: this.projectId
    })

    console.log('Post init', this.chatClient)
    this.chatFacade.initState(this.chatClient)
  }
}

export default Web3InboxProxy
