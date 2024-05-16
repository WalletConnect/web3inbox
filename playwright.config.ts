import { defineConfig, devices } from '@playwright/test'
import { config } from 'dotenv'

config({ path: './.env' })

const baseURL =
  process.env['BASE_URL'] ||
  (process.env.PRE_BUILD ? 'http://localhost:4173/' : 'http://localhost:5173')

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  timeout: 60_000,
  retries: 2,
  /* Parallel tests currently blocked. */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL,
    /* Collect trace regardless so we can debug latency regressions. See https://playwright.dev/docs/trace-viewer */
    trace: 'on',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    }
    // {
    //   name: 'safari',
    //   use: { ...devices['Desktop Safari'] }
    // }
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: process.env.PRE_BUILD ? 'yarn preview' : 'VITE_CI=true yarn dev',
    url: baseURL,
    reuseExistingServer: !process.env.CI
  }
})
