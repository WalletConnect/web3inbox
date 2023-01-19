# Web3Inbox

A dApp that will show off capabilities of Push and Chat APIs.

Deployment: https://web3inbox-dev-hidden.vercel.app/login

## Installation

Install dependencies:

```bash
yarn
```

Set up your local environment variables by copying the example into your own `.env` file:

> Note: You will need to substitute the `VITE_PROJECT_ID` placeholder value inside `.env` with your own project ID
> from [cloud.walletconnect.com](https://cloud.walletconnect.com).

```bash
cp .env.example .env
```

Run the development server:

```bash
yarn dev
```

## Deployment

Web3Inbox is currently deployed via [Vercel](https://vercel.com/walletconnect/web3inbox-dev-hidden).

To deploy, simply push your branch to GitHub and Vercel will automatically deploy it.
