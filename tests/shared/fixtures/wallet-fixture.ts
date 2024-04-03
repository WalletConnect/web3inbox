import { WalletPage } from '../pages/WalletPage'
import { WalletValidator } from '../validators/WalletValidator'
import { test as base } from './fixture'

// Declare the types of fixtures to use
interface ModalWalletFixture {
  walletPage: WalletPage
  walletValidator: WalletValidator
}

export const testWallet = base.extend<ModalWalletFixture>({
  walletPage: async ({ context }, use) => {
    // Use a new page, to open alongside the modal
    const walletPage = new WalletPage(await context.newPage())
    await walletPage.load()
    await use(walletPage)
  },
  walletValidator: async ({ walletPage }, use) => {
    const walletValidator = new WalletValidator(walletPage.page)
    await use(walletValidator)
  }
})
export { expect } from '@playwright/test'
