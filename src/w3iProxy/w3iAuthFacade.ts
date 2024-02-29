import type { JsonRpcRequest } from '@walletconnect/jsonrpc-types'
import { EventEmitter } from 'events'

import InternalAuthProvider from './authProviders/internalAuthProvider'
import { AuthFacadeEvents } from './authProviders/types'

class W3iAuthFacade {
  public readonly emitter: EventEmitter
  private readonly provider: InternalAuthProvider

  public constructor() {
    this.emitter = new EventEmitter()
    this.provider = new InternalAuthProvider(this.emitter)
  }

  // Method to be used by external providers. Not internal use.
  public postMessage(messageData: JsonRpcRequest<unknown>) {
    this.emitter.emit(messageData.id.toString(), messageData)
    switch (messageData.method) {
      default:
        if (this.provider.isListeningToMethodFromPostMessage(messageData.method)) {
          this.provider.handleMessage(messageData)
        }
    }
  }

  public async initInternalProvider() {
    const internalProvider = this.provider as InternalAuthProvider
    await internalProvider.initState()
  }

  public getChain() {
    return this.provider.getChain()
  }

  public getAccount() {
    return this.provider.getAccount()
  }

  public updateFullAccount(account: string, chain: string) {
    this.provider.setAccount(account)
    this.provider.setChain(chain)
    this.emitter.emit('auth_set_account', { account, chain })
  }

  public setAccount(account: string) {
    this.provider.setAccount(account)
  }

  public setChain(chain: string) {
    this.provider.setChain(chain)
  }

  public on<K extends keyof AuthFacadeEvents>(eventName: K, listener: (params: AuthFacadeEvents[K]) => void)  {
    return this.provider.on(eventName, listener);
  }

  public once<K extends keyof AuthFacadeEvents>(eventName: K, listener: (params: AuthFacadeEvents[K]) => void)  {
    return this.provider.once(eventName, listener);
  }

}

export default W3iAuthFacade
