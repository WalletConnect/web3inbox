import { BehaviorSubject } from 'rxjs'

const profileModalSubject = new BehaviorSubject(false)
const shareModalSubject = new BehaviorSubject(false)

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
