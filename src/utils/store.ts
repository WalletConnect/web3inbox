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
const pushSearchSubject = new BehaviorSubject(false)
const appSearchSubject = new BehaviorSubject<IAppSearchState>({
  isOpen: false,
  searchTerm: undefined
})

const profileModalSubject = new BehaviorSubject(false)
const shareModalSubject = new BehaviorSubject(false)
const signatureModalSubject = new BehaviorSubject(false)
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
export const pushSearchService = {
  toggleSearch: () => pushSearchSubject.next(!pushSearchSubject.value),
  openSearch: () => pushSearchSubject.next(true),
  closeSearch: () => pushSearchSubject.next(false),
  searchState: pushSearchSubject.asObservable()
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
  toggleModal: () => signatureModalSubject.next(!signatureModalSubject.value),
  openModal: () => signatureModalSubject.next(true),
  closeModal: () => signatureModalSubject.next(false),
  modalState: signatureModalSubject.asObservable()
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
