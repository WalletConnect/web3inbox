import { ChatClient } from '@walletconnect/chat-client'
import W3iChatFacade from './w3iChatFacade'

class W3i {
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

  public get chat() {
    return this.chatFacade as Omit<W3iChatFacade, 'initState'>
  }

  public async init() {
    this.chatClient = await ChatClient.init({
      logger: 'debug',
      relayUrl: this.relayUrl,
      projectId: this.projectId
    })
    this.chatFacade.initState(this.chatClient)
  }
}

export default W3i
