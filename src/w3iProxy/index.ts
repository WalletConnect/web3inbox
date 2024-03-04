import { signMessage } from '@wagmi/core'

import { wagmiConfig } from '@/utils/wagmiConfig'
import { showErrorMessageToast } from '@/utils/toasts'

declare global {
  interface Window {
    web3inbox: Web3InboxProxy
  }
}

class Web3InboxProxy {
  public readonly signMessage: (message: string) => Promise<string>

  /**
   *
   */
  private constructor() {
    // Bind Auth Properties
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

}

export default Web3InboxProxy
