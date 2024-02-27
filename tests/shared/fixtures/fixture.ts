import { test as base } from '@playwright/test'

import { InboxPage } from '../pages/InboxPage'
import { InboxValidator } from '../validators/ModalValidator'

// Declare the types of fixtures to use
export interface ModalFixture {
  inboxPage: InboxPage
  inboxValidator: InboxValidator
  library: string
}

export const test = base.extend<ModalFixture>({
  inboxPage: async ({ page }, use) => {
    const inboxPage = new InboxPage(page)
    await inboxPage.load()
    await use(inboxPage)
  },
  inboxValidator: async ({ inboxPage }, use) => {
    const modalValidator = new InboxValidator(inboxPage.page)
    await use(modalValidator)
  }
})
export { expect } from '@playwright/test'
