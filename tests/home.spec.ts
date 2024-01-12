import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Web3Inbox/);
});

test('welcome message', async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Welcome to Web3Inbox")).toBeVisible();
});
