import { BehaviorSubject } from 'rxjs'

interface IPreferencesModalState {
  preferencesModalAppId?: string
  isOpen: boolean
}
interface IUnsubscribeModalState {
  unsubscribeModalAppId?: string
  isOpen: boolean
}

const searchSubject = new BehaviorSubject(false)
const profileModalSubject = new BehaviorSubject(false)
const shareModalSubject = new BehaviorSubject(false)
const preferencesModalSubject = new BehaviorSubject<IPreferencesModalState>({
  preferencesModalAppId: undefined,
  isOpen: false
})
const unsubscribeModalSubject = new BehaviorSubject<IUnsubscribeModalState>({
  unsubscribeModalAppId: undefined,
  isOpen: false
})

export const searchService = {
  toggleSearch: () => searchSubject.next(!searchSubject.value),
  openSearch: () => searchSubject.next(true),
  closeSearch: () => searchSubject.next(false),
  searchState: searchSubject.asObservable()
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
