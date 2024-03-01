import { getAccount, watchAccount } from '@wagmi/core'
import type { JsonRpcRequest } from '@walletconnect/jsonrpc-types'
import type { EventEmitter } from 'events'

import { getEIPChainString } from '@/utils/chain'
import { wagmiConfig } from '@/utils/wagmiConfig'
import { AuthFacadeEvents } from './types'

export default class InternalAuthProvider {
  private readonly methodsListenedTo = ['auth_set_account']
  public providerName = 'InternalAuthProvider'
  public account?: string = getAccount(wagmiConfig).address
  public chain?: string = getEIPChainString(getAccount(wagmiConfig).chain?.id)
  protected readonly emitter: EventEmitter

  public constructor(emitter: EventEmitter) {
    this.emitter = emitter

    watchAccount(wagmiConfig, {
      onChange: data => {
        const chainId = getAccount(wagmiConfig).chainId

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!data.address) {
          this.emitter.emit('auth_set_account', { account: null, chain: null })
          return
        }

        const caip10Chain = getEIPChainString(chainId)
        this.emitter.emit('auth_set_account', { account: data.address, chain: caip10Chain })
        this.chain = caip10Chain
        this.account = data.address
      }
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
    this.account = getAccount(wagmiConfig).address
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

  public on<K extends keyof AuthFacadeEvents>(eventName: K, listener: (params: AuthFacadeEvents[K]) => void)  {
    this.emitter.on(eventName, listener)

    return () => { this.emitter.off(eventName, listener) };
  }

  public once<K extends keyof AuthFacadeEvents>(eventName: K, listener: (params: AuthFacadeEvents[K]) => void)  {
    this.emitter.once(eventName, listener)

    return () => { this.emitter.off(eventName, listener) };
  }
}
