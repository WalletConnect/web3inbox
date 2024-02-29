import { signMessage } from '@wagmi/core'

import { wagmiConfig } from '@/utils/wagmiConfig'
import W3iAuthFacade from '@/w3iProxy/w3iAuthFacade'
import { showErrorMessageToast } from '@/utils/toasts'

declare global {
  interface Window {
    web3inbox: Web3InboxProxy
  }
}

class Web3InboxProxy {
  private readonly authFacade: W3iAuthFacade

  public readonly signMessage: (message: string) => Promise<string>

  private isInitialized = false
  private initializing = false

  /**
   *
   */
  private constructor() {
    // Bind Auth Properties
    this.authFacade = new W3iAuthFacade()

    this.signMessage = async (message: string) => {
      try {
        const signed = await signMessage(wagmiConfig, {
          message
        })

        return signed
      } catch (e: any) {
	showErrorMessageToast("Failed to sign message. Consider using different wallet.")
	throw new Error(`Failed to sign message. ${e.message}`)
      }
    }
  }

  public static getProxy() {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!window.web3inbox) {
      window.web3inbox = new Web3InboxProxy()
    }

    return window.web3inbox
  }

  public get auth(): W3iAuthFacade {
    return this.authFacade
  }

  public get isInitializing() {
    return this.initializing
  }

  public async init() {
    if (this.isInitialized) {
      return
    }

    this.initializing = true

    await this.authFacade.initInternalProvider()

    this.isInitialized = true
    this.initializing = false
  }
}

export default Web3InboxProxy
