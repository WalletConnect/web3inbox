import type { NotifyClientTypes } from '@walletconnect/notify-client'
import { valtio } from '@web3inbox/core'

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

export const modalsOpen = valtio.proxy({
  notifySearchSubject: false,
  appSearchSubject: {
    isOpen: false,
    searchTerm: undefined
  } as IAppSearchState,
  profileModalSubject: false,
  shareModalSubject: false,
  signatureModalSubject: {
    isOpen: false,
    signing: false,
    oneClickAuthMode: false
  },
  pwaModalSubject: false,
  notificationPwaModalSubject: false,
  contactsModalSubject: false,
  subscribeModalSubject: {
    metadata: undefined,
    isOpen: false
  } as ISubscribeModalState,
  preferencesModalSubject: {
    preferencesModalAppId: undefined,
    isOpen: false
  } as IPreferencesModalState,
  unsubscribeModalSubject: {
    unsubscribeModalAppId: undefined,
    isOpen: false
  } as IUnsubscribeModalState
})

export const notifySearchService = {
  toggleSearch: () => (modalsOpen.notifySearchSubject = !modalsOpen.notifySearchSubject),
  openSearch: () => (modalsOpen.notifySearchSubject = true),
  closeSearch: () => (modalsOpen.notifySearchSubject = false),
  searchState: modalsOpen.notifySearchSubject
}

export const appSearchService = {
  toggleSearch: () =>
    (modalsOpen.appSearchSubject = {
      searchTerm: undefined,
      isOpen: !modalsOpen.appSearchSubject.isOpen
    }),
  openSearch: () =>
    (modalsOpen.appSearchSubject = {
      searchTerm: undefined,
      isOpen: true
    }),
  closeSearch: () =>
    (modalsOpen.appSearchSubject = {
      isOpen: false,
      searchTerm: undefined
    }),
  setSearch: (term: string) =>
    (modalsOpen.appSearchSubject = {
      ...modalsOpen.appSearchSubject,
      searchTerm: term
    }),
  searchState: modalsOpen.appSearchSubject
}

export const profileModalService = {
  toggleModal: () => (modalsOpen.profileModalSubject = !modalsOpen.profileModalSubject),
  openModal: () => (modalsOpen.profileModalSubject = true),
  closeModal: () => (modalsOpen.profileModalSubject = false),
  getModalState: () => modalsOpen.profileModalSubject
}

export const shareModalService = {
  toggleModal: () => (modalsOpen.shareModalSubject = !modalsOpen.shareModalSubject),
  openModal: () => (modalsOpen.shareModalSubject = true),
  closeModal: () => (modalsOpen.shareModalSubject = false),
  getModalState: () => modalsOpen.shareModalSubject
}

export const signatureModalService = {
  setSign25ModeOn: () =>
    (modalsOpen.signatureModalSubject = {
      ...modalsOpen.signatureModalSubject,
      oneClickAuthMode: true
    }),
  setSign25ModeOff: () => {
    console.log("Setting sign 25 mode off")
    modalsOpen.signatureModalSubject = {
      ...modalsOpen.signatureModalSubject,
      oneClickAuthMode: true
    }
  },
  toggleModal: () =>
    (modalsOpen.signatureModalSubject = {
      ...modalsOpen.signatureModalSubject,
      isOpen: !modalsOpen.signatureModalSubject.isOpen
    }),
  openModal: () =>
    (modalsOpen.signatureModalSubject = {
      ...modalsOpen.signatureModalSubject,
      isOpen: true
    }),
  startSigning: () =>
    (modalsOpen.signatureModalSubject = {
      ...modalsOpen.signatureModalSubject,
      signing: true
    }),
  stopSigning: () =>
    (modalsOpen.signatureModalSubject = {
      ...modalsOpen.signatureModalSubject,
      signing: false
    }),
  onModalUnmounted: () => 
    (modalsOpen.signatureModalSubject = {
      ...modalsOpen.signatureModalSubject,
      oneClickAuthMode: false,
      signing: false
    }),
  closeModal: () => {
    modalsOpen.signatureModalSubject = {
      ...modalsOpen.signatureModalSubject,
      isOpen: false,
    }
  },
  getModalState: () => modalsOpen.signatureModalSubject
}

// @ts-ignore
window.signatureModalService = signatureModalService;

export const pwaModalService = {
  toggleModal: () => (modalsOpen.pwaModalSubject = !modalsOpen.pwaModalSubject),
  openModal: () => (modalsOpen.pwaModalSubject = true),
  closeModal: () => (modalsOpen.pwaModalSubject = false)
}

export const notificationPwaModalService = {
  toggleModal: () => (modalsOpen.notificationPwaModalSubject = !modalsOpen.pwaModalSubject),
  openModal: () => (modalsOpen.notificationPwaModalSubject = true),
  closeModal: () => (modalsOpen.notificationPwaModalSubject = false),
  getModalState: () => modalsOpen.notificationPwaModalSubject
}

export const preferencesModalService = {
  toggleModal: (appId?: string) =>
    (modalsOpen.preferencesModalSubject = {
      preferencesModalAppId: appId,
      isOpen: !modalsOpen.preferencesModalSubject.isOpen
    }),
  closeModal: () => {
    setTimeout(() => {
      modalsOpen.preferencesModalSubject.preferencesModalAppId = undefined
    }, 50)
    modalsOpen.preferencesModalSubject.isOpen = false
  },
  getModalState: () => modalsOpen.preferencesModalSubject
}

export const subscribeModalService = {
  toggleModal: (metadata: NotifyClientTypes.Metadata) => {
    modalsOpen.subscribeModalSubject = {
      metadata,
      isOpen: !modalsOpen.subscribeModalSubject.isOpen
    }
  },
  openModal: (metadata: NotifyClientTypes.Metadata) =>
    (modalsOpen.subscribeModalSubject = {
      metadata,
      isOpen: true
    }),
  closeModal: () =>
    (modalsOpen.subscribeModalSubject = {
      metadata: undefined,
      isOpen: false
    }),
  getModalState: () => modalsOpen.subscribeModalSubject
}

export const unsubscribeModalService = {
  toggleModal: (appId?: string) =>
    (modalsOpen.unsubscribeModalSubject = {
      unsubscribeModalAppId: appId,
      isOpen: !modalsOpen.unsubscribeModalSubject.isOpen
    }),
  closeModal: () =>
    (modalsOpen.unsubscribeModalSubject = {
      unsubscribeModalAppId: undefined,
      isOpen: false
    }),
  getModalState: () => modalsOpen.unsubscribeModalSubject
}

export const contactsModalService = {
  toggleModal: () => (modalsOpen.contactsModalSubject = !modalsOpen.contactsModalSubject),
  openModal: () => (modalsOpen.contactsModalSubject = true),
  closeModal: () => (modalsOpen.contactsModalSubject = false),
  getModalState: () => modalsOpen.contactsModalSubject
}
