import { BehaviorSubject } from 'rxjs'

const searchSubject = new BehaviorSubject(false)
const profileModalSubject = new BehaviorSubject(false)
const shareModalSubject = new BehaviorSubject(false)

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
