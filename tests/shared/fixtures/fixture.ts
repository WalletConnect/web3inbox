import { test as base } from '@playwright/test'

import { NotifyServer } from '../helpers/notifyServer'
import { InboxPage } from '../pages/InboxPage'
import { SettingsPage } from '../pages/SettingsPage'
import { InboxValidator } from '../validators/ModalValidator'

// Declare the types of fixtures to use
export interface ModalFixture {
  inboxPage: InboxPage
  inboxValidator: InboxValidator
  settingsPage: SettingsPage
  notifyServer: NotifyServer
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
  },
  // Have to pass same page object to maintain state between pages
  settingsPage: async ({ inboxPage }, use) => {
    const settingsPage = new SettingsPage(inboxPage.page)
    settingsPage.load()
    use(settingsPage)
  },
  notifyServer: async ({}, use) => {
    const notifyServer = new NotifyServer()
    use(notifyServer)
  }
})
export { expect } from '@playwright/test'
