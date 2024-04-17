# Functional Tests

We use Playwright as our functional test runner. It's configured to try multiple permutations:

- Browsers: Chromium/Firefox

## Running Tests

- `yarn playwright:test` to run in default mode (make sure your `.env` is set up)
- `yarn playwright:debug` to step by step see what the tests are doing

## Debugging

For scenarios when tests pass locally but not remotely you can `await this.page.screenshot({ path: './screenshots/wallet.png' })` and the screenshot will be uploaded to GitHub Actions.

## Running from GitHub Actions

These tests can be run from GitHub Actions both from this and other repositories.

You can tweak what's under test by setting the `BASE_URL` and `WALLET_URL` (default 'https://react-wallet.walletconnect.com/') environment variables.
