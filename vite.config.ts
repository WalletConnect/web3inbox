import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { VitePWA } from 'vite-plugin-pwa'
import type { VitePWAOptions } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react'
import autoprefixer from 'autoprefixer'

const pwaOptions: Partial<VitePWAOptions> = {
  mode: 'production',
  base: '/',
  strategies: 'injectManifest',
  includeAssets: ['favicon.svg'],
  srcDir: 'src',
  filename: 'main-sw.ts',
  manifest: {
    name: 'Web3Inbox',
    short_name: 'Web3Inbox',
    icons: [
      {
        src: 'pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: 'pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png'
      },
      {
        src: 'pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable'
      }
    ]
  },
  devOptions: {
    enabled: process.env.SW_DEV === 'true',
    /* when using generateSW the PWA plugin will switch to classic */
    type: 'module',
    navigateFallback: 'index.html'
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: 'es2020'
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020'
    }
  },
  plugins: [
    react(),
    nodePolyfills({
      protocolImports: true
    }),
    VitePWA({
      ...pwaOptions
    })
  ],
  css: {
    postcss: {
      plugins: [autoprefixer({})]
    }
  }
})
