import { test as base } from '@playwright/test'

import { InboxPage } from '../pages/InboxPage'
import { ModalValidator } from '../validators/ModalValidator'

// Declare the types of fixtures to use
export interface ModalFixture {
  inboxPage: InboxPage
  inboxValidator: ModalValidator
  library: string
}

export const test = base.extend<ModalFixture>({
  inboxPage: async ({ page }, use) => {
    const modalPage = new ModalPage(page)
    await modalPage.load()
    await use(modalPage)
  },
  inboxValidator: async ({ modalPage }, use) => {
    const modalValidator = new ModalValidator(modalPage.page)
    await use(modalValidator)
  }
})
export { expect } from '@playwright/test'
