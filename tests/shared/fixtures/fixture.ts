import { test as base } from '@playwright/test'

import { ModalPage } from '../pages/InboxPage'
import { ModalValidator } from '../validators/ModalValidator'

// Declare the types of fixtures to use
export interface ModalFixture {
  modalPage: ModalPage
  modalValidator: ModalValidator
  library: string
}

export const test = base.extend<ModalFixture>({
  library: ['wagmi', { option: true }],
  modalPage: async ({ page, library }, use) => {
    const modalPage = new ModalPage(page)
    await modalPage.load()
    await use(modalPage)
  },
  modalValidator: async ({ modalPage }, use) => {
    const modalValidator = new ModalValidator(modalPage.page)
    await use(modalValidator)
  }
})
export { expect } from '@playwright/test'
