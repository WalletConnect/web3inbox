import { type Locator, type Page, expect } from '@playwright/test'

import { BASE_URL } from '../../shared/constants'

export class SettingsPage {
  private readonly baseURL = BASE_URL

  constructor(public readonly page: Page) {}

  async load() {
    await this.page.goto(`${this.baseURL}`)
  }

  async goToNotificationSettings() {
    await this.page.goto(`${this.baseURL}settings/notifications`)
  }

  async displayCustomDapp(dappUrl: string) {
    await this.page.getByPlaceholder('app.example.com').fill(dappUrl)
    await this.page.getByRole('button', { name: "Save", exact: true}).click()
  }

}
