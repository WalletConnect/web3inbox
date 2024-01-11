import type { NotifyClientTypes } from '@walletconnect/notify-client'
import { BehaviorSubject } from 'rxjs'

interface IPreferencesModalState {
  preferencesModalAppId?: string
  isOpen: boolean
}
interface IUnsubscribeModalState {
  unsubscribeModalAppId?: string
  isOpen: boolean
}
interface IAppSearchState {
  searchTerm?: string
  isOpen: boolean
}

interface ISubscribeModalState {
  metadata?: NotifyClientTypes.Metadata
  isOpen: boolean
}

const chatSearchSubject = new BehaviorSubject(false)
const notifySearchSubject = new BehaviorSubject(false)
const appSearchSubject = new BehaviorSubject<IAppSearchState>({
  isOpen: false,
  searchTerm: undefined
})

const profileModalSubject = new BehaviorSubject(false)
const shareModalSubject = new BehaviorSubject(false)
const signatureModalSubject = new BehaviorSubject({
  isOpen: false,
  signing: false
})
const pwaModalSubject = new BehaviorSubject(false)
const notificationPwaModalSubject = new BehaviorSubject(false)
const contactsModalSubject = new BehaviorSubject(false)
const subscribeModalSubject = new BehaviorSubject<ISubscribeModalState>({
  metadata: undefined,
  isOpen: false
})
const preferencesModalSubject = new BehaviorSubject<IPreferencesModalState>({
  preferencesModalAppId: undefined,
  isOpen: false
})
const unsubscribeModalSubject = new BehaviorSubject<IUnsubscribeModalState>({
  unsubscribeModalAppId: undefined,
  isOpen: false
})

export const chatSearchService = {
  toggleSearch: () => chatSearchSubject.next(!chatSearchSubject.value),
  openSearch: () => chatSearchSubject.next(true),
  closeSearch: () => chatSearchSubject.next(false),
  searchState: chatSearchSubject.asObservable()
}
export const notifySearchService = {
  toggleSearch: () => notifySearchSubject.next(!notifySearchSubject.value),
  openSearch: () => notifySearchSubject.next(true),
  closeSearch: () => notifySearchSubject.next(false),
  searchState: notifySearchSubject.asObservable()
}

export const appSearchService = {
  toggleSearch: () =>
    appSearchSubject.next({
      searchTerm: undefined,
      isOpen: !appSearchSubject.value.isOpen
    }),
  openSearch: () =>
    appSearchSubject.next({
      isOpen: true
    }),
  closeSearch: () =>
    appSearchSubject.next({
      isOpen: false,
      searchTerm: undefined
    }),
  setSearch: (term: string) =>
    appSearchSubject.next({
      ...appSearchSubject.value,
      searchTerm: term
    }),
  searchState: appSearchSubject.asObservable()
}

export const profileModalService = {
  toggleModal: () => profileModalSubject.next(!profileModalSubject.value),
  openModal: () => profileModalSubject.next(true),
  closeModal: () => profileModalSubject.next(false),
  modalState: profileModalSubject.asObservable()
}

export const shareModalService = {
  toggleModal: () => shareModalSubject.next(!shareModalSubject.value),
  openModal: () => shareModalSubject.next(true),
  closeModal: () => shareModalSubject.next(false),
  modalState: shareModalSubject.asObservable()
}

export const signatureModalService = {
  toggleModal: () =>
    signatureModalSubject.next({
      ...signatureModalSubject.value,
      isOpen: !signatureModalSubject.value.isOpen
    }),
  openModal: () =>
    signatureModalSubject.next({
      ...signatureModalSubject.value,
      isOpen: true
    }),
  startSigning: () =>
    signatureModalSubject.next({
      ...signatureModalSubject.value,
      signing: true
    }),
  stopSigning: () =>
    signatureModalSubject.next({
      ...signatureModalSubject.value,
      signing: false
    }),
  closeModal: () => {
    signatureModalSubject.next({
      ...signatureModalSubject.value,
      isOpen: false
    })
    setTimeout(() => {
      signatureModalSubject.next({
        ...signatureModalSubject.value,
        signing: false
      })
    }, 500)
  },
  modalState: signatureModalSubject.asObservable()
}

export const pwaModalService = {
  toggleModal: () => pwaModalSubject.next(!pwaModalSubject.value),
  openModal: () => pwaModalSubject.next(true),
  closeModal: () => pwaModalSubject.next(false)
}

export const notificationPwaModalService = {
  toggleModal: () => notificationPwaModalSubject.next(!pwaModalSubject.value),
  openModal: () => notificationPwaModalSubject.next(true),
  closeModal: () => notificationPwaModalSubject.next(false),
  modalState: notificationPwaModalSubject.asObservable()
}

export const preferencesModalService = {
  toggleModal: (appId?: string) =>
    preferencesModalSubject.next({
      preferencesModalAppId: appId,
      isOpen: !preferencesModalSubject.value.isOpen
    }),
  closeModal: () =>
    preferencesModalSubject.next({
      preferencesModalAppId: undefined,
      isOpen: false
    }),
  modalState: preferencesModalSubject.asObservable()
}

export const subscribeModalService = {
  toggleModal: (metadata: NotifyClientTypes.Metadata) => {
    subscribeModalSubject.next({
      metadata,
      isOpen: !subscribeModalSubject.value.isOpen
    })
  },
  openModal: (metadata: NotifyClientTypes.Metadata) =>
    subscribeModalSubject.next({
      metadata,
      isOpen: true
    }),
  closeModal: () =>
    subscribeModalSubject.next({
      metadata: undefined,
      isOpen: false
    }),
  modalState: subscribeModalSubject.asObservable()
}

export const unsubscribeModalService = {
  toggleModal: (appId?: string) =>
    unsubscribeModalSubject.next({
      unsubscribeModalAppId: appId,
      isOpen: !unsubscribeModalSubject.value.isOpen
    }),
  closeModal: () =>
    unsubscribeModalSubject.next({
      unsubscribeModalAppId: undefined,
      isOpen: false
    }),
  modalState: unsubscribeModalSubject.asObservable()
}

export const contactsModalService = {
  toggleModal: () => contactsModalSubject.next(!contactsModalSubject.value),
  openModal: () => contactsModalSubject.next(true),
  closeModal: () => contactsModalSubject.next(false),
  modalState: contactsModalSubject.asObservable()
}
