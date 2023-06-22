import { getAccount, watchAccount } from '@wagmi/core'
import type { JsonRpcRequest } from '@walletconnect/jsonrpc-types'
import type { EventEmitter } from 'events'
import { ONE_MONTH, readCookie, setCookie } from '../../components/utils/cookies'

export default class InternalAuthProvider {
  private readonly methodsListenedTo = ['auth_set_account']
  public providerName = 'InternalAuthProvider'
  public account?: string
  protected readonly emitter: EventEmitter

  public constructor(emitter: EventEmitter, _name = 'InternalAuthProvider') {
    this.emitter = emitter

    watchAccount(account => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!account.address) {
        const wagmiRestoreRaw = readCookie('wagmiRestore')
        if (wagmiRestoreRaw) {
          const wagmiRestore = JSON.parse(wagmiRestoreRaw) as Record<string, string>
          Object.entries(wagmiRestore).forEach(([key, value]) => {
            localStorage.setItem(key, value)
          })
          document.location.reload()
        }

        return
      }

      const wagmiInfo = {
        'wagmi.store': localStorage.getItem('wagmi.store'),
        'wagmi.injected.shimDisconnect': localStorage.getItem('wagmi.injected.shimDisconnect'),
        'wagmi.wallet': localStorage.getItem('wagmi.wallet'),
        'wagmi.connected': localStorage.getItem('wagmi.connected')
      }

      setCookie({
        key: 'wagmiRestore',
        maxAgeSeconds: ONE_MONTH,
        samesite: 'None',
        value: JSON.stringify(wagmiInfo)
      })

      this.emitter.emit('auth_set_account', { account: account.address })
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
      this.emitter.emit('auth_set_account', { account: this.account })
    }

    return Promise.resolve()
  }

  public getAccount() {
    return this.account
  }

  public setAccount(account: string) {
    this.account = account
  }
}
