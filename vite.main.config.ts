import react from '@vitejs/plugin-react'
import autoprefixer from 'autoprefixer'
import path from 'path'
import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { VitePWA } from 'vite-plugin-pwa'
import type { VitePWAOptions } from 'vite-plugin-pwa'

const pwaOptions: Partial<VitePWAOptions> = {
  mode: 'production',
  base: '/',
  strategies: 'injectManifest',
  srcDir: 'src',
  filename: 'main-sw.ts',
  injectManifest: {
    injectionPoint: undefined
  },
  injectRegister: 'inline',
  registerType: 'autoUpdate',
  includeAssets: ['favicon.svg'],
  manifest: {
    name: 'Web3Inbox',
    short_name: 'Web3Inbox',
    icons: [
      {
        src: 'pwa-196x196.png',
        sizes: '196x196',
        type: 'image/png'
      },
      {
        src: 'pwa-270x270.png',
        sizes: '270x270',
        type: 'image/png'
      },
      {
        src: 'pwa-270x270.png',
        sizes: '270x270',
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
export default defineConfig(() => {
  return {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
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
      VitePWA(pwaOptions)
    ],
    css: {
      postcss: {
        plugins: [autoprefixer({})]
      }
    }
  }
})
