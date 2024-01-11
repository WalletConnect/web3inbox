import { getAccount, getNetwork, watchAccount, watchNetwork } from '@wagmi/core'
import type { JsonRpcRequest } from '@walletconnect/jsonrpc-types'
import type { EventEmitter } from 'events'

import { getEIPChainString } from '@/utils/chain'

export default class InternalAuthProvider {
  private readonly methodsListenedTo = ['auth_set_account']
  public providerName = 'InternalAuthProvider'
  public account?: string = getAccount().address
  public chain?: string = getEIPChainString(getNetwork().chain?.id)
  protected readonly emitter: EventEmitter

  public constructor(emitter: EventEmitter, _name = 'InternalAuthProvider') {
    this.emitter = emitter

    watchNetwork(network => {
      const caip10Chain = getEIPChainString(getNetwork().chain?.id)
      this.chain = caip10Chain

      this.emitter.emit('auth_set_account', { account: this.account, chain: caip10Chain })
    })

    watchAccount(account => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!account.address) {
        this.emitter.emit('auth_set_account', { account: null, chain: null })

        return
      }

      const caip10Chain = getEIPChainString(getNetwork().chain?.id)
      this.emitter.emit('auth_set_account', { account: account.address, chain: caip10Chain })
      this.chain = caip10Chain
      this.account = account.address
    })
  }

  public isListeningToMethodFromPostMessage(method: string) {
    return this.methodsListenedTo.includes(method)
  }

  public handleMessage(request: JsonRpcRequest<unknown>) {
    switch (request.method) {
      case 'setAccount':
        this.account = (request.params as { account: string }).account
        this.emitter.emit('auth_set_account', request.params)
        break
      default:
        throw new Error(`Method ${request.method} unsupported by provider ${this.providerName}`)
    }
  }

  public async initState() {
    this.account = getAccount().address
    if (this.account) {
      this.emitter.emit('auth_set_account', { account: this.account, chain: this.chain })
    }

    return Promise.resolve()
  }

  public getChain() {
    return this.chain
  }

  public getAccount() {
    return this.account
  }

  public setAccount(account: string) {
    this.account = account
  }

  public setChain(chain: string) {
    this.chain = chain
  }
}
