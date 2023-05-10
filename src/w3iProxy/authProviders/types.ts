import type { NextObserver, Observable } from 'rxjs'

export interface AuthFacadeEvents {
  auth_set_account: { account: string }
}
export type ObservableMap = Map<
  keyof AuthFacadeEvents,
  Observable<AuthFacadeEvents[keyof AuthFacadeEvents]>
>

export type AuthEventObserver<K extends keyof AuthFacadeEvents> = NextObserver<AuthFacadeEvents[K]>
export type AuthEventObservable<K extends keyof AuthFacadeEvents> = Observable<AuthFacadeEvents[K]>
